import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import UserAccountDropdown from "./UserAccountDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onOpenChat: (initialMessage?: string) => void;
}

const vehiculesSubItems = [
  { label: "Catalogue", href: "/vehicules" },
  { label: "Calculez le prix", href: "/calculer-prix" },
];

const aProposSubItems = [
  { label: "Rentabilité", href: "/rentabilite" },
  { label: "Transport", href: "/transport" },
  { label: "Réseaux", href: "/reseaux" },
];

const loueTonVehiculeSubItems = [
  { label: "Louer", href: "/loue-ton-vehicule" },
  { label: "Voir mes demandes", href: "/verifier-ma-demande" },
];

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Véhicules", href: "/vehicules", subItems: vehiculesSubItems },
  { label: "Loue ton propre véhicule", href: "/loue-ton-vehicule", subItems: loueTonVehiculeSubItems },
  { label: "À propos", href: "/a-propos", subItems: aProposSubItems },
  { label: "Espace pro", href: "/espace-pro" },
  { label: "Contact", href: "/contact" },
];

const Header = ({ onOpenChat }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Overlay mobile : clic dehors pour fermer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/[0.08]"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4 lg:gap-6">
          {/* Logo + Nom — style luxe */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group"
            aria-label="Rebellion Luxury - Accueil"
          >
            <div className="logo-round overflow-hidden h-10 w-10 lg:h-12 lg:w-12 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src="/rebellion-luxury-logo.png"
                alt="Rebellion Luxury"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-luxury text-xs lg:text-sm font-medium tracking-[0.3em] text-white/85 uppercase group-hover:text-white transition-colors duration-300">
              Rebellion Luxury
            </span>
            <span className="shrink-0 w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center rounded-[4px] overflow-hidden border border-white/20 bg-red-600" aria-hidden title="Suisse">
              <img src="/swiss-flag.png" alt="" className="w-full h-full object-contain" />
            </span>
          </Link>

          {/* Desktop Nav — menu haut de gamme */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                ("subItems" in item && item.subItems.some((s) => location.pathname === s.href));
              const navLinkClass = `relative px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-300 flex items-center gap-1.5 rounded-md ${
                isActive
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`;
              const underlineClass = "absolute bottom-0 left-4 right-4 h-px bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left";
              if ("subItems" in item && item.subItems) {
                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <button className={`${navLinkClass} group hover:bg-white/[0.04]`}>
                        <span className="whitespace-nowrap">{item.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className={isActive ? "absolute bottom-0 left-4 right-4 h-px bg-white/50" : underlineClass} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="flex flex-row gap-0.5 p-2 min-w-0 w-auto border border-white/10 bg-black/95 backdrop-blur-xl rounded-lg shadow-2xl shadow-black/50"
                    >
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] rounded-md whitespace-nowrap transition-all duration-200 ${
                            location.pathname === sub.href
                              ? "text-white bg-white/10"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link key={item.label} to={item.href} className={`${navLinkClass} group hover:bg-white/[0.04]`}>
                  <span className="whitespace-nowrap">{item.label}</span>
                  <span className={isActive ? "absolute bottom-0 left-4 right-4 h-px bg-white/50" : underlineClass} />
                </Link>
              );
            })}
          </nav>

          {/* Compte utilisateur */}
          <div className="hidden lg:flex items-center shrink-0">
            <UserAccountDropdown />
          </div>

          {/* Mobile menu button — 44px min touch target */}
          <button
            type="button"
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-foreground rounded-lg hover:bg-muted active:bg-muted/80 touch-manipulation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>


        {/* Mobile Menu — structure claire, premium, tous les onglets visibles */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden overflow-hidden border-t border-white/[0.06] bg-black"
            >
              <nav
                className="mobile-nav flex flex-col py-3 px-3 overflow-y-auto overflow-x-hidden"
                style={{
                  maxHeight: "min(calc(100vh - 4.5rem), 88vh)",
                  WebkitOverflowScrolling: "touch",
                }}
                aria-label="Navigation principale"
              >
                {navItems.map((item) => {
                  const hasSub = "subItems" in item && item.subItems?.length;
                  const firstSubHref = hasSub ? item.subItems![0].href : null;
                  const parentSameAsFirst = hasSub && item.href === firstSubHref;
                  const isActive = location.pathname === item.href || (hasSub && item.subItems!.some((s) => location.pathname === s.href));

                  return (
                    <div key={item.label} className="flex flex-col gap-0.5">
                      {hasSub ? (
                        <>
                          <div className="pt-3 first:pt-0 pb-1 px-3 flex items-center gap-2">
                            <span className="text-white/30">—</span>
                            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                              {item.label}
                            </span>
                          </div>
                          {!parentSameAsFirst && (
                            <Link
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`min-h-[44px] pl-4 pr-3 flex items-center rounded-lg text-[15px] font-medium transition-colors ${
                                location.pathname === item.href
                                  ? "text-white bg-white/[0.06]"
                                  : "text-white/85 hover:bg-white/[0.04] hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          )}
                          {item.subItems!.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`min-h-[44px] pl-5 pr-3 flex items-center rounded-lg text-[14px] transition-colors border-l border-white/10 ml-3 ${
                                location.pathname === sub.href
                                  ? "text-white bg-white/[0.04] border-white/20"
                                  : "text-white/75 hover:bg-white/[0.03] hover:text-white/95"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`min-h-[44px] px-3 flex items-center rounded-lg text-[15px] font-medium transition-colors ${
                            isActive
                              ? "text-white bg-white/[0.06]"
                              : "text-white/85 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}

                <div className="my-2 h-px bg-white/[0.06]" aria-hidden />

                <div className="flex flex-col gap-0.5">
                  <div className="pt-1 pb-1 px-3 flex items-center gap-2">
                    <span className="text-white/30">—</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                      Assistant
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onOpenChat(); setIsMobileMenuOpen(false); }}
                    className="min-h-[44px] px-3 flex items-center gap-2 rounded-lg text-[14px] font-medium text-white/80 hover:bg-white/[0.04] hover:text-white transition-colors"
                  >
                    Rebellion IA
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-white/[0.06]">
                  <UserAccountDropdown className="w-full justify-start text-white/60 hover:text-white text-[13px] min-h-[44px] px-3 transition-colors" />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
    </>
  );
};

export default Header;
