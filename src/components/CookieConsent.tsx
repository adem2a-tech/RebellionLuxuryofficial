import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "rebellion_cookie_consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Petite attente pour ne pas surcharger l'arrivée sur le site
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    // Cookie technique pour persistance (1 an)
    document.cookie = `rebellion_consent=accepted; path=/; max-age=31536000; SameSite=Lax`;
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    document.cookie = `rebellion_consent=declined; path=/; max-age=31536000; SameSite=Lax`;
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))]"
          role="dialog"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-desc"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="rounded-xl bg-primary/20 p-2.5 shrink-0">
                  <Cookie className="w-6 h-6 text-primary" aria-hidden />
                </div>
                <div>
                  <h2 id="cookie-title" className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-1">
                    Cookies et confidentialité
                  </h2>
                  <p id="cookie-desc" className="text-sm text-muted-foreground leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience, mémoriser vos préférences et analyser le trafic. En poursuivant, vous acceptez notre utilisation des cookies.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                  className="border-white/20 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Refuser
                </Button>
                <Button
                  variant="hero"
                  size="sm"
                  onClick={handleAccept}
                  className="shadow-[0_0_24px_hsl(var(--primary)/0.3)]"
                >
                  Accepter
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
