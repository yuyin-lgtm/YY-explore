import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { motionTokens, reducedFade, reducedFadeOut } from "../lib/motion";
import { Progress } from "./progress";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "error" | "brand";

export type ToastInput = {
  id?: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. 0 stays until closed. */
  duration?: number;
  /** 0–100. Renders a progress bar when set. */
  progress?: number;
};

type ToastRecord = Required<Pick<ToastInput, "id" | "title">> & ToastInput;

type ToastContextValue = {
  toasts: ToastRecord[];
  push: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
  update: (id: string, patch: Partial<ToastInput>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneIcon: Record<ToastTone, string> = {
  neutral: "bg-muted-surface text-secondary",
  info: "bg-info-subtle text-info",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  error: "bg-error-subtle text-error",
  brand: "bg-accent-subtle text-accent-text",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = toast.id ?? crypto.randomUUID();
      setToasts((list) => [...list.filter((item) => item.id !== id), { tone: "neutral", duration: 5000, ...toast, id }]);
      const duration = toast.duration ?? 5000;
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const update = useCallback((id: string, patch: Partial<ToastInput>) => {
    setToasts((list) => list.map((toast) => (toast.id === id ? { ...toast, ...patch, id } : toast)));
  }, []);

  const value = useMemo(() => ({ toasts, push, dismiss, update }), [toasts, push, dismiss, update]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

export function ToastViewport({ toasts, onDismiss }: { toasts: ToastRecord[]; onDismiss: (id: string) => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[70] flex w-[min(var(--size-toast),calc(100vw-32px))] flex-col gap-2" aria-label="Notifications">
      <AnimatePresence initial={false}>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            role={toast.tone === "error" || toast.tone === "warning" ? "alert" : "status"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: reduce ? reducedFadeOut.duration : 0.05 } }}
            transition={reduce ? reducedFade : { ...motionTokens.spring.smooth, delay: reduce ? 0 : index * motionTokens.stagger.item }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 80) onDismiss(toast.id);
            }}
            className="pointer-events-auto overflow-hidden rounded-panel border border-border bg-raised shadow-floating"
          >
            <div className="flex items-start gap-3 p-3">
              <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-pill font-caption-strong", toneIcon[toast.tone ?? "neutral"])} aria-hidden>
                {(toast.tone ?? "neutral").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-body-strong text-foreground">{toast.title}</p>
                {toast.description ? <p className="mt-0.5 font-caption">{toast.description}</p> : null}
              </div>
              <button
                type="button"
                aria-label={`Dismiss ${toast.title}`}
                onClick={() => onDismiss(toast.id)}
                className="grid size-6 shrink-0 place-items-center rounded-pill text-secondary hover:bg-hover hover:text-foreground"
              >
                <X size={14} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            {typeof toast.progress === "number" ? (
              <div className="px-3 pb-3">
                <Progress label="Progress" value={toast.progress} showValue />
              </div>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Presentational toast for stories that don't need the provider. */
export function Toast({
  title,
  description,
  tone = "neutral",
  progress,
  onDismiss,
}: {
  title: string;
  description?: string;
  tone?: ToastTone;
  progress?: number;
  onDismiss?: () => void;
}) {
  return (
    <div role={tone === "error" || tone === "warning" ? "alert" : "status"} className="w-[min(var(--size-toast),calc(100vw-32px))] overflow-hidden rounded-panel border border-border bg-raised shadow-floating">
      <div className="flex items-start gap-3 p-3">
        <span className={cn("grid size-6 shrink-0 place-items-center rounded-pill font-caption-strong", toneIcon[tone])} aria-hidden>
          {tone.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-body-strong">{title}</p>
          {description ? <p className="mt-0.5 font-caption">{description}</p> : null}
        </div>
        <button type="button" aria-label={`Dismiss ${title}`} onClick={onDismiss} className="grid size-6 place-items-center rounded-pill text-secondary hover:bg-hover">
          <X size={14} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      {typeof progress === "number" ? (
        <div className="px-3 pb-3">
          <Progress label="Progress" value={progress} showValue />
        </div>
      ) : null}
    </div>
  );
}
