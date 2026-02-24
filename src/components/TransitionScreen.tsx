import { useEffect } from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";

const TRANSITION_DURATION_MS = 1100;
const TRANSITION_DURATION_RETURN_MS = 1200;

type TransitionScreenProps = {
  onComplete: () => void;
  /** true quand l'utilisateur revient sur le site (rechargement / retour) */
  isReturning?: boolean;
};

export default function TransitionScreen({ onComplete, isReturning }: TransitionScreenProps) {
  const duration = isReturning ? TRANSITION_DURATION_RETURN_MS : TRANSITION_DURATION_MS;
  useEffect(() => {
    const t = setTimeout(onComplete, duration);
    return () => clearTimeout(t);
  }, [onComplete, duration]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
      {/* Ligne de route (comme au splash) */}
      <div
        className="absolute bottom-[28%] left-0 right-0 h-px origin-center scale-x-150 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        aria-hidden
      />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Car
          className="h-14 w-14 text-white/90 md:h-16 md:w-16"
          strokeWidth={1.5}
        />
      </motion.div>
    </motion.div>
  );
}
