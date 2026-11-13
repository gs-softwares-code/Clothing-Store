"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IconCheck, IconInfo, IconX } from "./icon";

type ToastKind = "success" | "info" | "error";

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  show: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // The live region is rendered into document.body via createPortal. Gate it on
  // mount (client snapshot = true, server snapshot = false) so the server HTML
  // matches the first client render — otherwise React throws a hydration
  // mismatch for every page.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { id, kind, message }]);
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            className="pointer-events-none fixed bottom-4 left-1/2 z-[70] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
          >
            {toasts.map((t) => (
              <div
                key={t.id}
                role="status"
                className="pointer-events-auto flex items-start gap-3 bg-ink px-4 py-3 text-sm text-white shadow-xl animate-[toastIn_220ms_ease]"
              >
                <span className="mt-0.5 shrink-0">
                  {t.kind === "success" ? (
                    <IconCheck size={16} className="text-[#9fc3a8]" />
                  ) : t.kind === "error" ? (
                    <IconInfo size={16} className="text-sale" />
                  ) : (
                    <IconInfo size={16} className="text-faint" />
                  )}
                </span>
                <p className="flex-1 leading-snug">{t.message}</p>
                <button
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 text-white/70 hover:text-white"
                >
                  <IconX size={15} />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
      <style jsx global>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
