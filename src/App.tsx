import { useState, useEffect, Component, lazy, Suspense, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { ReservationProvider } from "@/contexts/ReservationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import IdentificationScreen from "@/components/IdentificationScreen";
import TransitionScreen from "@/components/TransitionScreen";
import SiteLayout from "@/components/SiteLayout";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import APropos from "./pages/APropos";
import Reseaux from "./pages/Reseaux";
import Transport from "./pages/Transport";
import Vehicules from "./pages/Vehicules";
import VehiculeDetail from "./pages/VehiculeDetail";
import Rentabilite from "./pages/Rentabilite";
import LoueTonVehicule from "./pages/LoueTonVehicule";
import VerifierMaDemande from "./pages/VerifierMaDemande";
import CalculerPrix from "./pages/CalculerPrix";
import Contact from "./pages/Contact";
import EspacePro from "./pages/EspacePro";
import NotFound from "./pages/NotFound";
import { ProAuthProvider } from "./contexts/ProAuthContext";
import { VehicleRequestsProvider } from "./contexts/VehicleRequestsContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

/** Mettre à true tant que le client ne répond pas — le site reste bloqué sur la page maintenance */
const MAINTENANCE_REMISE = false;

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function MaintenanceRemiseScreen() {
  return (
    <div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center px-6 py-10 overflow-y-auto min-h-screen"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.4), transparent), linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.02) 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      {/* Effet grain / texture légère */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="relative z-10 flex flex-col items-center animate-fade-in opacity-0"
        style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
      >
        <div className="logo-round overflow-hidden h-20 w-20 sm:h-24 sm:w-24 shrink-0 flex items-center justify-center rounded-full border border-white/20 bg-white/5 animate-float shadow-[0_0_30px_rgba(255,255,255,0.08)] mb-6">
          <img
            src="/rebellion-luxury-logo.png"
            alt="Rebellion Luxury"
            className="w-full h-full object-contain animate-pulse-glow"
          />
        </div>
        <span className="font-luxury text-xl sm:text-2xl font-semibold tracking-[0.28em] text-white uppercase mb-1">
          Rebellion
        </span>
        <span className="font-luxury text-lg sm:text-xl font-medium tracking-[0.18em] text-white/90 uppercase mb-6">
          Luxury
        </span>
      </div>
      <h1
        className="relative z-10 font-luxury text-2xl sm:text-3xl font-semibold text-white text-center mb-6 tracking-[0.08em] animate-fade-in opacity-0 max-w-lg"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        Le site est prêt.
      </h1>
      <p
        className="relative z-10 text-white/70 max-w-md text-center text-sm sm:text-base mb-4 animate-fade-in opacity-0"
        style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
      >
        Le site se compose à nouveau d’une IA 2x plus compétente, avec des interfaces haut de gamme et un style 3x plus prestigieux. Beaucoup de travail sur la présentation et les références pour amener la clientèle a été mis sur le site par notre équipe.
      </p>
      <p
        className="relative z-10 text-white/60 max-w-md text-center text-sm sm:text-base mb-8 animate-fade-in opacity-0"
        style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
      >
        Le site ne s’ouvrira pas tant qu’il n’y a pas de réponse de Rebellion Luxury.
      </p>
      <a
        href="tel:+33669081072"
        className="relative z-10 text-amber-400 hover:text-amber-300 text-xl font-medium tracking-wide transition-colors animate-fade-in opacity-0"
        style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
      >
        07 69 08 10 72
      </a>
    </div>
  );
}

const queryClient = new QueryClient();

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message: string }> {
  state = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            color: "#e5e5e5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Une erreur s&apos;est produite</h1>
          <p style={{ color: "#a3a3a3", marginBottom: 16, maxWidth: 400 }}>{this.state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { phase, setPhase, isIdentified, loadedFromStorage } = useUser();
  const [justFinishedTransition, setJustFinishedTransition] = useState(false);

  if (!isIdentified || phase === "identification") {
    return <IdentificationScreen key="identification" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "transition" && (
          <TransitionScreen
            key="transition"
            onComplete={() => {
              setPhase("app");
              setJustFinishedTransition(true);
            }}
            isReturning={loadedFromStorage}
          />
        )}
      </AnimatePresence>
      {phase === "app" && (
    <LanguageProvider>
      <CurrencyProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="admin/*"
          element={
            <AdminAuthProvider>
              <Suspense fallback={null}>
                <AdminDashboard />
              </Suspense>
            </AdminAuthProvider>
          }
        />
        <Route path="espace-pro" element={<EspacePro />} />
        <Route element={<SiteLayout justFinishedTransition={justFinishedTransition} />}>
          <Route index element={<Index />} />
          <Route path="vehicules" element={<Vehicules />} />
          <Route path="vehicules/:slug" element={<VehiculeDetail />} />
          <Route path="rentabilite" element={<Rentabilite />} />
          <Route path="a-propos" element={<APropos />} />
          <Route path="reseaux" element={<Reseaux />} />
          <Route path="transport" element={<Transport />} />
          <Route path="loue-ton-vehicule" element={<LoueTonVehicule />} />
          <Route path="verifier-ma-demande" element={<VerifierMaDemande />} />
          <Route path="calculer-prix" element={<CalculerPrix />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
      </CurrencyProvider>
      </LanguageProvider>
      )}
    </>
  );
}

const App = () => {
  if (MAINTENANCE_REMISE) {
    return <MaintenanceRemiseScreen />;
  }
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <UserProvider>
            <ProAuthProvider>
              <VehicleRequestsProvider>
                <ReservationProvider>
                  <AppContent />
                  <CookieConsent />
                </ReservationProvider>
              </VehicleRequestsProvider>
            </ProAuthProvider>
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};

export default App;
