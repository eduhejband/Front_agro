import { users, operations, type User, type InsertUser, type Operation, type InsertOperation } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Operation methods
  getOperations(): Promise<Operation[]>;
  getOperationsByType(type: string): Promise<Operation[]>;
  getOperationsByDateRange(startDate: Date, endDate: Date): Promise<Operation[]>;
  createOperation(operation: InsertOperation): Promise<Operation>;
  updateOperation(id: number, operation: Partial<InsertOperation>): Promise<Operation | undefined>;
  deleteOperation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private operations: Map<number, Operation>;
  private currentUserId: number;
  private currentOperationId: number;

  constructor() {
    this.users = new Map();
    this.operations = new Map();
    this.currentUserId = 1;
    this.currentOperationId = 1;
    
    // Add some sample data for testing
    this.seedData();
  }

  private seedData() {
    // Add sample operations with realistic dates
    const now = new Date();
    const sampleOps: Omit<Operation, 'id'>[] = [
      {
        type: "purchase",
        quantity: "250.00",
        value: "87500.00",
        location: "Fazenda São José",
        status: "completed",
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        type: "sale",
        quantity: "180.00",
        value: "72000.00",
        location: "Cooperativa ABC",
        status: "completed",
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        type: "drying",
        quantity: "120.00",
        value: "3600.00",
        location: "Secador Central",
        status: "in_progress",
        createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
      },
      {
        type: "feed",
        quantity: "80.00",
        value: "24000.00",
        location: "Fábrica de Ração Sul",
        status: "completed",
        createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000), // 10 hours ago
      },
      {
        type: "purchase",
        quantity: "300.00",
        value: "105000.00",
        location: "Produtor Local",
        status: "completed",
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    sampleOps.forEach(op => {
      const operation: Operation = { ...op, id: this.currentOperationId++ };
      this.operations.set(operation.id, operation);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getOperations(): Promise<Operation[]> {
    return Array.from(this.operations.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getOperationsByType(type: string): Promise<Operation[]> {
    return Array.from(this.operations.values())
      .filter(op => op.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOperationsByDateRange(startDate: Date, endDate: Date): Promise<Operation[]> {
    return Array.from(this.operations.values())
      .filter(op => op.createdAt >= startDate && op.createdAt <= endDate)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createOperation(insertOperation: InsertOperation): Promise<Operation> {
    const id = this.currentOperationId++;
    const operation: Operation = {
      ...insertOperation,
      id,
      createdAt: new Date(),
    };
    this.operations.set(id, operation);
    return operation;
  }

  async updateOperation(id: number, updateData: Partial<InsertOperation>): Promise<Operation | undefined> {
    const existing = this.operations.get(id);
    if (!existing) return undefined;

    const updated: Operation = { ...existing, ...updateData };
    this.operations.set(id, updated);
    return updated;
  }

  async deleteOperation(id: number): Promise<boolean> {
    return this.operations.delete(id);
  }
}

export const storage = new MemStorage();
