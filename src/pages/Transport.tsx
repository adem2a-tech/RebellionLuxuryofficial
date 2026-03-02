import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

const CONDITIONS = [
  { text: "Location minimum 24h — prix sur demande" },
  { text: "Acompte obligatoire" },
];

const TRANSPORT_PRICE_PER_KM = 2; // CHF
const POINT_A = "Evionnaz (siège Rebellion Luxury)";
const POINT_B = "Livraison au client (adresse de votre choix)";
const POINT_C = "Retour à Evionnaz";

const Transport = () => {
  return (
    <div className="pt-24 lg:pt-28 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-12"
        >
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            Transport
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Livraison à <span className="text-gradient-orange">domicile</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
            Vous souhaitez récupérer votre véhicule de location à domicile, au bureau ou en vacances ? Rebellion Luxury assure une <strong className="text-foreground">livraison clé en main</strong> à l&apos;adresse de votre choix en Suisse romande. Pas besoin de vous déplacer jusqu&apos;à Evionnaz : nous amenons le véhicule jusqu&apos;à vous, avec un tarif au kilomètre <strong className="text-foreground">transparent et sans surprise</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le coût du transport est calculé sur le <strong className="text-foreground">trajet complet aller-retour</strong> depuis notre siège (Evionnaz, Valais). Vous recevez une <strong className="text-foreground">estimation personnalisée</strong> avant toute réservation — demandez-la via Rebellion IA (chat sur le site) ou par WhatsApp. Livraison possible sur Lausanne, Genève, Montreux, Sion, Martigny, Fribourg, Neuchâtel et toute la Suisse romande.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-12">
            Nous utilisons une <strong className="text-foreground">remorque plateau professionnelle</strong> et un véhicule d&apos;accompagnement dédié. Votre voiture est assurée pendant le transport. Un créneau horaire vous est proposé pour la livraison et la récupération en fin de location.
          </p>

          {/* Tarif du transport — carte mise en avant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-border bg-card/80 dark:bg-zinc-900/80 p-6 md:p-8 mb-10"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Tarif du transport
            </h2>
            <p className="text-muted-foreground mb-2">
              <strong className="text-foreground text-lg">{TRANSPORT_PRICE_PER_KM} CHF / km</strong>
              {" — "}
              calculé sur le trajet complet :
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">A</span>
                <span>{POINT_A}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">B</span>
                <span>{POINT_B}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">C</span>
                <span>{POINT_C}</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mb-2">
              Prix du transport = (A → B → C) × {TRANSPORT_PRICE_PER_KM} CHF/km.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Le kilométrage correspond au trajet réel (calcul type GPS). Aucun frais caché. Le montant vous est communiqué avant validation de la réservation.
            </p>
            <p className="text-sm text-primary font-medium">
              Demandez une estimation via Rebellion IA ou WhatsApp.
            </p>
          </motion.div>

          {/* Comment ça marche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="rounded-2xl border border-border bg-card/30 dark:bg-zinc-900/30 p-6 md:p-8 mb-10"
          >
            <h2 className="font-display text-xl md:text-2xl font-bold mb-4 text-foreground">
              Comment ça marche
            </h2>
            <ol className="space-y-3 text-muted-foreground text-sm md:text-base list-decimal list-inside">
              <li><strong className="text-foreground">Réservation</strong> — Vous choisissez le véhicule et les dates. Indiquez l&apos;adresse de livraison (domicile, hôtel, bureau, etc.).</li>
              <li><strong className="text-foreground">Estimation</strong> — Nous vous envoyons le coût du transport (trajet A → B → C × 2 CHF/km) et validons un créneau horaire de livraison.</li>
              <li><strong className="text-foreground">Livraison</strong> — Le jour convenu, notre équipe amène le véhicule à l&apos;adresse indiquée. Remise des clés, état des lieux, explication du véhicule.</li>
              <li><strong className="text-foreground">Récupération</strong> — En fin de location, nous récupérons le véhicule à la même adresse (ou une autre convenue). Le trajet de retour est inclus dans le tarif.</li>
            </ol>
          </motion.div>

          {/* Images transport */}
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              Notre service en images
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Remorque plateau professionnelle, véhicule d&apos;accompagnement et livraison en conditions réelles en Suisse romande.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-border bg-card/50 aspect-[4/3]"
            >
              <img
                src="/transport-jeep.png"
                alt="Véhicules Rebellion Luxury sur remorque professionnelle — chargement au siège Evionnaz"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="rounded-2xl overflow-hidden border border-border bg-card/50 aspect-[4/3]"
            >
              <img
                src="/transport-lausanne.png"
                alt="Livraison Rebellion Luxury en route — Suisse romande"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Conditions & avantages — encadré deux colonnes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-2xl border border-border bg-card/50 dark:bg-zinc-900/50 p-6 md:p-8"
          >
            <h2 className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground">
              Conditions & avantages
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Livraison et récupération à domicile, au bureau ou en lieu de vacances — toute la Suisse romande.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                {CONDITIONS.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <span className="shrink-0 mt-0.5 text-primary" aria-hidden>
                      <Check className="h-5 w-5" />
                    </span>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.58 }} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-primary" aria-hidden><Check className="h-5 w-5" /></span>
                  <span>Livraison sur Lausanne, Genève, Valais, Vaud, Fribourg, Neuchâtel — Suisse romande</span>
                </motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.64 }} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-primary" aria-hidden><Check className="h-5 w-5" /></span>
                  <span>Créneau horaire de livraison et de récupération convenu à l&apos;avance</span>
                </motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.7 }} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-primary" aria-hidden><Check className="h-5 w-5" /></span>
                  <span>Véhicule assuré pendant le transport (remorque professionnelle)</span>
                </motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.76 }} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-primary" aria-hidden><Check className="h-5 w-5" /></span>
                  <span>Service premium : remise des clés et état des lieux à votre adresse</span>
                </motion.li>
              </ul>
              <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                <motion.li initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.52 }} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-primary" aria-hidden><Check className="h-5 w-5" /></span>
                  <span>Tarif transparent au km, sans frais caché — calcul sur trajet réel (A → B → C)</span>
                </motion.li>
                <motion.li initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-primary" aria-hidden><Check className="h-5 w-5" /></span>
                  <span>Équipe et matériel dédiés : remorque plateau, véhicule d&apos;accompagnement</span>
                </motion.li>
                <motion.li initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.68 }} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-primary" aria-hidden><Check className="h-5 w-5" /></span>
                  <span>Estimation personnalisée avant réservation (Rebellion IA ou WhatsApp)</span>
                </motion.li>
                <motion.li initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.74 }} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-primary" aria-hidden><Check className="h-5 w-5" /></span>
                  <span>Récupération en fin de location à l&apos;adresse convenue (inclus dans le tarif)</span>
                </motion.li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/vehicules">
                <Sparkles className="w-5 h-5" />
                Découvrir nos véhicules
              </Link>
            </Button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default Transport;
