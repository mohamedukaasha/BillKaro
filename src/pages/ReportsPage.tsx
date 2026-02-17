import { useMemo } from "react";
import { useAppStore } from "@/stores/appStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, IndianRupee, FileText, Wallet, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const CHART_COLORS = ["#1a365d", "#d97706", "#059669", "#dc2626", "#7c3aed", "#0891b2", "#db2777", "#ca8a04"];

export default function ReportsPage() {
  const invoices = useAppStore((s) => s.invoices);
  const expenses = useAppStore((s) => s.expenses);

  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number; expense: number; invoiceCount: number; paidCount: number }> = {};

    invoices.forEach((inv) => {
      const m = inv.createdAt.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0, invoiceCount: 0, paidCount: 0 };
      months[m].income += inv.grandTotal;
      months[m].invoiceCount++;
      if (inv.status === "paid") months[m].paidCount++;
    });

    expenses.forEach((exp) => {
      const m = exp.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0, invoiceCount: 0, paidCount: 0 };
      months[m].expense += exp.amount;
    });

    return Object.entries(months)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        rawMonth: month,
        income: Math.round(data.income),
        expense: Math.round(data.expense),
        profit: Math.round(data.income - data.expense),
        invoiceCount: data.invoiceCount,
        paidCount: data.paidCount,
      }));
  }, [invoices, expenses]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentData = monthlyData.find((d) => d.rawMonth === currentMonth);

  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses
      .filter((e) => e.date.startsWith(currentMonth))
      .forEach((e) => { cats[e.category] = (cats[e.category] || 0) + e.amount; });
    return Object.entries(cats)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }));
  }, [expenses, currentMonth]);

  const gstSummary = useMemo(() => {
    const monthInvoices = invoices.filter((i) => i.createdAt.startsWith(currentMonth) && i.type === "gst");
    return {
      totalCgst: monthInvoices.reduce((s, i) => s + i.totalCgst, 0),
      totalSgst: monthInvoices.reduce((s, i) => s + i.totalSgst, 0),
      totalTax: monthInvoices.reduce((s, i) => s + i.totalTax, 0),
      invoiceCount: monthInvoices.length,
    };
  }, [invoices, currentMonth]);

  const totalIncome = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Profit & Loss overview</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalIncome), icon: IndianRupee, accent: "bg-emerald-50 text-emerald-600" },
          { label: "Total Expenses", value: formatCurrency(totalExpense), icon: Wallet, accent: "bg-red-50 text-red-600" },
          { label: "Net Profit", value: formatCurrency(totalIncome - totalExpense), icon: totalIncome - totalExpense >= 0 ? TrendingUp : TrendingDown, accent: totalIncome - totalExpense >= 0 ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600" },
          { label: "GST Collected", value: formatCurrency(gstSummary.totalTax), icon: BarChart3, accent: "bg-violet-50 text-violet-600", sub: `${gstSummary.invoiceCount} GST invoices this month` },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className={`size-9 rounded-lg flex items-center justify-center ${stat.accent}`}>
                  <stat.icon className="size-4" />
                </div>
              </div>
              <div className="font-display text-2xl font-bold text-foreground tabular-nums">{stat.value}</div>
              {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Monthly P&L Bar Chart */}
        <div className="xl:col-span-8">
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">Monthly Income vs Expenses</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,92%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220,10%,60%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,60%)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: 8, border: "1px solid hsl(220,14%,89%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="income" fill="hsl(220,60%,22%)" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="hsl(38,92%,50%)" radius={[4, 4, 0, 0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Pie */}
        <div className="xl:col-span-4">
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">Expense Breakdown</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="45%"
                      outerRadius={90}
                      innerRadius={50}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Details Table */}
      <Card className="border border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-border/50">
            <h3 className="font-display text-base font-semibold text-foreground">Monthly Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Month</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Income</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Expenses</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Profit</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoices</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {monthlyData.map((row) => (
                  <tr key={row.rawMonth} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium">{row.month}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-emerald-700">{formatCurrency(row.income)}</td>
                    <td className="px-4 py-3.5 text-right text-sm tabular-nums text-red-600">{formatCurrency(row.expense)}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-bold tabular-nums">{formatCurrency(row.profit)}</td>
                    <td className="px-4 py-3.5 text-center text-sm tabular-nums">{row.invoiceCount}</td>
                    <td className="px-6 py-3.5 text-center">
                      <Badge variant={row.profit >= 0 ? "secondary" : "destructive"} className="text-xs">
                        {row.profit >= 0 ? "Profit" : "Loss"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* GST Summary */}
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">GST Summary (This Month)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">CGST Collected</p>
              <p className="font-display text-xl font-bold tabular-nums">{formatCurrency(gstSummary.totalCgst)}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">SGST Collected</p>
              <p className="font-display text-xl font-bold tabular-nums">{formatCurrency(gstSummary.totalSgst)}</p>
            </div>
            <div className="bg-[hsl(220,60%,14%)] rounded-lg p-4 text-white">
              <p className="text-sm text-[hsl(220,14%,72%)] mb-1">Total GST</p>
              <p className="font-display text-xl font-bold tabular-nums text-[hsl(38,92%,50%)]">{formatCurrency(gstSummary.totalTax)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
