import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Operation } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Truck, DollarSign, Sun, Wheat } from "lucide-react";

interface HistoryTableProps {
  operations: Operation[];
}

export function HistoryTable({ operations }: HistoryTableProps) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredOperations = operations.filter(op => {
    const typeMatch = typeFilter === "all" || op.type === typeFilter;
    const dateMatch = !dateFilter || format(op.createdAt, "yyyy-MM-dd") === dateFilter;
    return typeMatch && dateMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <Truck className="mr-1" size={14} />;
      case "sale":
        return <DollarSign className="mr-1" size={14} />;
      case "drying":
        return <Sun className="mr-1" size={14} />;
      case "feed":
        return <Wheat className="mr-1" size={14} />;
      default:
        return null;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "purchase":
        return "Compra";
      case "sale":
        return "Venda";
      case "drying":
        return "Secagem";
      case "feed":
        return "Ração";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-blue-100 text-blue-800";
      case "sale":
        return "bg-green-100 text-green-800";
      case "drying":
        return "bg-orange-100 text-orange-800";
      case "feed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído";
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em andamento";
      default:
        return status;
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const formatQuantity = (value: string) => {
    return `${parseFloat(value).toLocaleString('pt-BR')} ton`;
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
                <SelectItem value="purchase">Compra</SelectItem>
                <SelectItem value="sale">Venda</SelectItem>
                <SelectItem value="drying">Secagem</SelectItem>
                <SelectItem value="feed">Ração</SelectItem>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhuma operação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredOperations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="whitespace-nowrap text-sm text-gray-900">
                      {format(operation.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
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
