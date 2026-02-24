import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

const TITLE_ID = "welcome-popup-title";
const RECURRENCE_MS = 90 * 1000; // 1 min 30

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
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/[0.06] bg-black/90 px-4 py-3 shadow-[0_-2px_16px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:flex-nowrap sm:gap-4 sm:px-5 sm:py-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {/* Logo : uniquement le rond (détour), pas de carré */}
              <div className="logo-round h-10 w-10 shrink-0 overflow-hidden sm:h-11 sm:w-11">
                <img
                  src="/rebellion-luxury-logo.png"
                  alt="Rebellion Luxury"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h2
                  id={TITLE_ID}
                  className="font-luxury text-[15px] font-semibold tracking-[0.06em] text-white sm:text-base"
                >
                  Venez tester notre IA
                </h2>
                <p className="font-luxury mt-0.5 text-[13px] font-medium tracking-[0.02em] text-white/80 leading-snug sm:text-sm">
                  Rebellion IA vous répond sur les véhicules, tarifs et réservations.
                </p>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center justify-end gap-1.5 sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-luxury order-2 border-white/15 bg-transparent text-xs font-medium tracking-[0.08em] text-white/90 hover:bg-white/5 hover:text-white sm:order-1"
                onClick={handleClose}
              >
                Fermer
              </Button>
              <Button
                type="button"
                size="default"
                className="font-luxury order-1 rounded-xl bg-white px-3.5 py-2 text-[13px] font-semibold tracking-[0.08em] text-black transition-all hover:bg-white/95 sm:order-2"
                onClick={handleTryIA}
              >
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                Tester l&apos;IA
              </Button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/10"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
