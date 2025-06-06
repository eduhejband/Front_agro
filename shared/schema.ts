import { z } from "zod";

// Spring Boot Operation types
export const OperationType = {
  PURCHASE: "PURCHASE",
  SALE: "SALE", 
  DRYING: "DRYING",
  FEED: "FEED"
} as const;

export const OperationStatus = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS"
} as const;

// Operation interface matching Spring Boot OperationDTO
export interface Operation {
  id: number;
  type: keyof typeof OperationType;
  quantity: number;
  value: number;
  location: string;
  status: keyof typeof OperationStatus;
  createdAt: string; // ISO date string from Spring Boot
}

// Create operation schema for forms
export const insertOperationSchema = z.object({
  type: z.enum(["PURCHASE", "SALE", "DRYING", "FEED"]),
  quantity: z.number().min(0.01, "Quantidade deve ser maior que zero"),
  value: z.number().min(0.01, "Valor deve ser maior que zero"),
  location: z.string().min(1, "Localização é obrigatória"),
  status: z.enum(["COMPLETED", "PENDING", "IN_PROGRESS"]).default("COMPLETED"),
});

export type InsertOperation = z.infer<typeof insertOperationSchema>;

// Dashboard metrics interface matching Spring Boot
export interface DashboardMetrics {
  totalInventory: number;
  monthlyProfit: number;
  operationalBalance: number;
  todayOperations: number;
  pendingOperations: number;
  flow: {
    purchase: number;
    sales: number;
    drying: number;
    feed: number;
    balance: number;
  };
}