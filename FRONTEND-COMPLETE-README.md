# 🌾 Sistema de Gestão de Milho - Frontend React

## 📋 Guia Completo de Instalação

### Passo 1: Criar projeto Vite + React

```bash
npm create vite@latest corn-management-frontend -- --template react-ts
cd corn-management-frontend
```

### Passo 2: Instalar todas as dependências

```bash
# Dependências principais
npm install @tanstack/react-query @hookform/resolvers wouter
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-toast
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog
npm install @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible
npm install @radix-ui/react-dropdown-menu @radix-ui/react-hover-card
npm install @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress
npm install @radix-ui/react-radio-group @radix-ui/react-scroll-area
npm install @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot
npm install @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle
npm install @radix-ui/react-tooltip

# Estilização e utilidades
npm install tailwindcss @tailwindcss/typography autoprefixer postcss
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
npm install cmdk

# Ícones e gráficos
npm install lucide-react recharts date-fns

# Formulários
npm install react-hook-form zod

# TypeScript types
npm install @types/node
```

### Passo 3: Configurar Tailwind CSS

```bash
npx tailwindcss init -p
```

### Passo 4: Configurar shadcn/ui

```bash
npx shadcn-ui@latest init
```

Quando perguntado, use estas configurações:
- Would you like to use TypeScript? → Yes
- Which style would you like to use? → Default
- Which color would you like to use as base color? → Slate
- Where is your global CSS file? → src/index.css
- Would you like to use CSS variables for colors? → Yes
- Where is your tailwind.config.js located? → tailwind.config.ts
- Configure the import alias for components? → src/components
- Configure the import alias for utils? → src/lib/utils

### Passo 5: Instalar componentes shadcn/ui

```bash
npx shadcn-ui@latest add button card dialog input label select table badge skeleton toast
```

## 📁 Estrutura de arquivos

Substitua/crie os seguintes arquivos:

### package.json
```json
{
  "name": "corn-management-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "@tanstack/react-query": "^5.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "recharts": "^2.8.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "wouter": "^2.12.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 🚀 Executar o projeto

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:5173`

## 📝 Arquivos de código

Após a configuração inicial, você precisará substituir os arquivos do projeto atual pelos arquivos já funcionais que estão neste projeto Replit.

### Arquivos principais para copiar:

1. **src/index.css** - Estilos globais
2. **src/main.tsx** - Entry point
3. **src/App.tsx** - Componente principal
4. **src/lib/utils.ts** - Utilitários
5. **src/lib/queryClient.ts** - Configuração TanStack Query
6. **src/hooks/use-toast.ts** - Hook de toast
7. **src/pages/Dashboard.tsx** - Página principal
8. **src/pages/not-found.tsx** - Página 404
9. **src/components/** - Todos os componentes
10. **shared/schema.ts** - Esquemas de dados

## 🔧 Configuração da API

O frontend espera uma API rodando em `http://localhost:5000` com os endpoints:

- `GET /api/operations` - Listar operações
- `POST /api/operations` - Criar operação
- `GET /api/dashboard/metrics` - Métricas

## ✅ Verificação

Após seguir todos os passos:

1. O projeto deve compilar sem erros
2. Dashboard deve carregar com dados do backend
3. Gráficos devem exibir informações
4. Modal de nova operação deve funcionar
5. Histórico deve mostrar todas as operações

Seu frontend estará pronto para uso!