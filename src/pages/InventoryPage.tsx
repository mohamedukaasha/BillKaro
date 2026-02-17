import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Search, Trash2, Package, Edit2 } from "lucide-react";
import { ITEM_CATEGORIES, GST_RATES, UNITS } from "@/constants/config";
import type { InventoryItem } from "@/types";

export default function InventoryPage() {
  const inventory = useAppStore((s) => s.inventory);
  const addInventoryItem = useAppStore((s) => s.addInventoryItem);
  const updateInventoryItem = useAppStore((s) => s.updateInventoryItem);
  const deleteInventoryItem = useAppStore((s) => s.deleteInventoryItem);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", sku: "", category: "General", hsnCode: "", unit: "Pcs",
    purchasePrice: "", sellingPrice: "", gstRate: "18", stock: "", lowStockThreshold: "5",
  });

  const resetForm = () => {
    setForm({ name: "", sku: "", category: "General", hsnCode: "", unit: "Pcs", purchasePrice: "", sellingPrice: "", gstRate: "18", stock: "", lowStockThreshold: "5" });
    setEditingId(null);
  };

  const openEdit = (item: InventoryItem) => {
    setForm({
      name: item.name, sku: item.sku, category: item.category, hsnCode: item.hsnCode, unit: item.unit,
      purchasePrice: String(item.purchasePrice), sellingPrice: String(item.sellingPrice),
      gstRate: String(item.gstRate), stock: String(item.stock), lowStockThreshold: String(item.lowStockThreshold),
    });
    setEditingId(item.id);
    setOpen(true);
  };

  const filtered = inventory.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalValue = inventory.reduce((s, i) => s + i.sellingPrice * i.stock, 0);
  const lowStockCount = inventory.filter((i) => i.stock <= i.lowStockThreshold).length;

  const handleSubmit = () => {
    if (!form.name || !form.sku || !form.purchasePrice || !form.sellingPrice || !form.stock) {
      toast({ variant: "destructive", title: "Fill all required fields" });
      return;
    }

    const itemData = {
      name: form.name, sku: form.sku, category: form.category, hsnCode: form.hsnCode, unit: form.unit,
      purchasePrice: Number(form.purchasePrice), sellingPrice: Number(form.sellingPrice),
      gstRate: Number(form.gstRate), stock: Number(form.stock), lowStockThreshold: Number(form.lowStockThreshold),
    };

    if (editingId) {
      updateInventoryItem(editingId, itemData);
      toast({ title: "Item updated" });
    } else {
      const item: InventoryItem = {
        id: `i_${Date.now()}`,
        ...itemData,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      addInventoryItem(item);
      toast({ title: "Item added to inventory" });
    }
    setOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground">{inventory.length} items · {lowStockCount} low stock</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 font-display font-semibold gap-2">
              <Plus className="size-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">{editingId ? "Edit Item" : "Add Item"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 space-y-2">
                <Label>Item Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10" placeholder="e.g. Samsung Galaxy A15" />
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="h-10" placeholder="EL-SAM-A15" />
              </div>
              <div className="space-y-2">
                <Label>HSN Code</Label>
                <Input value={form.hsnCode} onChange={(e) => setForm({ ...form, hsnCode: e.target.value })} className="h-10" placeholder="8517" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>{ITEM_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>{UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Purchase Price *</Label>
                <Input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} className="h-10 tabular-nums" min={0} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Selling Price *</Label>
                <Input type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} className="h-10 tabular-nums" min={0} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>GST Rate</Label>
                <Select value={form.gstRate} onValueChange={(v) => setForm({ ...form, gstRate: v })}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>{GST_RATES.map((r) => <SelectItem key={r} value={String(r)}>{r}%</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stock *</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="h-10 tabular-nums" min={0} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Low Stock Alert</Label>
                <Input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} className="h-10 tabular-nums" min={0} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Margin</Label>
                <div className="h-10 flex items-center px-3 bg-muted/50 rounded-md text-sm font-semibold tabular-nums">
                  {form.purchasePrice && form.sellingPrice
                    ? `${(((Number(form.sellingPrice) - Number(form.purchasePrice)) / Number(form.purchasePrice)) * 100).toFixed(1)}%`
                    : "—"}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} className="bg-primary font-semibold">{editingId ? "Update" : "Add Item"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-1">Total Items</p>
            <p className="font-display text-2xl font-bold tabular-nums">{inventory.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-1">Stock Value</p>
            <p className="font-display text-2xl font-bold tabular-nums">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-1">Low Stock Items</p>
            <p className="font-display text-2xl font-bold tabular-nums text-destructive">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] h-10"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {ITEM_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Item</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Buy</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sell</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">GST</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((item) => {
                const isLow = item.stock <= item.lowStockThreshold;
                return (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">HSN: {item.hsnCode}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground font-mono">{item.sku}</td>
                    <td className="px-4 py-3.5"><Badge variant="outline" className="text-xs">{item.category}</Badge></td>
                    <td className="px-4 py-3.5 text-right text-sm tabular-nums text-muted-foreground">{formatCurrency(item.purchasePrice)}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums">{formatCurrency(item.sellingPrice)}</td>
                    <td className="px-4 py-3.5 text-center text-sm tabular-nums">{item.gstRate}%</td>
                    <td className="px-4 py-3.5 text-center">
                      <Badge variant={isLow ? "destructive" : "secondary"} className="text-xs tabular-nums">
                        {item.stock} {item.unit}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(item)}>
                          <Edit2 className="size-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8"><Trash2 className="size-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Item?</AlertDialogTitle>
                              <AlertDialogDescription>This will remove {item.name} from inventory.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { deleteInventoryItem(item.id); toast({ title: "Item deleted" }); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
