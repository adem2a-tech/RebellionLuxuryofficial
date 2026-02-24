import { useEffect } from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";

const SPLASH_DURATION_MS = 900;

type SplashScreenProps = {
  onComplete: () => void;
};

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      {/* Ligne de route (effet perspective) */}
      <div
        className="absolute bottom-[28%] left-0 right-0 h-1 origin-center scale-x-150 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        aria-hidden
      />
      <div
        className="absolute bottom-[27%] left-0 right-0 h-px bg-white/20"
        aria-hidden
      />

      {/* Voiture sportive — chargement */}
      <motion.div
        className="absolute bottom-[30%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center"
        initial={{ x: "-50%", opacity: 0.8 }}
        animate={{
          x: "calc(50vw + 80px)",
          opacity: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Car className="h-12 w-12 text-white/95 md:h-14 md:w-14" strokeWidth={1.5} />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <span className="font-sans text-lg font-semibold tracking-wider text-white/90 md:text-xl">
          REBELLION LUXURY
        </span>
      </motion.div>

      {/* Lueur basse */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}
