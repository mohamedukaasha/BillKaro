export interface BusinessProfile {
  name: string;
  gstin: string;
  address: string;
  phone: string;
  email: string;
  state: string;
  logo?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gstin?: string;
  address: string;
  state: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  hsnCode: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  gstRate: number;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
}

export interface InvoiceLineItem {
  id: string;
  itemId?: string;
  name: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  gstRate: number;
  amount: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "gst" | "non-gst";
  status: "draft" | "sent" | "paid" | "overdue";
  customer: Customer;
  items: InvoiceLineItem[];
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  grandTotal: number;
  discount: number;
  notes: string;
  createdAt: string;
  dueDate: string;
  paidAt?: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor: string;
  paymentMethod: string;
  receipt?: string;
}

export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  invoiceCount: number;
  paidCount: number;
  unpaidCount: number;
}

export type Page = "dashboard" | "invoices" | "create-invoice" | "expenses" | "inventory" | "reports" | "settings";
