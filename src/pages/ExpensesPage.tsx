import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Wallet, TrendingDown } from "lucide-react";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/constants/config";
import type { Expense } from "@/types";

const categoryColors: Record<string, string> = {
  Rent: "bg-violet-100 text-violet-700",
  Salary: "bg-blue-100 text-blue-700",
  Electricity: "bg-amber-100 text-amber-700",
  Transport: "bg-green-100 text-green-700",
  Marketing: "bg-pink-100 text-pink-700",
  Packaging: "bg-cyan-100 text-cyan-700",
  "Raw Material": "bg-orange-100 text-orange-700",
  Maintenance: "bg-red-100 text-red-700",
  Insurance: "bg-indigo-100 text-indigo-700",
};

export default function ExpensesPage() {
  const expenses = useAppStore((s) => s.expenses);
  const addExpense = useAppStore((s) => s.addExpense);
  const deleteExpense = useAppStore((s) => s.deleteExpense);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    vendor: "",
    paymentMethod: "UPI",
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const totalThisMonth = monthExpenses.reduce((s, e) => s + e.amount, 0);

  const categorySummary = monthExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySummary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const filtered = expenses.filter((e) => {
    const matchSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.vendor.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || e.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleSubmit = () => {
    if (!form.category || !form.description || !form.amount || !form.vendor) {
      toast({ variant: "destructive", title: "Fill all required fields" });
      return;
    }
    const expense: Expense = {
      id: `e_${Date.now()}`,
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      date: form.date,
      vendor: form.vendor,
      paymentMethod: form.paymentMethod,
    };
    addExpense(expense);
    setOpen(false);
    setForm({ category: "", description: "", amount: "", date: new Date().toISOString().slice(0, 10), vendor: "", paymentMethod: "UPI" });
    toast({ title: "Expense added" });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground">{expenses.length} total entries</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 font-display font-semibold gap-2">
              <Plus className="size-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Add Expense</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (₹) *</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="h-10 tabular-nums" min={0} placeholder="0" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was this expense for?" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Vendor *</Label>
                <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="h-10" placeholder="Vendor name" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-10" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Payment Method</Label>
                <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} className="bg-primary font-semibold">Save Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats + Category Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 grid grid-cols-1 gap-4">
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <TrendingDown className="size-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">This Month</span>
              </div>
              <div className="font-display text-2xl font-bold text-foreground tabular-nums">{formatCurrency(totalThisMonth)}</div>
              <p className="text-xs text-muted-foreground mt-1">{monthExpenses.length} expenses</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Top Categories</h3>
              {topCategories.map(([cat, amount]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`${categoryColors[cat] || "bg-gray-100 text-gray-700"} border-0 text-xs`}>{cat}</Badge>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatCurrency(amount)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] h-10"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card className="border border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((exp) => (
                    <tr key={exp.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="text-sm font-medium text-foreground">{exp.description}</p>
                        <p className="text-xs text-muted-foreground">{exp.vendor} · {exp.paymentMethod}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge className={`${categoryColors[exp.category] || "bg-gray-100 text-gray-700"} border-0 text-xs`}>{exp.category}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground tabular-nums">{formatDate(exp.date)}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold text-foreground tabular-nums">{formatCurrency(exp.amount)}</td>
                      <td className="px-6 py-3.5 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8"><Trash2 className="size-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove this expense entry.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { deleteExpense(exp.id); toast({ title: "Expense deleted" }); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
