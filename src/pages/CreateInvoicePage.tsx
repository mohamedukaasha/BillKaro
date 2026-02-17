import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { formatCurrency, generateInvoiceNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, Save, Search } from "lucide-react";
import type { InvoiceLineItem, Customer, Invoice } from "@/types";
import { GST_RATES, UNITS } from "@/constants/config";

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addInvoice = useAppStore((s) => s.addInvoice);
  const customers = useAppStore((s) => s.customers);
  const inventory = useAppStore((s) => s.inventory);
  const updateStock = useAppStore((s) => s.updateStock);

  const [isGST, setIsGST] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)
  );
  const [items, setItems] = useState<InvoiceLineItem[]>([]);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [itemSearch, setItemSearch] = useState("");

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.sku.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const addItemFromInventory = (invItem: typeof inventory[0]) => {
    const existing = items.find((i) => i.itemId === invItem.id);
    if (existing) {
      setItems(items.map((i) =>
        i.itemId === invItem.id
          ? {
              ...i,
              quantity: i.quantity + 1,
              amount: (i.quantity + 1) * i.rate,
              cgst: isGST ? ((i.quantity + 1) * i.rate * i.gstRate) / 200 : 0,
              sgst: isGST ? ((i.quantity + 1) * i.rate * i.gstRate) / 200 : 0,
            }
          : i
      ));
    } else {
      const newItem: InvoiceLineItem = {
        id: `li_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        itemId: invItem.id,
        name: invItem.name,
        hsnCode: invItem.hsnCode,
        quantity: 1,
        unit: invItem.unit,
        rate: invItem.sellingPrice,
        gstRate: isGST ? invItem.gstRate : 0,
        amount: invItem.sellingPrice,
        cgst: isGST ? (invItem.sellingPrice * invItem.gstRate) / 200 : 0,
        sgst: isGST ? (invItem.sellingPrice * invItem.gstRate) / 200 : 0,
        igst: 0,
      };
      setItems([...items, newItem]);
    }
    setShowItemPicker(false);
    setItemSearch("");
  };

  const addCustomItem = () => {
    const newItem: InvoiceLineItem = {
      id: `li_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: "",
      hsnCode: "",
      quantity: 1,
      unit: "Pcs",
      rate: 0,
      gstRate: 0,
      amount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      updated.amount = updated.quantity * updated.rate;
      updated.cgst = isGST ? (updated.amount * updated.gstRate) / 200 : 0;
      updated.sgst = isGST ? (updated.amount * updated.gstRate) / 200 : 0;
      return updated;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const totalCgst = items.reduce((s, i) => s + i.cgst, 0);
    const totalSgst = items.reduce((s, i) => s + i.sgst, 0);
    const totalTax = totalCgst + totalSgst;
    const grandTotal = subtotal + totalTax - discount;
    return { subtotal, totalCgst, totalSgst, totalIgst: 0, totalTax, grandTotal };
  }, [items, discount]);

  const handleSave = (status: "draft" | "sent") => {
    if (!selectedCustomer) {
      toast({ variant: "destructive", title: "Select a customer" });
      return;
    }
    if (items.length === 0) {
      toast({ variant: "destructive", title: "Add at least one item" });
      return;
    }
    if (items.some((i) => !i.name || i.rate <= 0)) {
      toast({ variant: "destructive", title: "Fill all item details" });
      return;
    }

    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      type: isGST ? "gst" : "non-gst",
      status,
      customer: selectedCustomer,
      items,
      subtotal: totals.subtotal,
      totalCgst: totals.totalCgst,
      totalSgst: totals.totalSgst,
      totalIgst: 0,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
      discount,
      notes,
      createdAt: new Date().toISOString().slice(0, 10),
      dueDate,
    };

    items.forEach((item) => {
      if (item.itemId) updateStock(item.itemId, item.quantity);
    });

    addInvoice(invoice);
    toast({ title: `Invoice ${invoice.invoiceNumber} created` });
    navigate("/invoices");
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-foreground">Create Invoice</h1>
          <p className="text-sm text-muted-foreground">Fill in the details to generate a new invoice</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="gst-toggle" className="text-sm font-medium">GST Invoice</Label>
            <Switch id="gst-toggle" checked={isGST} onCheckedChange={setIsGST} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left — Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer Selection */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-display text-sm font-semibold text-foreground">Customer Details</h3>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select customer..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 pb-2">
                    <Input
                      placeholder="Search customer..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  {filteredCustomers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCustomer && (
                <div className="grid grid-cols-2 gap-3 text-sm bg-muted/30 rounded-lg p-3">
                  <div><span className="text-muted-foreground">Phone:</span> {selectedCustomer.phone}</div>
                  <div><span className="text-muted-foreground">State:</span> {selectedCustomer.state}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {selectedCustomer.address}</div>
                  {selectedCustomer.gstin && <div className="col-span-2"><span className="text-muted-foreground">GSTIN:</span> {selectedCustomer.gstin}</div>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-foreground">Line Items</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowItemPicker(true)} className="gap-1.5 text-xs">
                    <Search className="size-3" /> From Inventory
                  </Button>
                  <Button variant="outline" size="sm" onClick={addCustomItem} className="gap-1.5 text-xs">
                    <Plus className="size-3" /> Custom Item
                  </Button>
                </div>
              </div>

              {/* Item Picker Modal */}
              {showItemPicker && (
                <div className="border border-border rounded-lg p-4 bg-muted/20 space-y-3">
                  <Input
                    placeholder="Search inventory by name or SKU..."
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    className="h-9"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto divide-y divide-border/50">
                    {filteredInventory.slice(0, 10).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addItemFromInventory(item)}
                        className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-muted/50 rounded transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.sku} · {item.stock} in stock</p>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">{formatCurrency(item.sellingPrice)}</span>
                      </button>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowItemPicker(false)}>Close</Button>
                </div>
              )}

              {/* Items Table */}
              {items.length > 0 && (
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-1 text-xs font-semibold text-muted-foreground w-[30%]">Item</th>
                        <th className="text-left py-2 px-1 text-xs font-semibold text-muted-foreground">HSN</th>
                        <th className="text-center py-2 px-1 text-xs font-semibold text-muted-foreground">Qty</th>
                        <th className="text-left py-2 px-1 text-xs font-semibold text-muted-foreground">Unit</th>
                        <th className="text-right py-2 px-1 text-xs font-semibold text-muted-foreground">Rate</th>
                        {isGST && <th className="text-center py-2 px-1 text-xs font-semibold text-muted-foreground">GST%</th>}
                        <th className="text-right py-2 px-1 text-xs font-semibold text-muted-foreground">Amount</th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 px-1">
                            <Input
                              value={item.name}
                              onChange={(e) => updateItem(item.id, "name", e.target.value)}
                              className="h-8 text-sm"
                              placeholder="Item name"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              value={item.hsnCode}
                              onChange={(e) => updateItem(item.id, "hsnCode", e.target.value)}
                              className="h-8 text-sm w-20"
                              placeholder="HSN"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                              className="h-8 text-sm w-16 text-center tabular-nums"
                              min={1}
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Select value={item.unit} onValueChange={(v) => updateItem(item.id, "unit", v)}>
                              <SelectTrigger className="h-8 text-sm w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                              className="h-8 text-sm w-24 text-right tabular-nums"
                              min={0}
                            />
                          </td>
                          {isGST && (
                            <td className="py-2 px-1">
                              <Select value={String(item.gstRate)} onValueChange={(v) => updateItem(item.id, "gstRate", Number(v))}>
                                <SelectTrigger className="h-8 text-sm w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GST_RATES.map((r) => <SelectItem key={r} value={String(r)}>{r}%</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </td>
                          )}
                          <td className="py-2 px-1 text-right font-semibold tabular-nums">{formatCurrency(item.amount)}</td>
                          <td className="py-2 px-1">
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => removeItem(item.id)}>
                              <Trash2 className="size-3.5 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {items.length === 0 && (
                <div className="border-2 border-dashed rounded-lg py-12 text-center">
                  <p className="text-sm text-muted-foreground mb-2">No items added yet</p>
                  <p className="text-xs text-muted-foreground">Pick from inventory or add custom items</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-5 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Discount (₹)</Label>
                <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="h-10 tabular-nums" min={0} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            <Card className="border border-border/50 shadow-sm bg-[hsl(220,60%,14%)] text-white">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-display text-sm font-semibold text-[hsl(220,14%,72%)]">Invoice Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[hsl(220,14%,65%)]">Subtotal</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  {isGST && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-[hsl(220,14%,65%)]">CGST</span>
                        <span className="tabular-nums">{formatCurrency(totals.totalCgst)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[hsl(220,14%,65%)]">SGST</span>
                        <span className="tabular-nums">{formatCurrency(totals.totalSgst)}</span>
                      </div>
                    </>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-[hsl(38,92%,50%)]">
                      <span>Discount</span>
                      <span className="tabular-nums">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-[hsl(220,50%,25%)] pt-3 flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="font-display text-xl font-bold text-[hsl(38,92%,50%)] tabular-nums">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button onClick={() => handleSave("sent")} className="h-12 bg-[hsl(38,92%,50%)] hover:bg-[hsl(38,92%,45%)] text-[hsl(220,60%,10%)] font-display font-bold text-base gap-2">
                <Save className="size-4" /> Save & Send
              </Button>
              <Button variant="outline" onClick={() => handleSave("draft")} className="h-11 font-semibold">
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
