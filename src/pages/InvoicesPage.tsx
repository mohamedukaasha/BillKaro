import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Share2,
  Download,
  CheckCircle2,
} from "lucide-react";
import emptyImg from "@/assets/empty-invoice.jpg";

const statusColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  sent: "bg-blue-100 text-blue-700",
  draft: "bg-gray-100 text-gray-600",
  overdue: "bg-red-100 text-red-700",
};

export default function InvoicesPage() {
  const invoices = useAppStore((s) => s.invoices);
  const updateInvoice = useAppStore((s) => s.updateInvoice);
  const deleteInvoice = useAppStore((s) => s.deleteInvoice);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchType = typeFilter === "all" || inv.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleMarkPaid = (id: string) => {
    updateInvoice(id, { status: "paid", paidAt: new Date().toISOString().slice(0, 10) });
    toast({ title: "Invoice marked as paid" });
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    toast({ title: "Invoice deleted" });
  };

  const handleWhatsApp = (inv: typeof invoices[0]) => {
    const msg = encodeURIComponent(
      `Invoice ${inv.invoiceNumber}\nAmount: ${formatCurrency(inv.grandTotal)}\nDue: ${formatDate(inv.dueDate)}\n\nFrom: BillKaro`
    );
    window.open(`https://wa.me/${inv.customer.phone}?text=${msg}`, "_blank");
    toast({ title: "Opening WhatsApp..." });
  };

  const handleDownloadPDF = (inv: typeof invoices[0]) => {
    toast({ title: "Generating PDF...", description: `${inv.invoiceNumber} will download shortly.` });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground">{invoices.length} total invoices</p>
        </div>
        <Link to="/invoices/new">
          <Button className="bg-primary hover:bg-primary/90 font-display font-semibold gap-2">
            <Plus className="size-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="gst">GST</SelectItem>
            <SelectItem value="non-gst">Non-GST</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice List */}
      {filtered.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <img src={emptyImg} alt="No invoices" className="size-24 mx-auto mb-4 rounded-xl opacity-80 object-cover" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">No invoices found</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first invoice to get started</p>
            <Button onClick={() => navigate("/invoices/new")} className="bg-primary font-semibold gap-2">
              <Plus className="size-4" /> Create Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoice</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-semibold text-foreground">{inv.invoiceNumber}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{inv.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{inv.customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className="text-xs uppercase">{inv.type}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground tabular-nums">{formatDate(inv.createdAt)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-semibold text-foreground tabular-nums">{formatCurrency(inv.grandTotal)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <Badge className={`${statusColors[inv.status]} border-0 text-xs font-medium capitalize`}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status !== "paid" && (
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => handleMarkPaid(inv.id)} title="Mark as Paid">
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => handleWhatsApp(inv)} title="Share on WhatsApp">
                          <Share2 className="size-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDownloadPDF(inv)} title="Download PDF">
                          <Download className="size-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8" title="Delete">
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove {inv.invoiceNumber}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(inv.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
