import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-bottom-5 fade-in-0 duration-200",
            t.variant === "destructive" && "border-destructive/50 bg-destructive text-destructive-foreground"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-semibold">{t.title}</p>}
              {t.description && <p className="text-sm opacity-80 mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
