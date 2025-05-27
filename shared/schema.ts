import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const operations = pgTable("operations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "purchase", "sale", "drying", "feed"
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("completed"), // "completed", "pending", "in_progress"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOperationSchema = createInsertSchema(operations).pick({
  type: true,
  quantity: true,
  value: true,
  location: true,
  status: true,
}).extend({
  type: z.enum(["purchase", "sale", "drying", "feed"]),
  quantity: z.string().min(1, "Quantidade é obrigatória"),
  value: z.string().min(1, "Valor é obrigatório"),
  location: z.string().min(1, "Origem/Destino é obrigatório"),
  status: z.enum(["completed", "pending", "in_progress"]).default("completed"),
});

export type InsertOperation = z.infer<typeof insertOperationSchema>;
export type Operation = typeof operations.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
