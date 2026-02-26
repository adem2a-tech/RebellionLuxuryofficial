import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Check } from "lucide-react";
import { Button } from "./ui/button";
import UserAccountDropdown from "./UserAccountDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  onOpenChat: (initialMessage?: string) => void;
}

const vehiculesSubItems = [
  { menuKey: "menu.catalogue", href: "/vehicules" },
  { menuKey: "menu.calculatePrice", href: "/calculer-prix" },
];

const aProposSubItems = [
  { menuKey: "menu.profitability", href: "/rentabilite" },
  { menuKey: "menu.transport", href: "/transport" },
  { menuKey: "menu.networks", href: "/reseaux" },
];

const loueTonVehiculeSubItems = [
  { menuKey: "menu.rent", href: "/loue-ton-vehicule" },
  { menuKey: "menu.viewRequests", href: "/verifier-ma-demande" },
];

const navItems = [
  { menuKey: "menu.home", href: "/" },
  { menuKey: "menu.vehicles", href: "/vehicules", subItems: vehiculesSubItems },
  { menuKey: "menu.rentYourCar", href: "/loue-ton-vehicule", subItems: loueTonVehiculeSubItems },
  { menuKey: "menu.about", href: "/a-propos", subItems: aProposSubItems },
  { menuKey: "menu.proSpace", href: "/espace-pro" },
  { menuKey: "menu.contact", href: "/contact" },
];

const LANGUAGES = [
  { code: "fr" as const, label: "Français" },
  { code: "en" as const, label: "English" },
];

const Header = ({ onOpenChat }: HeaderProps) => {
  const { locale, setLocale, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedKeys, setMobileExpandedKeys] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleMobileExpanded = (key: string) => {
    setMobileExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
              const label = t(item.menuKey);
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
                  <DropdownMenu key={item.menuKey}>
                    <DropdownMenuTrigger asChild>
                      <button className={`${navLinkClass} group hover:bg-white/[0.04]`}>
                        <span className="whitespace-nowrap">{label}</span>
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
                          key={sub.menuKey}
                          to={sub.href}
                          className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] rounded-md whitespace-nowrap transition-all duration-200 ${
                            location.pathname === sub.href
                              ? "text-white bg-white/10"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {t(sub.menuKey)}
                        </Link>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link key={item.menuKey} to={item.href} className={`${navLinkClass} group hover:bg-white/[0.04]`}>
                  <span className="whitespace-nowrap">{label}</span>
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


        {/* Mobile Menu — style référence : liste claire, chevrons pour sous-menus */}
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
                  const label = t(item.menuKey);
                  const isOpen = !!mobileExpandedKeys[item.menuKey];
                  const isActive = location.pathname === item.href || (hasSub && item.subItems!.some((s) => location.pathname === s.href));

                  if (hasSub) {
                    return (
                      <div key={item.menuKey} className="flex flex-col gap-0">
                        <div className="flex items-center">
                          <Link
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex-1 min-h-[44px] pl-3 pr-2 flex items-center rounded-lg text-[15px] font-semibold text-white hover:bg-white/[0.04] transition-colors ${
                              isActive ? "bg-white/[0.06]" : ""
                            }`}
                          >
                            {label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleMobileExpanded(item.menuKey)}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/90 hover:bg-white/[0.06] transition-colors"
                            aria-expanded={isOpen}
                          >
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {item.subItems!.map((sub) => (
                                <Link
                                  key={sub.menuKey}
                                  to={sub.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`min-h-[44px] pl-5 pr-3 flex items-center rounded-lg text-[14px] font-medium transition-colors ${
                                    location.pathname === sub.href
                                      ? "text-white bg-white/[0.06]"
                                      : "text-white/85 hover:bg-white/[0.04] hover:text-white"
                                  }`}
                                >
                                  {t(sub.menuKey)}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.menuKey}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`min-h-[44px] px-3 flex items-center rounded-lg text-[15px] font-semibold transition-colors ${
                        isActive ? "text-white bg-white/[0.06]" : "text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}

                <div className="my-2 h-px bg-white/[0.06]" aria-hidden />

                <button
                  type="button"
                  onClick={() => { onOpenChat(); setIsMobileMenuOpen(false); }}
                  className="min-h-[44px] px-3 flex items-center rounded-lg text-[15px] font-semibold text-white hover:bg-white/[0.04] transition-colors"
                >
                  {t("menu.assistant")}
                </button>

                <div className="my-3 h-px bg-white/[0.06]" aria-hidden />

                <div className="flex flex-col gap-0.5">
                  <div className="pt-1 pb-2 px-3 flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                      {t("menu.language")}
                    </span>
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLocale(lang.code)}
                      className="min-h-[44px] px-3 flex items-center justify-between rounded-lg text-[14px] font-medium text-white/85 hover:bg-white/[0.04] hover:text-white transition-colors"
                    >
                      <span>{lang.label}</span>
                      {locale === lang.code && (
                        <Check className="w-5 h-5 text-white/90 shrink-0" strokeWidth={2.5} />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06]">
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
