import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Operation } from "@shared/schema";

interface OutputChartProps {
  operations: Operation[];
}

export function OutputChart({ operations }: OutputChartProps) {
  const getOutputData = () => {
    const sales = operations
      .filter(op => op.type === "SALE")
      .reduce((sum, op) => sum + op.quantity, 0);

    const drying = operations
      .filter(op => op.type === "DRYING")
      .reduce((sum, op) => sum + op.quantity, 0);

    const feed = operations
      .filter(op => op.type === "FEED")
      .reduce((sum, op) => sum + op.quantity, 0);

    return [
      { name: 'Venda', value: sales, color: '#4CAF50' },
      { name: 'Secagem', value: drying, color: '#FF9800' },
      { name: 'Ração', value: feed, color: '#FF5722' },
    ].filter(item => item.value > 0);
  };

  const data = getOutputData();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Distribuição de Saídas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${Number(value).toLocaleString('pt-BR')} ton`, 'Quantidade']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
