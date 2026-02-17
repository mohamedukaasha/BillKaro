import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-billing.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@billkaro.com");
  const [password, setPassword] = useState("demo1234");
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/", { replace: true });
    } else {
      toast({ variant: "destructive", title: "Login Failed", description: "Please check your credentials." });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel — Visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-[hsl(220,60%,14%)]">
        <img
          src={heroImg}
          alt="BillKaro billing dashboard"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-lg bg-[hsl(38,92%,50%)] flex items-center justify-center">
              <Receipt className="size-6 text-[hsl(220,60%,10%)]" />
            </div>
            <span className="font-display text-2xl font-bold text-white tracking-tight">BillKaro</span>
          </div>
          <div className="max-w-lg">
            <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-4" style={{ textWrap: "balance" }}>
              GST Billing Made<br />
              <span className="text-[hsl(38,92%,50%)]">Effortless</span>
            </h1>
            <p className="text-[hsl(220,14%,72%)] text-lg leading-relaxed" style={{ textWrap: "pretty" }}>
              Create invoices, track expenses, manage inventory — everything your retail business needs in one place.
            </p>
          </div>
          <div className="flex gap-8">
            {[
              { label: "Invoices/mo", value: "500+" },
              { label: "GST Compliant", value: "100%" },
              { label: "Time Saved", value: "80%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-white tabular-nums">{stat.value}</div>
                <div className="text-sm text-[hsl(220,14%,56%)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="size-10 rounded-lg bg-[hsl(38,92%,50%)] flex items-center justify-center">
              <Receipt className="size-5 text-[hsl(220,60%,10%)]" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">BillKaro</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to manage your billing</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 font-display font-semibold text-base gap-2">
              Sign In
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Demo credentials pre-filled. Just click Sign In.
          </p>
        </div>
      </div>
    </div>
  );
}
