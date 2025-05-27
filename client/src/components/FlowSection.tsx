import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Sun, DollarSign, Wheat, ArrowRight } from "lucide-react";

interface FlowMetrics {
  purchase: number;
  sales: number;
  drying: number;
  feed: number;
  balance: number;
}

interface FlowSectionProps {
  metrics: FlowMetrics;
}

export function FlowSection({ metrics }: FlowSectionProps) {
  const formatTons = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <Card className="border border-gray-200 mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Fluxo de Operações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Entrada */}
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="text-blue-500 text-2xl" size={32} />
            </div>
            <h4 className="font-semibold text-gray-800">Compra</h4>
            <p className="text-2xl font-bold text-blue-500 mt-2">
              {formatTons(metrics.purchase)}
            </p>
            <p className="text-xs text-gray-500">toneladas</p>
          </div>

          {/* Setas */}
          <div className="flex-1 mx-8">
            <div className="flex items-center justify-center space-x-4">
              <ArrowRight className="text-gray-400 text-2xl" size={24} />
              <ArrowRight className="text-gray-400 text-2xl" size={24} />
              <ArrowRight className="text-gray-400 text-2xl" size={24} />
            </div>
          </div>

          {/* Saídas */}
          <div className="flex space-x-8">
            {/* Secagem */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sun className="text-orange-500 text-lg" size={20} />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">Secagem</h4>
              <p className="text-lg font-bold text-orange-500 mt-1">
                {formatTons(metrics.drying)}
              </p>
              <p className="text-xs text-gray-500">ton</p>
            </div>

            {/* Venda */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="text-green-500 text-lg" size={20} />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">Venda</h4>
              <p className="text-lg font-bold text-green-500 mt-1">
                {formatTons(metrics.sales)}
              </p>
              <p className="text-xs text-gray-500">ton</p>
            </div>

            {/* Ração */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wheat className="text-yellow-600 text-lg" size={20} />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">Ração</h4>
              <p className="text-lg font-bold text-yellow-600 mt-1">
                {formatTons(metrics.feed)}
              </p>
              <p className="text-xs text-gray-500">ton</p>
            </div>
          </div>
        </div>

        {/* Resumo do saldo */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Saldo Final:</span>
            <span className={`text-xl font-bold ${metrics.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.balance >= 0 ? '+' : ''}{formatTons(metrics.balance)} toneladas
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
