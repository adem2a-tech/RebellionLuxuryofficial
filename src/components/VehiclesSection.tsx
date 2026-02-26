import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { getAllVehicles } from "@/data/vehicles";
import { getApprovedVehicles } from "@/data/vehicleRequests";
import { useVehicleRequests } from "@/contexts/VehicleRequestsContext";
import { getUnavailableUntil } from "@/data/vehicleReservations";
import { useReservations } from "@/contexts/ReservationContext";

interface VehiclesSectionProps {
  onAskQuestion?: (vehicleName: string) => void;
  /** Afficher uniquement les véhicules issus de demandes acceptées (hors Rebellion) */
  onlyHorsRebellion?: boolean;
}

function isVideoUrl(url: string): boolean {
  if (url.startsWith("data:video/")) return true;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

/** Carrousel images + vidéos (vidéos à la fin) : centré, sans bordures */
function VehicleCardCarousel({ images, videos = [], badgeLabel = "Rebellion" }: { images: string[]; videos?: string[]; badgeLabel?: string }) {
  const [index, setIndex] = useState(0);
  const slides = [...images.slice(0, 10), ...videos.slice(0, 2)];
  const count = slides.length;
  const currentSrc = count > 0 ? slides[index % count] : null;
  const isVideo = currentSrc ? isVideoUrl(currentSrc) : false;

  const goPrev = () => setIndex((i) => (i - 1 + count) % count);
  const goNext = () => setIndex((i) => (i + 1) % count);

  if (count === 0) {
    return (
      <div className="relative aspect-[3/2] bg-black shrink-0 w-full rounded-t-xl flex items-center justify-center text-white/30 text-xs tracking-wide">
        Aucun média
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[3/2] bg-black overflow-hidden shrink-0 w-full select-none z-20 rounded-t-xl"
      onClick={(e) => e.stopPropagation()}
      role="region"
      aria-label="Carrousel photos et vidéos"
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false}>
          {currentSrc && isVideo ? (
            <motion.video
              key={index}
              src={currentSrc}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              controls
              playsInline
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          ) : currentSrc ? (
            <motion.img
              key={index}
              src={currentSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              draggable={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          ) : null}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      <div className="absolute top-3 left-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/90 uppercase tracking-[0.15em] pointer-events-none">
        {badgeLabel}
      </div>
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 text-white/90 flex items-center justify-center z-30 cursor-pointer touch-manipulation transition-colors"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-4 h-4 pointer-events-none" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 text-white/90 flex items-center justify-center z-30 cursor-pointer touch-manipulation transition-colors"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-4 h-4 pointer-events-none" />
          </button>
        </>
      )}
    </div>
  );
}

const VehiclesSection = ({ onAskQuestion, onlyHorsRebellion = false }: VehiclesSectionProps) => {
  const { version } = useVehicleRequests();
  const { version: reservationsVersion } = useReservations();
  const vehicles = onlyHorsRebellion ? getApprovedVehicles() : getAllVehicles();

  return (
    <section id="vehicles" className="py-16 lg:py-24 relative font-display">
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-white/[0.02] blur-[100px] rounded-full" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/50 text-[10px] font-medium tracking-[0.28em] uppercase mb-5">
            {onlyHorsRebellion ? "Catalogue des particuliers" : "Notre flotte"}
          </span>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            {onlyHorsRebellion ? <>Véhicules des <span className="text-white">particuliers</span></> : <>Nos <span className="text-white">véhicules</span> d&apos;exception</>}
          </h2>
          <div className="w-12 h-px bg-white/15 mx-auto mb-5" />
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
            {onlyHorsRebellion
              ? "Proposés par des propriétaires via notre plateforme. Même exigence de qualité."
              : "Supercars de prestige, conditions transparentes, service sur mesure."}
          </p>
          {!onlyHorsRebellion && (
            <a
              href="https://www.tiktok.com/@rebellion.luxury"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm font-medium tracking-wide mt-4 transition-colors"
              aria-label="Suivre Rebellion Luxury sur TikTok"
            >
              <Music2 className="w-4 h-4" />
              TikTok
            </a>
          )}
        </motion.div>

        {/* Grille catalogue pleine largeur — thème sombre type NERO */}
        <div className="w-full">
          {vehicles.length === 0 && onlyHorsRebellion ? (
            <p className="text-center text-muted-foreground py-12">Aucun véhicule de particulier pour le moment. Les véhicules acceptés via « Loue ton propre véhicule » apparaîtront ici.</p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {vehicles.map((vehicle) => {
                    const slug = vehicle.slug;
                    const unavailableUntil = getUnavailableUntil(vehicle.name);
                    const formatDate = (d: string) => {
                      const [y, m, day] = d.split("-");
                      return `${day}/${m}`;
                    };
                    const v = vehicle as {
                      slug?: string;
                      name: string;
                      year?: number;
                      pricePerDay?: number;
                      location?: string;
                      category?: string;
                      images?: string[];
                      video?: string;
                      specs?: { power?: string };
                    };
                    /* Liste d’images pour le carrousel (imports Vite = URLs string) */
                    const imageList: string[] = Array.isArray(v.images)
                      ? v.images.slice(0, 10).map((x) => (typeof x === "string" ? x : String(x)))
                      : [];
                    const videoList: string[] = (v.videos && v.videos.length > 0)
                      ? v.videos.slice(0, 2)
                      : (v.video ? [v.video] : []);
                    const locationLabel = v.location ?? "";
                    const yearLabel = v.year != null ? v.year : "";
                    const categoryLabel = v.category ?? "";
                    const detailUrl = slug ? `/vehicules/${slug}` : "/vehicules";
                    return (
                      <motion.article
                        key={vehicle.slug}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="w-full relative group/card"
                      >
                        <div className="relative h-full block">
                          <div className="relative rounded-xl overflow-hidden h-full min-h-[340px] flex flex-col bg-black border border-white/[0.06] transition-all duration-300 hover:border-white/[0.1] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]">
                            <VehicleCardCarousel images={imageList} videos={videoList} badgeLabel={onlyHorsRebellion ? "Particulier" : "Rebellion"} />
                            {onlyHorsRebellion && (
                              <p className="px-4 py-2 text-[11px] text-white/40 bg-black/80 border-t border-white/5">
                                Ce véhicule n&apos;appartient pas à Rebellion Luxury
                              </p>
                            )}
                            {unavailableUntil && (
                              <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-md bg-amber-500/90 text-black text-[11px] font-medium uppercase tracking-wider">
                                Indisponible jusqu&apos;au {formatDate(unavailableUntil)}
                              </div>
                            )}
                            <Link
                              to={detailUrl}
                              className="p-4 lg:p-5 flex flex-col gap-1.5 shrink-0 bg-black cursor-pointer block border-t border-white/[0.06] hover:bg-white/[0.02] transition-colors rounded-b-xl"
                            >
                              <p className="font-display font-medium text-sm lg:text-base text-white tracking-[0.06em] leading-tight">
                                {v.name}
                                {v.specs?.power && <span className="text-white/60"> — {v.specs.power}</span>}
                                {locationLabel ? <span className="text-white/50"> ({locationLabel})</span> : null}
                              </p>
                              {v.pricePerDay != null && (
                                <p className="text-xs text-white/50 font-medium tracking-wide">
                                  À partir de <span className="text-white/90">{v.pricePerDay.toLocaleString("fr-CH")} CHF</span>/24h
                                </p>
                              )}
                              <span className="inline-flex w-full items-center justify-center gap-1.5 mt-2 py-2 text-[11px] font-medium tracking-[0.2em] uppercase text-white/70 group-hover/card:text-white border border-white/10 rounded-md transition-colors">
                                Voir le véhicule
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VehiclesSection;
