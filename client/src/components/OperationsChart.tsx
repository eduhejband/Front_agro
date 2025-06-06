import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Operation } from "@shared/schema";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface OperationsChartProps {
  operations: Operation[];
}

export function OperationsChart({ operations }: OperationsChartProps) {
  const [period, setPeriod] = useState("6");

  const getChartData = () => {
    const months = parseInt(period);
    const now = new Date();
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthOperations = operations.filter(op => {
        const opDate = new Date(op.createdAt);
        return opDate >= monthStart && opDate <= monthEnd;
      });

      const purchases = monthOperations
        .filter(op => op.type === "PURCHASE")
        .reduce((sum, op) => sum + op.quantity, 0);

      const sales = monthOperations
        .filter(op => op.type === "SALE")
        .reduce((sum, op) => sum + op.quantity, 0);

      data.push({
        month: format(monthDate, "MMM", { locale: ptBR }),
        compras: purchases,
        vendas: sales,
      });
    }

    return data;
  };

  const chartData = getChartData();

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Movimentação Mensal
          </CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Últimos 12 meses</SelectItem>
              <SelectItem value="24">Últimos 2 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${Number(value).toLocaleString('pt-BR')} ton`,
                name === 'compras' ? 'Compras' : 'Vendas'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="compras" 
              stroke="#2196F3" 
              strokeWidth={2}
              name="Compras"
            />
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="#4CAF50" 
              strokeWidth={2}
              name="Vendas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
