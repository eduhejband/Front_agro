import { Card, CardContent } from "@/components/ui/card";
import { Warehouse, TrendingUp, Scale, Activity } from "lucide-react";

interface Metrics {
  totalInventory: number;
  monthlyProfit: number;
  operationalBalance: number;
  todayOperations: number;
  pendingOperations: number;
}

interface MetricCardsProps {
  metrics: Metrics;
  isLoading?: boolean;
}

export function MetricCards({ metrics, isLoading }: MetricCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTons = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Estoque Total */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Estoque Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatTons(metrics.totalInventory)}
              </p>
              <p className="text-xs text-gray-500 mt-1">toneladas</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Warehouse className="text-green-600 text-xl" size={20} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-500 text-sm font-medium">
              {metrics.operationalBalance >= 0 ? 'Positivo' : 'Negativo'}
            </span>
            <span className="text-gray-500 text-sm ml-1">estoque atual</span>
          </div>
        </CardContent>
      </Card>

      {/* Lucro Mensal */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Lucro Mensal</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(metrics.monthlyProfit)}
              </p>
              <p className="text-xs text-gray-500 mt-1">últimos 30 dias</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-yellow-600 text-xl" size={20} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className={`w-2 h-2 rounded-full mr-2 ${metrics.monthlyProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${metrics.monthlyProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.monthlyProfit >= 0 ? '+' : ''}{((metrics.monthlyProfit / Math.abs(metrics.monthlyProfit || 1)) * 100).toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-1">rendimento</span>
          </div>
        </CardContent>
      </Card>

      {/* Saldo Operacional */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Saldo Operacional</p>
              <p className={`text-2xl font-bold mt-1 ${metrics.operationalBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.operationalBalance >= 0 ? '+' : ''}{formatTons(metrics.operationalBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-1">toneladas</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Scale className="text-green-600 text-xl" size={20} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className={`w-2 h-2 rounded-full mr-2 ${metrics.operationalBalance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${metrics.operationalBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.operationalBalance >= 0 ? 'Positivo' : 'Negativo'}
            </span>
            <span className="text-gray-500 text-sm ml-1">entrada vs saída</span>
          </div>
        </CardContent>
      </Card>

      {/* Operações Hoje */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Operações Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {metrics.todayOperations}
              </p>
              <p className="text-xs text-gray-500 mt-1">transações</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="text-blue-600 text-xl" size={20} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-blue-500 text-sm font-medium">
              {metrics.pendingOperations} pendentes
            </span>
            <span className="text-gray-500 text-sm ml-1">para aprovação</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
