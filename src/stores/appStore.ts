import { create } from "zustand";
import type { Invoice, Expense, InventoryItem, BusinessProfile, Customer } from "@/types";
import { mockInvoices, mockExpenses, mockInventory, mockCustomers, defaultBusinessProfile } from "@/constants/mockData";

function loadFromStorage<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved) as T;
  return fallback;
}

function saveToStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

interface AppState {
  isLoggedIn: boolean;
  businessProfile: BusinessProfile;
  invoices: Invoice[];
  expenses: Expense[];
  inventory: InventoryItem[];
  customers: Customer[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setBusinessProfile: (profile: BusinessProfile) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  updateStock: (itemId: string, quantitySold: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: loadFromStorage("bk_loggedIn", false),
  businessProfile: loadFromStorage("bk_profile", defaultBusinessProfile),
  invoices: loadFromStorage("bk_invoices", mockInvoices),
  expenses: loadFromStorage("bk_expenses", mockExpenses),
  inventory: loadFromStorage("bk_inventory", mockInventory),
  customers: loadFromStorage("bk_customers", mockCustomers),

  login: (email: string, password: string) => {
    if (email && password.length >= 4) {
      set({ isLoggedIn: true });
      saveToStorage("bk_loggedIn", true);
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isLoggedIn: false });
    saveToStorage("bk_loggedIn", false);
  },

  setBusinessProfile: (profile) => {
    set({ businessProfile: profile });
    saveToStorage("bk_profile", profile);
  },

  addInvoice: (invoice) => {
    set((state) => {
      const updated = [invoice, ...state.invoices];
      saveToStorage("bk_invoices", updated);
      return { invoices: updated };
    });
  },

  updateInvoice: (id, partial) => {
    set((state) => {
      const updated = state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...partial } : inv
      );
      saveToStorage("bk_invoices", updated);
      return { invoices: updated };
    });
  },

  deleteInvoice: (id) => {
    set((state) => {
      const updated = state.invoices.filter((inv) => inv.id !== id);
      saveToStorage("bk_invoices", updated);
      return { invoices: updated };
    });
  },

  addExpense: (expense) => {
    set((state) => {
      const updated = [expense, ...state.expenses];
      saveToStorage("bk_expenses", updated);
      return { expenses: updated };
    });
  },

  deleteExpense: (id) => {
    set((state) => {
      const updated = state.expenses.filter((e) => e.id !== id);
      saveToStorage("bk_expenses", updated);
      return { expenses: updated };
    });
  },

  addInventoryItem: (item) => {
    set((state) => {
      const updated = [item, ...state.inventory];
      saveToStorage("bk_inventory", updated);
      return { inventory: updated };
    });
  },

  updateInventoryItem: (id, partial) => {
    set((state) => {
      const updated = state.inventory.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      );
      saveToStorage("bk_inventory", updated);
      return { inventory: updated };
    });
  },

  deleteInventoryItem: (id) => {
    set((state) => {
      const updated = state.inventory.filter((item) => item.id !== id);
      saveToStorage("bk_inventory", updated);
      return { inventory: updated };
    });
  },

  addCustomer: (customer) => {
    set((state) => {
      const updated = [customer, ...state.customers];
      saveToStorage("bk_customers", updated);
      return { customers: updated };
    });
  },

  updateStock: (itemId, quantitySold) => {
    set((state) => {
      const updated = state.inventory.map((item) =>
        item.id === itemId
          ? { ...item, stock: Math.max(0, item.stock - quantitySold) }
          : item
      );
      saveToStorage("bk_inventory", updated);
      return { inventory: updated };
    });
  },
}));
