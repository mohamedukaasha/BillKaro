import { useAppStore } from "@/stores/appStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  FileText,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Package,
} from "lucide-react";

const statusColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  sent: "bg-blue-100 text-blue-700",
  draft: "bg-gray-100 text-gray-600",
  overdue: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const invoices = useAppStore((s) => s.invoices);
  const expenses = useAppStore((s) => s.expenses);
  const inventory = useAppStore((s) => s.inventory);
  const businessProfile = useAppStore((s) => s.businessProfile);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthInvoices = invoices.filter((i) => i.createdAt.startsWith(currentMonth));
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));

  const totalRevenue = monthInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalRevenue - totalExpense;
  const paidInvoices = monthInvoices.filter((i) => i.status === "paid").length;
  const pendingAmount = monthInvoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.grandTotal, 0);

  const lowStockItems = inventory.filter((item) => item.stock <= item.lowStockThreshold);
  const recentInvoices = invoices.slice(0, 5);

  const stats = [
    {
      label: "Revenue",
      value: formatCurrency(totalRevenue),
      sub: `${monthInvoices.length} invoices`,
      icon: IndianRupee,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Expenses",
      value: formatCurrency(totalExpense),
      sub: `${monthExpenses.length} entries`,
      icon: FileText,
      accent: "bg-red-50 text-red-600",
    },
    {
      label: "Net Profit",
      value: formatCurrency(profit),
      sub: profit >= 0 ? "Healthy" : "Loss",
      icon: TrendingUp,
      accent: profit >= 0 ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600",
    },
    {
      label: "Pending",
      value: formatCurrency(pendingAmount),
      sub: `${paidInvoices}/${monthInvoices.length} paid`,
      icon: AlertTriangle,
      accent: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{businessProfile.name} · {formatDate(new Date())}</p>
        </div>
        <Link to="/invoices/new">
          <Button className="bg-primary hover:bg-primary/90 font-display font-semibold gap-2">
            <Plus className="size-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className={`size-9 rounded-lg flex items-center justify-center ${stat.accent}`}>
                  <stat.icon className="size-4" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold text-foreground tabular-nums">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recent Invoices */}
        <div className="xl:col-span-8">
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <h2 className="font-display text-base font-semibold text-foreground">Recent Invoices</h2>
                <Link to="/invoices" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="divide-y divide-border/50">
                {recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{inv.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground truncate">{inv.customer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className={`${statusColors[inv.status]} border-0 text-xs font-medium capitalize`}>
                        {inv.status}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground tabular-nums min-w-[90px] text-right">
                        {formatCurrency(inv.grandTotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        <div className="xl:col-span-4">
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <h2 className="font-display text-base font-semibold text-foreground">Low Stock Alerts</h2>
                <Link to="/inventory" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Manage <ArrowRight className="size-3" />
                </Link>
              </div>
              {lowStockItems.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <Package className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All items well stocked</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <Badge variant="destructive" className="text-xs tabular-nums shrink-0">
                        {item.stock} left
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
