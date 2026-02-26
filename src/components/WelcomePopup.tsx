import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

const TITLE_ID = "welcome-popup-title";
const RECURRENCE_MS = 8 * 60 * 1000; // 8 minutes

type WelcomePopupProps = {
  defaultOpen: boolean;
  isIAOpen?: boolean;
  onTryIA?: () => void;
};

export default function WelcomePopup({ defaultOpen, isIAOpen = false, onTryIA }: WelcomePopupProps) {
  const [open, setOpen] = useState(false);
  const recurrenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIAOpenRef = useRef(isIAOpen);
  isIAOpenRef.current = isIAOpen;

  const maybeShow = () => {
    if (!isIAOpenRef.current) setOpen(true);
  };

  // Afficher au montage après un court délai uniquement si l'IA n'est pas ouverte
  useEffect(() => {
    if (!defaultOpen) return;
    const t = setTimeout(maybeShow, 300);
    return () => clearTimeout(t);
  }, [defaultOpen]);

  const scheduleRecurrence = () => {
    if (recurrenceRef.current) {
      clearTimeout(recurrenceRef.current);
      recurrenceRef.current = null;
    }
    recurrenceRef.current = setTimeout(() => {
      recurrenceRef.current = null;
      if (isIAOpenRef.current) {
        scheduleRecurrence();
      } else {
        setOpen(true);
      }
    }, RECURRENCE_MS);
  };

  const handleClose = () => {
    if (recurrenceRef.current) {
      clearTimeout(recurrenceRef.current);
      recurrenceRef.current = null;
    }
    setOpen(false);
    scheduleRecurrence();
  };

  const handleTryIA = () => {
    if (recurrenceRef.current) {
      clearTimeout(recurrenceRef.current);
      recurrenceRef.current = null;
    }
    setOpen(false);
    onTryIA?.();
    scheduleRecurrence();
  };

  // Ne pas afficher le popup quand l'utilisateur est déjà avec l'IA (évite de gêner)
  useEffect(() => {
    if (isIAOpen && open) setOpen(false);
  }, [isIAOpen]);

  useEffect(() => {
    return () => {
      if (recurrenceRef.current) clearTimeout(recurrenceRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-[100] px-3 pb-3 sm:px-4 sm:pb-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
        >
          <div className="mx-auto flex max-w-xl flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/[0.06] bg-black/80 px-3 py-2.5 shadow-[0_-1px_12px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:flex-nowrap sm:gap-3 sm:px-4 sm:py-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="logo-round h-8 w-8 shrink-0 overflow-hidden sm:h-9 sm:w-9">
                <img
                  src="/rebellion-luxury-logo.png"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h2
                  id={TITLE_ID}
                  className="font-luxury text-[12px] font-medium tracking-[0.12em] text-white/90 uppercase sm:text-[13px]"
                >
                  Assistant IA
                </h2>
                <p className="mt-0.5 text-[11px] text-white/50 tracking-wide sm:text-xs">
                  Véhicules, tarifs, réservations
                </p>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center justify-end gap-1 sm:w-auto">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="order-2 h-8 rounded-md border-0 bg-transparent text-[11px] font-medium tracking-wide text-white/50 hover:bg-white/5 hover:text-white/70 sm:order-1"
                onClick={handleClose}
              >
                Fermer
              </Button>
              <Button
                type="button"
                size="sm"
                className="order-1 h-8 rounded-md border border-white/20 bg-white/5 px-3 text-[11px] font-medium tracking-[0.1em] text-white/90 transition-colors hover:bg-white/10 hover:text-white sm:order-2"
                onClick={handleTryIA}
              >
                <MessageCircle className="mr-1.5 h-3 w-3" />
                Tester
              </Button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md p-1 text-white/40 hover:text-white/70 transition-colors"
                aria-label="Fermer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
