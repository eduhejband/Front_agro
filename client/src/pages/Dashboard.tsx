import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MetricCards } from "@/components/MetricCards";
import { OperationsChart } from "@/components/OperationsChart";
import { OutputChart } from "@/components/OutputChart";
import { FlowSection } from "@/components/FlowSection";
import { HistoryTable } from "@/components/HistoryTable";
import { NewOperationModal } from "@/components/NewOperationModal";
import { Sprout, BarChart3, Plus, History, Settings } from "lucide-react";
import type { Operation, DashboardMetrics } from "@shared/schema";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);

  const openNewOperationModal = () => {
    setEditingOperation(null);
    setIsModalOpen(true);
  };

  const openEditOperationModal = (operation: Operation) => {
    setEditingOperation(operation);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingOperation(null);
    }
  };

  const scrollToHistory = () => {
    const historySection = document.getElementById('history-section');
    if (historySection) {
      historySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { data: operations = [], isLoading: operationsLoading } = useQuery<Operation[]>({
    queryKey: ["/operations"],
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/dashboard/metrics"],
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar className="w-64 bg-white shadow-lg border-r">
        <SidebarHeader className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Sprout className="text-white text-lg" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">CornManager</h1>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-green-600 text-white rounded-lg">
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </a>
            <button 
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={openNewOperationModal}
            >
              <Plus size={18} />
              <span>Nova Operação</span>
            </button>
            <button 
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={scrollToHistory}
            >
              <History size={18} />
              <span>Histórico</span>
            </button>
          </nav>
        </SidebarContent>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-600 mt-1">Visão geral do seu plantio de milho</p>
            </div>
            <div className="flex space-x-4">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2" size={16} />
                Nova Operação
              </Button>
              <Button variant="outline">
                <span>Exportar</span>
              </Button>
            </div>
          </div>

          {/* Metric Cards */}
          {metrics && (
            <MetricCards metrics={metrics} isLoading={metricsLoading} />
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <OperationsChart operations={operations} />
            <OutputChart operations={operations} />
          </div>

          {/* Flow Section */}
          {metrics?.flow && (
            <FlowSection metrics={metrics.flow} />
          )}

          {/* History Table */}
          <div id="history-section">
            <HistoryTable operations={operations} onEditOperation={openEditOperationModal} />
          </div>
        </div>
      </div>

      {/* New Operation Modal */}
      <NewOperationModal 
        open={isModalOpen} 
        onOpenChange={handleModalClose}
        editingOperation={editingOperation}
      />
    </div>
  );
}
