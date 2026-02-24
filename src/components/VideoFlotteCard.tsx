import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface VideoFlotteCardProps {
  title: string;
  videoSrc?: string;
  imageSrc?: string;
  ariaLabel: string;
  vehicleType?: string;
  description?: string;
  className?: string;
  /** Affiche un badge Best seller */
  bestSeller?: boolean;
  /** Courtes descriptions 3D affichées autour de la voiture (ex: "570 CH", "Portes papillon") */
  specs3d?: string[];
}

export function VideoFlotteCard({
  title,
  videoSrc,
  imageSrc,
  ariaLabel,
  vehicleType,
  description,
  className,
  bestSeller,
  specs3d = [],
}: VideoFlotteCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn("w-full relative", className)}
      style={{ perspective: 1500 }}
    >
      <motion.div
        className="relative"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ z: 10 }}
      >
        <div className="relative group">
          {/* Card glow */}
          <motion.div
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
            animate={{
              boxShadow: [
                "0 0 10px 2px hsl(var(--primary) / 0.1)",
                "0 0 20px 6px hsl(var(--primary) / 0.2)",
                "0 0 10px 2px hsl(var(--primary) / 0.1)",
              ],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            }}
          />

          {/* Traveling light beams */}
          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
              animate={{
                left: ["-50%", "100%"],
                opacity: [0.3, 0.7, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
              }}
              transition={{
                left: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 },
                opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" },
                filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror" },
              }}
            />
            <motion.div
              className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-primary to-transparent opacity-70"
              animate={{
                top: ["-50%", "100%"],
                opacity: [0.3, 0.7, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
              }}
              transition={{
                top: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 },
                opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
                filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
              animate={{
                right: ["-50%", "100%"],
                opacity: [0.3, 0.7, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
              }}
              transition={{
                right: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.2 },
                opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
                filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-primary to-transparent opacity-70"
              animate={{
                bottom: ["-50%", "100%"],
                opacity: [0.3, 0.7, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
              }}
              transition={{
                bottom: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.8 },
                opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
                filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
              }}
            />
            {/* Corner glow spots */}
            <motion.div
              className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-primary/60 blur-[1px]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div
              className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-primary/70 blur-[2px]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-primary/70 blur-[2px]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", delay: 1 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-primary/60 blur-[1px]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.3, repeat: Infinity, repeatType: "mirror", delay: 1.5 }}
            />
          </div>

          {/* Border gradient */}
          <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Glass card + video */}
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm shadow-2xl">
            <div className="px-4 pt-4 pb-2 text-left space-y-0.5 flex items-center justify-between gap-2">
              <div>
                <p className="font-display text-base font-semibold text-foreground">{title}</p>
                {vehicleType && (
                  <p className="text-xs font-medium text-primary uppercase tracking-wider">
                    {vehicleType}
                  </p>
                )}
              </div>
              {bestSeller && (
                <span className="shrink-0 rounded-full border border-amber-400/50 bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                  Best seller
                </span>
              )}
            </div>
            {/* Image/vidéo — object-contain pour tout voir + descriptions 3D autour */}
            <div className="relative px-3 pb-3">
              <motion.div
                className="relative rounded-xl overflow-visible"
                animate={{
                  boxShadow: [
                    "inset 0 0 0 2px hsl(var(--primary) / 0.5), 0 0 12px hsl(var(--primary) / 0.25)",
                    "inset 0 0 0 2px hsl(var(--primary) / 0.9), 0 0 20px hsl(var(--primary) / 0.45), 0 0 30px hsl(var(--primary) / 0.2)",
                    "inset 0 0 0 2px hsl(var(--primary) / 0.5), 0 0 12px hsl(var(--primary) / 0.25)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              >
                <div className={`relative w-full ${imageSrc ? "aspect-[4/3] min-h-[260px] sm:min-h-[300px]" : "aspect-[16/9] min-h-[240px] sm:min-h-[280px]"}`}>
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={ariaLabel}
                        className="w-full h-full object-contain bg-black/50"
                      />
                    ) : videoSrc ? (
                      <video
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        aria-label={ariaLabel}
                      />
                    ) : null}
                  </div>
                  {/* Descriptions brèves 3D flottantes détourées */}
                  {specs3d.length > 0 && (
                    <>
                      {specs3d[0] && (
                        <motion.span
                          className="spec-3d-floating absolute top-3 left-3 z-10 rounded-lg bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
                          style={{
                            textShadow: "0 0 1px #000, 0 0 1px #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                            boxShadow: "0 6px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.5)",
                          }}
                          initial={{ y: 0 }}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {specs3d[0]}
                        </motion.span>
                      )}
                      {specs3d[1] && (
                        <motion.span
                          className="spec-3d-floating absolute top-3 right-3 z-10 rounded-lg bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
                          style={{
                            textShadow: "0 0 1px #000, 0 0 1px #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                            boxShadow: "0 6px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.5)",
                          }}
                          initial={{ y: 0 }}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                          {specs3d[1]}
                        </motion.span>
                      )}
                      {specs3d[2] && (
                        <motion.span
                          className="spec-3d-floating absolute bottom-3 left-3 z-10 rounded-lg bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
                          style={{
                            textShadow: "0 0 1px #000, 0 0 1px #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                            boxShadow: "0 6px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.5)",
                          }}
                          initial={{ y: 0 }}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                          {specs3d[2]}
                        </motion.span>
                      )}
                      {specs3d[3] && (
                        <motion.span
                          className="spec-3d-floating absolute bottom-3 right-3 z-10 rounded-lg bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
                          style={{
                            textShadow: "0 0 1px #000, 0 0 1px #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                            boxShadow: "0 6px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.5)",
                          }}
                          initial={{ y: 0 }}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        >
                          {specs3d[3]}
                        </motion.span>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>
            {description && (
              <p className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
