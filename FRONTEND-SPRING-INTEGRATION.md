# 🌾 Frontend React + Spring Boot API Integration

## ✅ Alterações Realizadas

O frontend foi completamente atualizado para se comunicar com sua API Spring Boot:

### 1. Configuração da API Base URL
- **queryClient.ts**: Configurado para `http://localhost:8080/api`
- **Endpoints**: Ajustados para `/operations` e `/dashboard/metrics`

### 2. Tipos de Dados Atualizados
- **OperationType**: `PURCHASE`, `SALE`, `DRYING`, `FEED`
- **OperationStatus**: `COMPLETED`, `PENDING`, `IN_PROGRESS`
- **Operation**: Interface compatível com Spring Boot DTO
- **DashboardMetrics**: Interface para métricas do backend

### 3. Componentes Atualizados
- **NewOperationModal**: Formulário com tipos Spring Boot
- **HistoryTable**: Filtros e formatação atualizados
- **OperationsChart**: Processamento de datas ISO
- **OutputChart**: Tipos de operação atualizados
- **MetricCards**: Interface DashboardMetrics

### 4. Formatação de Dados
- **Datas**: Conversão de strings ISO para Date objects
- **Números**: Valores numéricos em vez de strings
- **Validação**: Zod schemas compatíveis

## 🚀 Como Testar

### Pré-requisitos
1. Seu backend Spring Boot rodando em `http://localhost:8080`
2. CORS configurado para `http://localhost:5173`

### Testar Conexão
```bash
# No terminal, teste se a API está respondendo:
curl http://localhost:8080/api/operations
curl http://localhost:8080/api/dashboard/metrics
```

### Iniciar Frontend
```bash
npm run dev
```

## 🔧 Configuração CORS no Spring Boot

Certifique-se de ter esta configuração no seu backend:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 📊 Endpoints Esperados

O frontend faz chamadas para:

### Operations
- `GET /api/operations` - Listar operações
- `POST /api/operations` - Criar operação
- `PUT /api/operations/{id}` - Atualizar operação
- `DELETE /api/operations/{id}` - Deletar operação

### Dashboard
- `GET /api/dashboard/metrics` - Métricas do dashboard

## 🎯 Formato de Dados Esperados

### Operation (Response)
```json
{
  "id": 1,
  "type": "PURCHASE",
  "quantity": 250.0,
  "value": 87500.0,
  "location": "Fazenda São José",
  "status": "COMPLETED",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Create Operation (Request)
```json
{
  "type": "PURCHASE",
  "quantity": 250.0,
  "value": 87500.0,
  "location": "Fazenda São José",
  "status": "COMPLETED"
}
```

### Dashboard Metrics (Response)
```json
{
  "totalInventory": 170.0,
  "monthlyProfit": 45000.0,
  "operationalBalance": 170.0,
  "todayOperations": 3,
  "pendingOperations": 1,
  "flow": {
    "purchase": 550.0,
    "sales": 180.0,
    "drying": 120.0,
    "feed": 80.0,
    "balance": 170.0
  }
}
```

## ✅ Status da Integração

Frontend totalmente preparado para sua API Spring Boot. Todas as funcionalidades devem funcionar corretamente quando o backend estiver rodando na porta 8080.