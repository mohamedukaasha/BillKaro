import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Building2, Users, CreditCard } from "lucide-react";
import { INDIAN_STATES } from "@/constants/config";

export default function SettingsPage() {
  const businessProfile = useAppStore((s) => s.businessProfile);
  const setBusinessProfile = useAppStore((s) => s.setBusinessProfile);
  const { toast } = useToast();

  const [form, setForm] = useState({ ...businessProfile });

  const handleSave = () => {
    if (!form.name || !form.gstin || !form.phone) {
      toast({ variant: "destructive", title: "Fill required fields" });
      return;
    }
    setBusinessProfile(form);
    toast({ title: "Business profile updated" });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your business profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Business Profile */}
        <div className="xl:col-span-8">
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="size-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">Business Profile</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Business Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>GSTIN *</Label>
                  <Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className="h-11 font-mono" maxLength={15} />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 tabular-nums" maxLength={10} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-11" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 font-semibold gap-2">
                  <Save className="size-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="xl:col-span-4 space-y-6">
          {/* Plan Info (mocked) */}
          <Card className="border border-border/50 shadow-sm bg-[hsl(220,60%,14%)] text-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="size-5 text-[hsl(38,92%,50%)]" />
                <h3 className="font-display text-sm font-semibold">Subscription Plan</h3>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-xl font-bold">Pro Plan</span>
                  <Badge className="bg-[hsl(38,92%,50%)] text-[hsl(220,60%,10%)] border-0 text-xs">Active</Badge>
                </div>
                <p className="text-sm text-[hsl(220,14%,65%)]">₹499/month · Renews Aug 1, 2025</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[hsl(220,14%,72%)]">
                  <span>Invoices this month</span>
                  <span className="tabular-nums font-semibold text-white">8 / Unlimited</span>
                </div>
                <div className="flex justify-between text-[hsl(220,14%,72%)]">
                  <span>Team members</span>
                  <span className="tabular-nums font-semibold text-white">2 / 5</span>
                </div>
              </div>
              <Button variant="outline" className="w-full border-[hsl(220,50%,30%)] text-white hover:bg-[hsl(220,50%,20%)] font-semibold">
                Manage Subscription
              </Button>
            </CardContent>
          </Card>

          {/* Team Members (mocked) */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Users className="size-5 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Team Members</h3>
              </div>
              {[
                { name: "You (Owner)", email: "demo@billkaro.com", role: "Admin" },
                { name: "Suresh Kumar", email: "suresh@billkaro.com", role: "Staff" },
              ].map((member) => (
                <div key={member.email} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{member.role}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full font-semibold gap-2" size="sm">
                <Users className="size-3.5" /> Invite Member
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
