# Modelo React - Sistema de Gestão de Milho

## 📋 Descrição
Sistema completo para gestão de plantio de milho com dashboard estilo PagSeguro.

## 🌾 Funcionalidades
- **1 Entrada**: Compra de milho
- **3 Saídas**: Secagem, Venda, Ração
- **Dashboard**: Métricas em tempo real
- **Gráficos**: Compra, venda, lucro
- **Saldo**: Positivo/negativo baseado em entradas vs saídas
- **Histórico**: Todas operações com data/hora

## 🛠 Tecnologias
- React 18 + TypeScript + Vite
- TanStack Query (estado)
- shadcn/ui + Tailwind CSS
- Recharts (gráficos)
- React Hook Form + Zod
- Wouter (rotas)
- Express + Node.js (backend)

## 📁 Estrutura do Projeto

```
corn-management-react/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── MetricCards.tsx  # Cards de métricas
│   │   │   ├── OperationsChart.tsx # Gráfico linha
│   │   │   ├── OutputChart.tsx  # Gráfico pizza
│   │   │   ├── FlowSection.tsx  # Fluxo operações
│   │   │   ├── HistoryTable.tsx # Tabela histórico
│   │   │   └── NewOperationModal.tsx # Modal nova operação
│   │   ├── pages/
│   │   │   └── Dashboard.tsx    # Página principal
│   │   ├── lib/
│   │   │   ├── queryClient.ts   # Config TanStack Query
│   │   │   └── utils.ts         # Utilitários
│   │   ├── hooks/
│   │   │   └── use-toast.ts     # Hook toast
│   │   ├── App.tsx              # App principal
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Estilos globais
│   └── index.html
├── server/
│   ├── index.ts                 # Servidor Express
│   ├── routes.ts                # Rotas API
│   ├── storage.ts               # Storage em memória
│   └── vite.ts                  # Config Vite
├── shared/
│   └── schema.ts                # Schemas Drizzle/Zod
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Instalação

```bash
# Clonar estrutura
npm create vite@latest corn-management --template react-ts
cd corn-management

# Instalar dependências
npm install @tanstack/react-query @hookform/resolvers wouter
npm install @radix-ui/react-dialog @radix-ui/react-select
npm install tailwindcss @tailwindcss/typography
npm install lucide-react recharts date-fns
npm install drizzle-orm drizzle-zod zod
npm install express @types/express
npm install react-hook-form
npm install class-variance-authority clsx tailwind-merge

# Executar
npm run dev
```

## 📊 Componentes Principais

### 1. MetricCards.tsx
```tsx
// Cards superiores com métricas
- Estoque Total (toneladas)
- Lucro Mensal (R$)
- Saldo Operacional (+/-)
- Operações Hoje
```

### 2. OperationsChart.tsx
```tsx
// Gráfico de linha
- Compras vs Vendas mensais
- Filtro de período (6, 12, 24 meses)
- Formatação brasileira
```

### 3. OutputChart.tsx
```tsx
// Gráfico pizza
- Distribuição das saídas
- Secagem, Venda, Ração
- Percentuais e totais
```

### 4. FlowSection.tsx
```tsx
// Fluxo visual
Compra → [Secagem, Venda, Ração]
Saldo final calculado
```

### 5. HistoryTable.tsx
```tsx
// Tabela histórico
- Filtros por tipo e data
- Status das operações
- Data/hora precisas
```

## 🔄 API Endpoints

```
GET /api/operations              # Todas operações
GET /api/operations/type/:type   # Por tipo
POST /api/operations             # Criar
PUT /api/operations/:id          # Atualizar
DELETE /api/operations/:id       # Deletar
GET /api/dashboard/metrics       # Métricas
```

## 📝 Schema de Dados

```typescript
interface Operation {
  id: number;
  type: "purchase" | "sale" | "drying" | "feed";
  quantity: string;  // toneladas
  value: string;     // BRL
  location: string;  // origem/destino
  status: "completed" | "pending" | "in_progress";
  createdAt: Date;
}
```

## 🎨 Design System
- **Cores**: Verde (agricultura), Azul (compra), Laranja (secagem)
- **Layout**: Sidebar + Main Content
- **Responsivo**: Mobile-first
- **Tema**: Claro/escuro suportado

## 📱 Próximos Passos
1. Banco de dados real (PostgreSQL)
2. Autenticação de usuários
3. Relatórios exportáveis
4. App mobile (React Native)
5. Integrações externas (clima, cotação)