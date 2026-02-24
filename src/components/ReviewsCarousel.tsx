import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const R8_REVIEWS = [
  { name: "Thomas M.", text: "Expérience incroyable ! L'Audi R8 au top, équipe pro. Je recommande à 100 %.", date: "Il y a 2 semaines" },
  { name: "Julien P.", text: "R8 V8 au top, livraison soignée. On reviendra pour la McLaren.", date: "Il y a 2 mois" },
  { name: "Antoine D.", text: "Location sans stress, tout est bien organisé. Audi R8 magnifique.", date: "Il y a 4 semaines" },
  { name: "Marie K.", text: "Première location de supercar : des souvenirs inoubliables. Merci !", date: "Il y a 1 semaine" },
];

const MCLAREN_REVIEWS = [
  { name: "Sophie L.", text: "Location McLaren impeccable. Véhicule nickel, tout était parfait pour notre weekend.", date: "Il y a 1 mois" },
  { name: "Lucas B.", text: "Week-end en McLaren : pure folie. Le meilleur cadeau qu'on m'ait fait.", date: "Il y a 1 mois" },
  { name: "Emma V.", text: "Professionnels, réactifs, véhicules impeccables. Un must en Suisse romande.", date: "Il y a 3 semaines" },
  { name: "David R.", text: "Super service, voitures de rêve. Rebellion Luxury tient ses promesses.", date: "Il y a 3 semaines" },
];

const ALL_REVIEWS = [
  ...R8_REVIEWS.map((r) => ({ ...r, vehicle: "Audi R8 V8" as const })),
  ...MCLAREN_REVIEWS.map((r) => ({ ...r, vehicle: "McLaren 570S" as const })),
];

/** Logo Google compact pour les cartes */
function GoogleLogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function ReviewsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
      style={{ perspective: "1200px" }}
    >
      <Carousel
        opts={{ align: "center", loop: true }}
        className="w-full max-w-4xl mx-auto"
        setApi={setApi}
      >
        <CarouselContent className="-ml-2 md:-ml-6">
          {ALL_REVIEWS.map((review, i) => (
            <CarouselItem key={`${review.vehicle}-${i}`} className="pl-2 md:pl-6 basis-full sm:basis-[85%] md:basis-[70%] lg:basis-[55%]">
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-black/70 p-6 md:p-7 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.25),0_0_1px_rgba(255,255,255,0.1)_inset] hover:border-white/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_1px_rgba(255,255,255,0.15)_inset] transition-all duration-300"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* En-tête : logo Google + véhicule */}
                <div className="flex items-center justify-between mb-5">
                  <GoogleLogoIcon className="h-6 w-6 shrink-0" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70 px-2.5 py-1 rounded-md bg-white/10 border border-white/10">
                    {review.vehicle}
                  </span>
                </div>
                {/* Étoiles */}
                <div className="flex gap-0.5 mb-4" aria-hidden>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400/90 text-amber-400/90 shrink-0" />
                  ))}
                </div>
                {/* Citation */}
                <Quote className="absolute top-14 left-5 w-7 h-7 text-white/10 pointer-events-none" aria-hidden />
                <p className="text-foreground/95 text-sm md:text-base leading-relaxed pl-1 mb-5 min-h-[4rem] font-medium">
                  {review.text}
                </p>
                {/* Auteur et date */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-sm font-semibold text-foreground/90">{review.name}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-2 md:-left-12 h-10 w-10 rounded-full border-white/20 bg-black/80 text-white hover:bg-white/20 hover:text-white hover:border-white/40" />
        <CarouselNext className="-right-2 md:-right-12 h-10 w-10 rounded-full border-white/20 bg-black/80 text-white hover:bg-white/20 hover:text-white hover:border-white/40" />
      </Carousel>
      <div className="flex justify-center gap-1.5 mt-6">
        {ALL_REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Avis ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
