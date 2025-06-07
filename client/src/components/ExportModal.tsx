import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Operation } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useState } from "react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operations: Operation[];
}

const exportSchema = z.object({
  startDate: z.string().min(1, "Data inicial é obrigatória"),
  endDate: z.string().min(1, "Data final é obrigatória"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: "Data final deve ser posterior à data inicial",
  path: ["endDate"],
});

type ExportFormData = z.infer<typeof exportSchema>;

export function ExportModal({ open, onOpenChange, operations }: ExportModalProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ExportFormData>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

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

  const calculateBalance = (filteredOps: Operation[]) => {
    let totalValue = 0;
    let totalQuantity = 0;

    filteredOps.forEach(op => {
      if (op.type === "PURCHASE") {
        totalValue -= op.value;
        totalQuantity += op.quantity;
      } else {
        totalValue += op.value;
        totalQuantity -= op.quantity;
      }
    });

    return { totalValue, totalQuantity };
  };

  const generatePDF = (data: ExportFormData) => {
    setIsGenerating(true);

    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate + "T23:59:59");

      const filteredOperations = operations.filter(op => {
        const opDate = new Date(op.createdAt);
        return opDate >= startDate && opDate <= endDate;
      });

      if (filteredOperations.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhuma operação encontrada no período selecionado",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      const doc = new jsPDF();

      // Cabeçalho
      doc.setFontSize(20);
      doc.text("CornManager - Relatório de Operações", 20, 20);

      doc.setFontSize(12);
      doc.text(`Período: ${format(startDate, "dd/MM/yyyy", { locale: ptBR })} à ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`, 20, 35);
      doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`, 20, 45);

      // Preparar dados da tabela
      const tableData = filteredOperations.map(op => [
        format(new Date(op.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }),
        getTypeName(op.type),
        formatQuantity(op.quantity),
        formatCurrency(op.value),
        op.location,
        getStatusName(op.status)
      ]);

      // Tabela de operações
      (doc as any).autoTable({
        head: [['Data/Hora', 'Tipo', 'Quantidade', 'Valor', 'Local', 'Status']],
        body: tableData,
        startY: 60,
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
      });

      // Cálculo do saldo do período
      const { totalValue, totalQuantity } = calculateBalance(filteredOperations);
      const finalY = (doc as any).lastAutoTable.finalY + 20;

      // Resumo financeiro
      doc.setFontSize(14);
      doc.text("Resumo do Período", 20, finalY);

      doc.setFontSize(12);
      doc.text(`Total de Operações: ${filteredOperations.length}`, 20, finalY + 15);
      doc.text(`Saldo de Estoque: ${formatQuantity(totalQuantity)}`, 20, finalY + 25);
      doc.text(`Saldo Financeiro: ${formatCurrency(totalValue)}`, 20, finalY + 35);

      // Breakdown por tipo
      const purchases = filteredOperations.filter(op => op.type === "PURCHASE");
      const sales = filteredOperations.filter(op => op.type === "SALE");
      const drying = filteredOperations.filter(op => op.type === "DRYING");
      const feed = filteredOperations.filter(op => op.type === "FEED");

      doc.text("Breakdown por Tipo de Operação:", 20, finalY + 50);
      doc.text(`• Compras: ${purchases.length} (${formatQuantity(purchases.reduce((sum, op) => sum + op.quantity, 0))})`, 25, finalY + 60);
      doc.text(`• Vendas: ${sales.length} (${formatQuantity(sales.reduce((sum, op) => sum + op.quantity, 0))})`, 25, finalY + 70);
      doc.text(`• Secagem: ${drying.length} (${formatQuantity(drying.reduce((sum, op) => sum + op.quantity, 0))})`, 25, finalY + 80);
      doc.text(`• Ração: ${feed.length} (${formatQuantity(feed.reduce((sum, op) => sum + op.quantity, 0))})`, 25, finalY + 90);

      // Gerar nome do arquivo
      const fileName = `cornmanager_relatorio_${format(startDate, "dd-MM-yyyy", { locale: ptBR })}_a_${format(endDate, "dd-MM-yyyy", { locale: ptBR })}.pdf`;

      // Download do PDF
      doc.save(fileName);

      toast({
        title: "Sucesso",
        description: "Relatório PDF gerado e baixado com sucesso!",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Erro ao gerar o relatório PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: ExportFormData) => {
    generatePDF(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Relatório PDF</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              {...form.register("startDate")}
              className="mt-1"
            />
            {form.formState.errors.startDate && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              {...form.register("endDate")}
              className="mt-1"
            />
            {form.formState.errors.endDate && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.endDate.message}
              </p>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isGenerating}
            >
              {isGenerating ? "Gerando PDF..." : "Gerar PDF"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}