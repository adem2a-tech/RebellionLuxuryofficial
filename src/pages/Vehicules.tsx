import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import VehiclesSection from "@/components/VehiclesSection";
import { ArrowLeft } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { BOBOLOC_VEHICLES_URL } from "@/data/chatKnowledge";
import { ExternalLink } from "lucide-react";

const Vehicules = () => {
  const { openChat } = useChat();
  const [searchParams] = useSearchParams();
  const horsRebellion = searchParams.get("hors-rebellion") === "1";
  return (
    <motion.div
      className="min-h-screen pt-24 lg:pt-28 pb-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fond premium : gradient très subtil */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(0_0%_100%_/_0.04),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,hsl(0_0%_100%_/_0.02),transparent)]" />

      <motion.div
        className="container mx-auto px-4 lg:px-8 mb-6 relative z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </motion.div>
      <VehiclesSection onlyHorsRebellion={horsRebellion} />
      <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-lg border-white/20 text-foreground hover:bg-white/10 hover:border-white/30"
              onClick={() => window.open(BOBOLOC_VEHICLES_URL, "_blank", "noopener,noreferrer")}
            >
              Voir les disponibilités sur Boboloc
              <ExternalLink className="w-4 h-4 ml-2 shrink-0" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => openChat("Quels véhicules sont disponibles pour mes dates ?")}
            >
              Vérifier avec Rebellion IA
            </Button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Vehicules;
