import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOperationSchema, type InsertOperation } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NewOperationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewOperationModal({ open, onOpenChange }: NewOperationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertOperation>({
    resolver: zodResolver(insertOperationSchema),
    defaultValues: {
      type: "PURCHASE",
      quantity: 0,
      value: 0,
      location: "",
      status: "COMPLETED",
    },
  });

  const createOperationMutation = useMutation({
    mutationFn: async (data: InsertOperation) => {
      const response = await apiRequest("POST", "/api/operations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/operations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sucesso",
        description: "Operação criada com sucesso!",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar operação",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertOperation) => {
    createOperationMutation.mutate(data);
  };

  const getLocationPlaceholder = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return "Ex: Fazenda São José";
      case "SALE":
        return "Ex: Cooperativa ABC";
      case "DRYING":
        return "Ex: Secador Central";
      case "FEED":
        return "Ex: Fábrica de Ração Sul";
      default:
        return "Digite a origem/destino";
    }
  };

  const currentType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Operação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de Operação</Label>
            <Select 
              value={form.watch("type")} 
              onValueChange={(value: any) => form.setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PURCHASE">Compra</SelectItem>
                <SelectItem value="SALE">Venda</SelectItem>
                <SelectItem value="DRYING">Secagem</SelectItem>
                <SelectItem value="FEED">Ração</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quantity">Quantidade (toneladas)</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register("quantity", { valueAsNumber: true })}
            />
            {form.formState.errors.quantity && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.quantity.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register("value", { valueAsNumber: true })}
            />
            {form.formState.errors.value && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.value.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Origem/Destino</Label>
            <Input
              id="location"
              placeholder={getLocationPlaceholder(currentType)}
              {...form.register("location")}
            />
            {form.formState.errors.location && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={form.watch("status")} 
              onValueChange={(value: any) => form.setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMPLETED">Concluído</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={createOperationMutation.isPending}
            >
              {createOperationMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
