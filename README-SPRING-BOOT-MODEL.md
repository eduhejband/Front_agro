# Modelo Spring Boot - Sistema de Gestão de Milho

## 📋 Descrição
API REST em Spring Boot para gestão de plantio de milho com arquitetura moderna.

## 🌾 Funcionalidades
- **1 Entrada**: Compra de milho
- **3 Saídas**: Secagem, Venda, Ração
- **API REST**: Endpoints completos
- **Métricas**: Dashboard em tempo real
- **Validação**: Bean Validation + JPA
- **Documentação**: Swagger/OpenAPI

## 🛠 Tecnologias
- Spring Boot 3.2+
- Spring Data JPA
- Spring Web
- Spring Validation
- PostgreSQL/H2
- Maven
- OpenAPI 3 (Swagger)
- Lombok

## 📁 Estrutura do Projeto

```
corn-management-spring/
├── src/
│   ├── main/
│   │   ├── java/com/cornmanagement/
│   │   │   ├── CornManagementApplication.java
│   │   │   ├── config/
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── CorsConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── OperationController.java
│   │   │   │   └── DashboardController.java
│   │   │   ├── entity/
│   │   │   │   ├── Operation.java
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   ├── OperationRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── service/
│   │   │   │   ├── OperationService.java
│   │   │   │   └── DashboardService.java
│   │   │   ├── dto/
│   │   │   │   ├── OperationDTO.java
│   │   │   │   ├── CreateOperationDTO.java
│   │   │   │   └── DashboardMetricsDTO.java
│   │   │   └── exception/
│   │   │       └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── data.sql
│   └── test/
├── pom.xml
└── README.md
```

## 🚀 Configuração

### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.cornmanagement</groupId>
    <artifactId>corn-management</artifactId>
    <version>1.0.0</version>
    <name>corn-management</name>
    <description>Sistema de Gestão de Milho</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.2.0</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### application.yml
```yaml
spring:
  application:
    name: corn-management
  
  # Database Configuration
  datasource:
    url: jdbc:h2:mem:corndb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  
  h2:
    console:
      enabled: true
      path: /h2-console
  
  # JPA Configuration
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
        format_sql: true
  
  # Jackson Configuration
  jackson:
    time-zone: America/Sao_Paulo
    locale: pt_BR

# Server Configuration
server:
  port: 8080
  servlet:
    context-path: /api

# OpenAPI Documentation
springdoc:
  api-docs:
    path: /docs
  swagger-ui:
    path: /swagger
```

## 📊 Entidades

### Operation.java
```java
@Entity
@Table(name = "operations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Operation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperationType type;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;
    
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal value;
    
    @Column(nullable = false)
    private String location;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OperationStatus status = OperationStatus.COMPLETED;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    public enum OperationType {
        PURCHASE("Compra"),
        SALE("Venda"), 
        DRYING("Secagem"),
        FEED("Ração");
        
        private final String description;
        
        OperationType(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    public enum OperationStatus {
        COMPLETED("Concluído"),
        PENDING("Pendente"),
        IN_PROGRESS("Em Andamento");
        
        private final String description;
        
        OperationStatus(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
}
```

## 🔄 Controllers

### OperationController.java
```java
@RestController
@RequestMapping("/operations")
@Validated
@Tag(name = "Operations", description = "Gestão de Operações de Milho")
public class OperationController {
    
    @Autowired
    private OperationService operationService;
    
    @GetMapping
    @Operation(summary = "Listar todas as operações")
    public ResponseEntity<List<OperationDTO>> getAllOperations() {
        List<OperationDTO> operations = operationService.findAll();
        return ResponseEntity.ok(operations);
    }
    
    @GetMapping("/type/{type}")
    @Operation(summary = "Buscar operações por tipo")
    public ResponseEntity<List<OperationDTO>> getOperationsByType(
            @PathVariable Operation.OperationType type) {
        List<OperationDTO> operations = operationService.findByType(type);
        return ResponseEntity.ok(operations);
    }
    
    @GetMapping("/range")
    @Operation(summary = "Buscar operações por período")
    public ResponseEntity<List<OperationDTO>> getOperationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<OperationDTO> operations = operationService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(operations);
    }
    
    @PostMapping
    @Operation(summary = "Criar nova operação")
    public ResponseEntity<OperationDTO> createOperation(
            @Valid @RequestBody CreateOperationDTO createDTO) {
        OperationDTO operation = operationService.create(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(operation);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar operação")
    public ResponseEntity<OperationDTO> updateOperation(
            @PathVariable Long id,
            @Valid @RequestBody CreateOperationDTO updateDTO) {
        OperationDTO operation = operationService.update(id, updateDTO);
        return ResponseEntity.ok(operation);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar operação")
    public ResponseEntity<Void> deleteOperation(@PathVariable Long id) {
        operationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### DashboardController.java
```java
@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard", description = "Métricas e Estatísticas")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/metrics")
    @Operation(summary = "Obter métricas do dashboard")
    public ResponseEntity<DashboardMetricsDTO> getDashboardMetrics() {
        DashboardMetricsDTO metrics = dashboardService.getMetrics();
        return ResponseEntity.ok(metrics);
    }
}
```

## 📝 DTOs

### OperationDTO.java
```java
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OperationDTO {
    private Long id;
    private Operation.OperationType type;
    private BigDecimal quantity;
    private BigDecimal value;
    private String location;
    private Operation.OperationStatus status;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime createdAt;
}
```

### CreateOperationDTO.java
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOperationDTO {
    
    @NotNull(message = "Tipo da operação é obrigatório")
    private Operation.OperationType type;
    
    @NotNull(message = "Quantidade é obrigatória")
    @DecimalMin(value = "0.01", message = "Quantidade deve ser maior que zero")
    @Digits(integer = 8, fraction = 2, message = "Quantidade deve ter no máximo 8 dígitos inteiros e 2 decimais")
    private BigDecimal quantity;
    
    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Digits(integer = 10, fraction = 2, message = "Valor deve ter no máximo 10 dígitos inteiros e 2 decimais")
    private BigDecimal value;
    
    @NotBlank(message = "Localização é obrigatória")
    @Size(max = 255, message = "Localização deve ter no máximo 255 caracteres")
    private String location;
    
    @Builder.Default
    private Operation.OperationStatus status = Operation.OperationStatus.COMPLETED;
}
```

### DashboardMetricsDTO.java
```java
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardMetricsDTO {
    private BigDecimal totalInventory;
    private BigDecimal monthlyProfit;
    private BigDecimal operationalBalance;
    private Integer todayOperations;
    private Integer pendingOperations;
    private FlowMetricsDTO flow;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FlowMetricsDTO {
        private BigDecimal purchase;
        private BigDecimal sales;
        private BigDecimal drying;
        private BigDecimal feed;
        private BigDecimal balance;
    }
}
```

## 🔧 Services

### OperationService.java
```java
@Service
@Transactional
public class OperationService {
    
    @Autowired
    private OperationRepository operationRepository;
    
    @Transactional(readOnly = true)
    public List<OperationDTO> findAll() {
        return operationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OperationDTO> findByType(Operation.OperationType type) {
        return operationRepository.findByTypeOrderByCreatedAtDesc(type)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OperationDTO> findByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);
        
        return operationRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public OperationDTO create(CreateOperationDTO createDTO) {
        Operation operation = Operation.builder()
                .type(createDTO.getType())
                .quantity(createDTO.getQuantity())
                .value(createDTO.getValue())
                .location(createDTO.getLocation())
                .status(createDTO.getStatus())
                .build();
        
        Operation saved = operationRepository.save(operation);
        return toDTO(saved);
    }
    
    public OperationDTO update(Long id, CreateOperationDTO updateDTO) {
        Operation operation = operationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Operação não encontrada"));
        
        operation.setType(updateDTO.getType());
        operation.setQuantity(updateDTO.getQuantity());
        operation.setValue(updateDTO.getValue());
        operation.setLocation(updateDTO.getLocation());
        operation.setStatus(updateDTO.getStatus());
        
        Operation updated = operationRepository.save(operation);
        return toDTO(updated);
    }
    
    public void delete(Long id) {
        if (!operationRepository.existsById(id)) {
            throw new EntityNotFoundException("Operação não encontrada");
        }
        operationRepository.deleteById(id);
    }
    
    private OperationDTO toDTO(Operation operation) {
        return OperationDTO.builder()
                .id(operation.getId())
                .type(operation.getType())
                .quantity(operation.getQuantity())
                .value(operation.getValue())
                .location(operation.getLocation())
                .status(operation.getStatus())
                .createdAt(operation.getCreatedAt())
                .build();
    }
}
```

## 🚀 Como Executar

```bash
# Clonar o projeto
git clone <repository>
cd corn-management-spring

# Executar com Maven
./mvnw spring-boot:run

# Ou compilar e executar
./mvnw clean package
java -jar target/corn-management-1.0.0.jar
```

## 📚 Documentação API
- **Swagger UI**: http://localhost:8080/api/swagger
- **OpenAPI JSON**: http://localhost:8080/api/docs
- **H2 Console**: http://localhost:8080/api/h2-console

## 🔗 Endpoints Principais

```
GET    /api/operations              # Listar operações
POST   /api/operations              # Criar operação
PUT    /api/operations/{id}         # Atualizar operação
DELETE /api/operations/{id}         # Deletar operação
GET    /api/operations/type/{type}  # Por tipo
GET    /api/operations/range        # Por período
GET    /api/dashboard/metrics       # Métricas dashboard
```

## 🏗 Próximos Passos
1. **Segurança**: Spring Security + JWT
2. **Cache**: Redis para performance
3. **Logs**: Logback estruturado
4. **Testes**: JUnit 5 + TestContainers
5. **Deploy**: Docker + Kubernetes
6. **Monitoramento**: Actuator + Micrometer