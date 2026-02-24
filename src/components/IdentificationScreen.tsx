import { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function IdentificationScreen() {
  const { identify } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!firstName.trim()) next.firstName = "Le prénom est requis.";
    if (!lastName.trim()) next.lastName = "Le nom est requis.";
    if (!email.trim()) next.email = "L'email est requis.";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "Email invalide.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    identify({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center bg-black px-4" role="dialog" aria-modal="true" aria-label="Créer un compte ou se connecter">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black to-white/[0.02]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.04),transparent)]" aria-hidden />

      <motion.div
        className="relative z-10 w-full max-w-[420px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]" aria-hidden />
          <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden />

          <div className="relative">
            <h1 className="font-luxury text-center text-3xl font-semibold tracking-[0.2em] text-white md:text-4xl">
              Rebellion Luxury
            </h1>
            <motion.span
              className="mx-auto mt-2 block h-px w-16 bg-white/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            />
            <p className="mt-4 text-center font-sans text-sm font-medium text-white/90">
              Créer un compte ou se connecter
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="relative mt-8 space-y-5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div className="space-y-2" variants={item}>
              <Label htmlFor="firstName" className="font-luxury text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
                Prénom
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`h-11 rounded-lg border-white/15 bg-white/5 px-4 font-medium text-white placeholder:text-white/30 focus-visible:ring-white/30 ${errors.firstName ? "border-red-400/50" : ""}`}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="text-xs text-red-400/90">{errors.firstName}</p>
              )}
            </motion.div>
            <motion.div className="space-y-2" variants={item}>
              <Label htmlFor="lastName" className="font-luxury text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
                Nom
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Votre nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`h-11 rounded-lg border-white/15 bg-white/5 px-4 font-medium text-white placeholder:text-white/30 focus-visible:ring-white/30 ${errors.lastName ? "border-red-400/50" : ""}`}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="text-xs text-red-400/90">{errors.lastName}</p>
              )}
            </motion.div>
            <motion.div className="space-y-2" variants={item}>
              <Label htmlFor="email" className="font-luxury text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-11 rounded-lg border-white/15 bg-white/5 px-4 font-medium text-white placeholder:text-white/30 focus-visible:ring-white/30 ${errors.email ? "border-red-400/50" : ""}`}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-red-400/90">{errors.email}</p>
              )}
            </motion.div>
            <motion.div className="pt-2 space-y-3" variants={item}>
              <Button
                type="submit"
                size="lg"
                className="font-sans h-12 w-full rounded-lg bg-white px-6 font-semibold text-black transition-all duration-300 hover:bg-white/95 hover:shadow-[0_0_32px_rgba(255,255,255,0.12)]"
              >
                Se connecter
              </Button>
              <p className="text-center font-sans text-xs text-white/50">
                Vos informations sont enregistrées pour votre prochaine visite.
              </p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
