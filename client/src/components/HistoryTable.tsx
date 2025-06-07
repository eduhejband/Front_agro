import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Operation } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Truck, DollarSign, Sun, Wheat, Edit2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HistoryTableProps {
  operations: Operation[];
  onEditOperation: (operation: Operation) => void;
}

export function HistoryTable({ operations, onEditOperation }: HistoryTableProps) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const filteredOperations = operations.filter(op => {
    const typeMatch = typeFilter === "all" || op.type === typeFilter;
    const dateMatch = !dateFilter || format(new Date(op.createdAt), "yyyy-MM-dd") === dateFilter;
    return typeMatch && dateMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return <Truck className="mr-1" size={14} />;
      case "SALE":
        return <DollarSign className="mr-1" size={14} />;
      case "DRYING":
        return <Sun className="mr-1" size={14} />;
      case "FEED":
        return <Wheat className="mr-1" size={14} />;
      default:
        return null;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return "Compra";
      case "SALE":
        return "Venda";
      case "DRYING":
        return "Secagem";
      case "FEED":
        return "Ração";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return "bg-blue-100 text-blue-800";
      case "SALE":
        return "bg-green-100 text-green-800";
      case "DRYING":
        return "bg-orange-100 text-orange-800";
      case "FEED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Concluído";
      case "PENDING":
        return "Pendente";
      case "IN_PROGRESS":
        return "Em andamento";
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatQuantity = (value: number) => {
    return `${value.toLocaleString('pt-BR')} ton`;
  };

  const deleteOperationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/operations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/operations"] });
      queryClient.invalidateQueries({ queryKey: ["/dashboard/metrics"] });
      toast({
        title: "Sucesso",
        description: "Operação deletada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao deletar operação",
        variant: "destructive",
      });
    },
  });

  const handleDeleteOperation = (operation: Operation) => {
    if (confirm(`Tem certeza que deseja deletar a operação ${getTypeName(operation.type)} de ${formatQuantity(operation.quantity)}?`)) {
      deleteOperationMutation.mutate(operation.id);
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Histórico de Operações
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="PURCHASE">Compra</SelectItem>
                <SelectItem value="SALE">Venda</SelectItem>
                <SelectItem value="DRYING">Secagem</SelectItem>
                <SelectItem value="FEED">Ração</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Origem/Destino</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhuma operação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredOperations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(operation.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getTypeColor(operation.type)}>
                        {getTypeIcon(operation.type)}
                        {getTypeName(operation.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {formatQuantity(operation.quantity)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {formatCurrency(operation.value)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {operation.location}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(operation.status)}>
                        {getStatusName(operation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditOperation(operation)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOperation(operation)}
                          disabled={deleteOperationMutation.isPending}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredOperations.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Mostrando {filteredOperations.length} de {operations.length} operações
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
