import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import { CONTACT } from "@/data/chatKnowledge";
import { Quote, Mail, Phone, MapPin, Instagram, ExternalLink } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io5";
import { LocationMap } from "@/components/ui/expand-map";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";

const Index = () => {
  return (
    <>
      <Hero />
      {/* Teaser véhicules : deux vidéos côte à côte + CTA vers /vehicules */}
      <section className="py-10 sm:py-14 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-10 sm:mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-3 sm:mb-4 led-badge">
              Notre Flotte
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 tracking-tight">
              McLaren 570S — <span className="text-gradient-orange">Best seller</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Notre best seller et notre sélection de supercars haut de gamme en Suisse romande.
            </p>
          </motion.div>

          {/* Visuel showroom McLaren — Best seller + valeurs flottantes (prix, caractéristiques) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full mx-auto mb-10 sm:mb-14"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-visible">
              <div className="relative flex items-center justify-center min-h-[260px] sm:min-h-[320px] lg:min-h-[400px] bg-black rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src="/hero-mclaren.png"
                  alt="Rebellion Luxury — McLaren 570S en showroom"
                  className="w-full h-full max-h-[70vh] object-contain"
                />
                {/* Best seller — 3D flottant */}
                <motion.span
                  className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.35em] text-white backdrop-blur-md bg-white/[0.08] border border-white/[0.12]"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.1) inset" }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Best seller
                </motion.span>
                {/* Prix — pastille 3D */}
                <motion.span
                  className="absolute top-6 left-6 z-10 px-4 py-2.5 rounded-xl font-sans text-sm font-semibold tracking-wide text-white tabular-nums backdrop-blur-md bg-black/40 border border-white/[0.1]"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset" }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                >
                  Dès 950 <span className="text-white/80 font-normal">CHF</span>
                  <span className="text-white/50 text-xs font-normal ml-0.5">/ jour</span>
                </motion.span>
                {/* 570 CH — pastille 3D */}
                <motion.span
                  className="absolute top-6 right-6 z-10 px-4 py-2.5 rounded-xl font-sans text-sm font-semibold tracking-widest text-white backdrop-blur-md bg-black/40 border border-white/[0.1]"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset" }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                >
                  570 CH
                </motion.span>
                {/* Portes papillon — pastille 3D */}
                <motion.span
                  className="absolute bottom-24 left-6 z-10 px-4 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-[0.22em] text-white/95 backdrop-blur-md bg-black/40 border border-white/[0.1]"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset" }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                >
                  Portes papillon
                </motion.span>
                {/* V8 bi-turbo — pastille 3D */}
                <motion.span
                  className="absolute bottom-24 right-6 z-10 px-4 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-[0.22em] text-white/95 backdrop-blur-md bg-black/40 border border-white/[0.1]"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset" }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
                >
                  V8 bi-turbo
                </motion.span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none rounded-b-xl sm:rounded-b-2xl" />
              <div className="absolute bottom-4 sm:bottom-5 left-4 right-4 sm:left-6 sm:right-6 flex items-center justify-between z-10">
                <span className="font-sans text-[11px] font-medium tracking-[0.28em] text-white/60 uppercase">
                  Rebellion Luxury
                </span>
              </div>
            </div>
          </motion.div>

          {/* Avis clients — juste en dessous de la vidéo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            {/* Logo Google en haut de la section avis */}
            <div className="flex justify-center mb-4">
              <a
                href={CONTACT.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 transition-colors hover:bg-white/10 hover:border-white/25"
                aria-label="Avis Google"
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-medium text-foreground/90">Avis Google</span>
              </a>
            </div>
            <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4 led-badge">
              Avis clients
            </span>
            <h3 className="font-display text-xl font-bold mb-2">Ce qu&apos;ils disent de nos véhicules</h3>
            <p className="text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
              Avis dédiés à l&apos;Audi R8 et à la McLaren 570S.
            </p>
            <ReviewsCarousel />
            <a
              href={CONTACT.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-6"
            >
              <Quote className="w-4 h-4" />
              Voir tous les avis sur Google
            </a>
          </motion.div>

          {/* Contact : email, téléphone, adresse, réseaux — vrais liens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 pt-12 border-t border-border led-section"
          >
            <h3 className="font-display text-lg font-semibold mb-2 text-foreground">Nous contacter</h3>
            <p className="text-muted-foreground text-sm mb-6">Réservez ou posez vos questions — nous répondons rapidement.</p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 px-4 py-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-white/5 transition-all text-muted-foreground hover:text-primary"
              >
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{CONTACT.email}</span>
              </a>
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="flex items-center gap-3 px-4 py-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-white/5 transition-all text-muted-foreground hover:text-primary"
              >
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{CONTACT.phone}</span>
              </a>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 rounded-lg border border-[#25d366]/30 hover:border-[#25d366] hover:bg-[#25d366]/10 transition-all text-muted-foreground hover:text-[#25d366]"
              >
                <IoLogoWhatsapp className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-white/5 transition-all text-muted-foreground hover:text-primary"
              >
                <Instagram className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
              <a
                href={CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-white/5 transition-all text-muted-foreground hover:text-primary"
              >
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{CONTACT.location}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
              </a>
            </div>
          </motion.div>

          {/* Lieux en 3D avec carte — Suisse, Evionnaz */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mt-16 flex flex-col items-center"
          >
            <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4 led-badge">
              Localisation
            </span>
            <h3 className="font-display text-xl font-bold mb-2">Où nous trouver</h3>
            <p className="text-muted-foreground text-sm mb-6 text-center max-w-md">
              Rebellion Luxury — récupérez votre supercar à Evionnaz (Valais). Cliquez sur la carte pour ouvrir Google Maps.
            </p>
            <div className="relative z-10 flex flex-col items-center">
              <LocationMap
                location="Suisse, Evionnaz"
                coordinates="46.18° N, 7.02° E — Valais, Suisse romande"
                mapsUrl={CONTACT.googleMapsUrl}
                className="mt-2"
              />
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default Index;
