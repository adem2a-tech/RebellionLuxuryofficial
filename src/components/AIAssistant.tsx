import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Car, Instagram, Calculator } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { IoLogoWhatsapp } from "react-icons/io5";
import { useUser } from "@/contexts/UserContext";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "./ui/button";
import { CONTACT, VEHICLES, CONDITIONS, BOBOLOC_AVAILABILITY_URLS, SITE_INFO } from "@/data/chatKnowledge";
import {
  calculatePriceFromSite,
  calculateTotalPrice,
  calculateTransportPrice,
  findVehicleByQuery,
  parsePriceQuery,
} from "@/utils/priceCalculation";

const RESERVATION_DOCS = [
  "Carte d'identité",
  "Permis de conduire",
  "Justificatif de domicile",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  initialMessage?: string;
}

// Suggestions rapides au clic sur Chat IA
const quickSuggestions = [
  { icon: Car, label: "Louez McLaren", message: "Je veux louer la McLaren 570S" },
  { icon: Car, label: "Louez R8 V8", message: "Je veux louer l'Audi R8 V8" },
  { icon: Calculator, label: "Calculez le prix", message: "Combien pour 2 jours avec l'Audi ?" },
  { icon: Car, label: "Info McLaren", message: "Donnez-moi les infos sur la McLaren" },
  { icon: Car, label: "Info R8", message: "Donnez-moi les infos sur l'Audi R8" },
  { icon: MessageCircle, label: "Contact WhatsApp", message: "Je veux vous contacter par WhatsApp" },
  { icon: Instagram, label: "Contact Instagram", message: "Je veux vous suivre sur Instagram" },
  { icon: Car, label: "Où êtes-vous ?", message: "Où êtes-vous situés ?" },
  { icon: Calculator, label: "Transport", message: "Combien coûte le transport à Lausanne ?" },
  { icon: MessageCircle, label: "Loue ton véhicule", message: "Comment rentabiliser mon véhicule ?" },
];

const whatsappCta = () =>
  `\n\n📱 **Pour louer :** contactez-nous sur **WhatsApp** au **${CONTACT.phone}** — nous répondons rapidement pour finaliser votre réservation !`;

// Suggestions 1-clic quand l'IA ne peut pas répondre
const FALLBACK_SUGGESTIONS = [
  "Quels sont les tarifs ?",
  "Calculez le prix pour 2 jours Audi",
  "Infos sur la McLaren 570S",
  "Infos sur l'Audi R8",
  "Comment réserver ?",
  "Quelles sont les disponibilités ?",
  "Contact WhatsApp",
];

// Réponses IA basées sur les données du site (chatKnowledge)
const sendMessageToAI = async (
  messages: { role: string; content: string }[],
  vehicleName?: string | null
): Promise<{ content: string; suggestions?: string[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const lastMessage = messages[messages.length - 1].content.toLowerCase().trim();
  const lm = lastMessage;

  // Salutations — répondre de manière naturelle
  if (/^(bonjour|salut|coucou|hello|hey|bonsoir|bonne soirée)[\s!.]*$/i.test(lm) || lm === "bjr" || lm === "yo") {
    return {
      content: `Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ? Je connais tout le site sur le bout des doigts — véhicules, tarifs, réservations, transport... Posez-moi vos questions !`,
    };
  }

  // Remerciements
  if (/^(merci|merci beaucoup|super|parfait|ok|d'accord|très bien)[\s!.]*$/i.test(lm) || lm === "thx") {
    return { content: `Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Bonne journée !` };
  }

  // Au revoir
  if (/^(au revoir|a bientôt|bye|à bientôt|bonne journée|ciao)[\s!.]*$/i.test(lm)) {
    return { content: `Au revoir ! À bientôt sur Rebellion Luxury. 🏎️` };
  }

  // Comment ça va
  if (/^(comment ça va|ça va\??|comment vas-tu|comment allez-vous)[\s!.]*$/i.test(lm)) {
    return { content: `Très bien, merci ! 😊 Je suis là pour vous aider. Posez-moi vos questions sur nos véhicules, les tarifs ou les réservations !` };
  }

  // Qui es-tu / que peux-tu faire / aide
  if (
    lm.includes("qui es-tu") ||
    lm.includes("qui es tu") ||
    lm.includes("que peux-tu") ||
    /^(aide|help|\?|aider moi)[\s!.]*$/i.test(lm)
  ) {
    return {
      content: `Je suis **Rebellion IA**, votre assistant. Je connais tout le site sur le bout des doigts ! Je peux vous renseigner sur : véhicules (Audi R8, McLaren 570S), tarifs, réservations, disponibilités, transport, conditions. Posez-moi vos questions !`,
    };
  }

  // PRIORITÉ : Calcul prix avec forfaits réels — avant tout bloc "Louer"
  const parsed = parsePriceQuery(messages[messages.length - 1].content);
  const hasVehicle = parsed.vehicleQuery || lm.includes("audi") || lm.includes("r8") || lm.includes("mclaren") || lm.includes("570");
  const hasPriceIntent = parsed.days !== undefined || parsed.durationKey || parsed.requestedKm !== undefined || parsed.extraKm !== undefined || /combien|prix|tarif|coût|cout|estimation/.test(lm);
  if (hasVehicle && hasPriceIntent) {
    const vFromContext = vehicleName ? findVehicleByQuery(vehicleName) : null;
    const vFromMsg = parsed.vehicleQuery ? findVehicleByQuery(parsed.vehicleQuery) : findVehicleByQuery(lm);
    const vehicleSlug = vFromContext?.slug ?? vFromMsg?.slug;
    const durationInput = parsed.durationKey ?? parsed.days ?? 1;
    const requestedKm = parsed.requestedKm ?? 0;
    const extraKm = parsed.extraKm ?? 0;
    const transportKm = parsed.transportKm ?? 0;
    const daysLabel = parsed.days ? `${parsed.days} jour${parsed.days > 1 ? "s" : ""}` : (parsed.durationKey || "1 jour");
    if (vehicleSlug) {
      const result = extraKm > 0
        ? calculatePriceFromSite(vehicleSlug, durationInput, extraKm, transportKm, true)
        : calculatePriceFromSite(vehicleSlug, durationInput, requestedKm, transportKm, false);
      if (result) {
        let text = `💰 **Prix pour ${result.vehicleName}** — ${result.forfaitLabel} (${daysLabel})\n\n`;
        text += `• **Location** : **${result.locationPrice} CHF** (${result.kmInclus} km inclus)\n`;
        if (result.extraKm > 0) text += `• **Km supplémentaires** (${result.extraKm} km) : ~${result.extraKmPrice} CHF\n`;
        if (result.transportKm > 0) text += `• **Transport** (${result.transportKm} km) : ${result.transportPrice} CHF\n`;
        text += `\n**Total : ${result.total} CHF**\n\n🔒 Caution : ${result.caution}`;
        return { content: text + whatsappCta() };
      }
    }
  }

  // Contexte véhicule : utilisateur veut louer → on envoie le formulaire réservation (CI, permis, justificatif)
  const wantsToRent =
    lm.includes("louer") ||
    lm.includes("louez") ||
    lm.includes("réserver") ||
    lm.includes("reserver") ||
    (lm.includes("oui") && (lm.includes("louer") || lm.includes("réserver"))) ||
    (lm.includes("souhaite") && (lm.includes("louer") || lm.includes("réserver"))) ||
    (lm.includes("comment") && (lm.includes("faire") || lm.includes("réserver")));

  if (vehicleName && wantsToRent) {
    const list = RESERVATION_DOCS.map((d) => `• **${d}**`).join("\n");
    return { content: `📋 **Formulaire pour réserver le véhicule**\n\nVoici ce dont nous avons besoin :\n\n${list}\n\nUne fois tout rempli, **une personne vous contactera par WhatsApp ou par téléphone** pour confirmer votre réservation.\n\n📱 Envoyez-nous vos documents sur **WhatsApp** au **${CONTACT.phone}** ou cliquez sur le bouton vert en bas pour nous joindre.` };
  }

  // Louer McLaren
  if (
    (lm.includes("louer") || lm.includes("louez")) &&
    (lm.includes("mclaren") || lm.includes("570"))
  ) {
    const v = VEHICLES[1];
    return { content: `📱 **Pour louer la McLaren 570S**, contactez-nous sur **WhatsApp** au **${CONTACT.phone}**.\n\nNous vérifions les dispos, les tarifs (dès **${v.pricePerDay} CHF**/jour) et finalisons votre réservation. À très vite ! 🏎️` + whatsappCta() };
  }

  // Louer R8
  if (
    (lm.includes("louer") || lm.includes("louez")) &&
    (lm.includes("r8") || lm.includes("audi"))
  ) {
    const v = VEHICLES[0];
    return { content: `📱 **Pour louer l'Audi R8 V8**, contactez-nous sur **WhatsApp** au **${CONTACT.phone}**.\n\nNous vérifions les dispos, les tarifs (dès **${v.pricePerDay} CHF**/jour) et finalisons votre réservation. À très vite ! 🏎️` + whatsappCta() };
  }

  // Louer / réserver (général)
  if (wantsToRent) {
    return { content: `📱 **Pour louer de suite**, contactez-nous sur **WhatsApp** au **${CONTACT.phone}**.\n\nNous vérifions les disponibilités, les tarifs et finalisons votre réservation avec vous. À très vite ! 🏎️` + whatsappCta() };
  }

  // Contact WhatsApp
  if (lm.includes("whatsapp") || (lm.includes("contact") && lm.includes("whatsapp"))) {
    return { content: `📱 **Contact WhatsApp**\n\nEnvoyez-nous un message au **${CONTACT.phone}** ou cliquez sur le bouton vert « Contacter par WhatsApp » en bas du chat — nous répondons rapidement !` + whatsappCta() };
  }

  // Contact Instagram
  if (lm.includes("instagram")) {
    return { content: `📸 **Nous suivre sur Instagram**\n\nRetrouvez nos supercars et l'actualité Rebellion Luxury : ${CONTACT.instagramUrl}\n\n📱 **Pour réserver :** WhatsApp au **${CONTACT.phone}** — le plus simple pour finaliser une location !` + whatsappCta() };
  }

  // Info Audi R8
  if (lm.includes("audi") || lm.includes("r8")) {
    const v = VEHICLES[0];
    const pricing = v.pricing.map((p) => `- ${p.label}: **${p.price}** (${p.km})`).join("\n");
    return { content: `🏎️ **${v.name}** — ${v.description}\n\n• **Puissance:** ${v.specs.power}\n• **Transmission:** ${v.specs.transmission}\n• **Année:** ${v.specs.year}\n\n💰 **Tarifs:**\n${pricing}\n\n🔒 Caution: ${v.specs.caution}` + whatsappCta() };
  }

  // Info McLaren
  if (lm.includes("mclaren") || lm.includes("570")) {
    const v = VEHICLES[1];
    const pricing = v.pricing.map((p) => `- ${p.label}: **${p.price}** (${p.km})`).join("\n");
    return { content: `🦋 **${v.name}** — ${v.description}\n\n• **Puissance:** ${v.specs.power}\n• **Portes papillon** • **Année:** ${v.specs.year}\n\n💰 **Tarifs:**\n${pricing}\n\n🔒 Caution: ${v.specs.caution}` + whatsappCta() };
  }

  // Calcul de prix / estimation (véhicule + jours + km + transport)
  const asksPriceCalc =
    lm.includes("calcul") ||
    lm.includes("combien") ||
    lm.includes("estimation") ||
    lm.includes("prix pour") ||
    lm.includes("coût") ||
    lm.includes("cout ");
  if (asksPriceCalc) {
    const parsed = parsePriceQuery(messages[messages.length - 1].content);
    const vFromContext = vehicleName ? findVehicleByQuery(vehicleName) : null;
    const vFromMsg = parsed.vehicleQuery ? findVehicleByQuery(parsed.vehicleQuery) : null;
    const vehicleSlug = vFromContext?.slug ?? vFromMsg?.slug;
    const days = parsed.days ?? 1;
    const extraKm = parsed.extraKm ?? 0;
    const transportKm = parsed.transportKm ?? 0;

    if (vehicleSlug && days >= 1) {
      const breakdown = calculateTotalPrice(vehicleSlug, days, extraKm, transportKm);
      if (breakdown) {
        let text = `💰 **Estimation pour ${breakdown.vehicleName}** (${days} jour${days > 1 ? "s" : ""})\n\n`;
        text += `• **Location :** ${breakdown.locationPrice} CHF\n`;
        if (breakdown.extraKmPrice > 0) text += `• **Km supplémentaires** (${breakdown.extraKm} km) : ~${breakdown.extraKmPrice} CHF\n`;
        if (breakdown.transportPrice > 0) text += `• **Transport** (${breakdown.transportKm} km) : ${breakdown.transportPrice} CHF\n`;
        text += `\n**Total estimé :** ${breakdown.total} CHF\n\n🔒 Caution : ${breakdown.caution}`;
        return { content: text + whatsappCta() };
      }
    }

    if (transportKm > 0 && !vehicleSlug) {
      const transportPrice = calculateTransportPrice(transportKm);
      return {
        content: `🚚 **Transport uniquement** (${transportKm} km)\n\n• **Tarif :** 2 CHF/km\n• **Total transport :** ${transportPrice} CHF\n\nPour une estimation complète (location + transport), précisez le véhicule et la durée (ex. : "Prix pour 3 jours avec la McLaren et 80 km de transport").`,
      };
    }

    return {
      content: `💰 **Calcul du prix**\n\nPour une estimation, précisez : **véhicule** (Audi R8 ou McLaren 570S), **nombre de jours** et éventuellement **km supplémentaires** ou **km de transport**.\n\nEx. : "Combien pour 2 jours avec l'Audi et 50 km de transport ?"\n\n👉 Utilisez l'onglet **Calculez le prix** pour une estimation détaillée.`,
      suggestions: ["Calculez le prix pour 2 jours Audi", "Calculez le prix pour 3 jours McLaren", "Prix transport 100 km"],
    };
  }

  // Tarifs (liste simple)
  if (lm.includes("prix") || lm.includes("tarif")) {
    const lines = VEHICLES.map(
      (v) => `**${v.name}:** Journée ${v.pricePerDay} CHF • Week-end et plus sur demande`
    ).join("\n\n");
    return { content: `💰 **Nos tarifs (données du site):**\n\n${lines}\n\nTous les forfaits incluent un kilométrage défini. Détails complets sur l'onglet **Véhicules**.` + whatsappCta() };
  }

  // Disponibilités — redirection vers Boboloc (temps réel)
  const asksAvailability =
    lm.includes("disponib") ||
    lm.includes("dispo") ||
    lm.includes("libre") ||
    (lm.includes("date") && (lm.includes("réserver") || lm.includes("louer")));
  if (asksAvailability) {
    let vehicleFilter: string | null = vehicleName ?? null;
    if (!vehicleFilter) {
      const found = findVehicleByQuery(lm);
      if (found) vehicleFilter = found.name;
    }
    const entries = Object.entries(BOBOLOC_AVAILABILITY_URLS);
    const linksText =
      vehicleFilter && BOBOLOC_AVAILABILITY_URLS[vehicleFilter]
        ? `**${vehicleFilter}** — [Voir les disponibilités en temps réel](${BOBOLOC_AVAILABILITY_URLS[vehicleFilter]})`
        : entries
            .map(([name, url]) => `**${name}** — [Voir les disponibilités](${url})`)
            .join("\n\n");
    return {
      content: `📅 **Disponibilités en temps réel**\n\nNos disponibilités sont mises à jour sur **Boboloc**. Consultez le calendrier à jour en cliquant sur le lien du véhicule :\n\n${linksText}\n\nDès que Boboloc est modifié, les infos sont à jour. Pour réserver : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta(),
    };
  }

  // Flotte / véhicules / supercars
  if (lm.includes("véhicule") || lm.includes("vehicule") || lm.includes("flotte") || lm.includes("supercar") || lm.includes("voiture") || lm.includes("quels véhicules")) {
    const lines = VEHICLES.map(
      (v, i) => `${i + 1}️⃣ **${v.name}** — Dès ${v.pricePerDay} CHF/jour • ${v.description.slice(0, 50)}…`
    ).join("\n\n");
    return { content: `🚗 **Notre flotte:**\n\n${lines}\n\n+ **Catalogue des particuliers** (véhicules proposés par des propriétaires).\n\nBasés en **${CONTACT.location}**.` + whatsappCta() };
  }

  // Conditions
  if (lm.includes("condition") || lm.includes("requis")) {
    const list = CONDITIONS.map((c) => `✅ ${c}`).join("\n");
    return { content: `📋 **Conditions de location:**\n\n${list}` + whatsappCta() };
  }

  // Transport / livraison / Lausanne / Genève
  if (
    lm.includes("transport") ||
    lm.includes("livraison") ||
    lm.includes("livrer") ||
    lm.includes("domicile") ||
    lm.includes("lausanne") ||
    lm.includes("genève") ||
    lm.includes("geneve")
  ) {
    const cityHint = (lm.includes("lausanne") || lm.includes("genève") || lm.includes("geneve"))
      ? `\nNous livrons à **Lausanne**, **Genève** et partout en Suisse romande — tarif au km. `
      : "";
    return { content: `🚚 **Transport & livraison**\n\n• **Tarif :** ${SITE_INFO.transportPricePerKm} CHF / km\n• **Point A** — Evionnaz (siège Rebellion Luxury)\n• **Point B** — Livraison au client (votre adresse)\n• **Point C** — Retour à Evionnaz\n\nPrix = (A → B → C) × ${SITE_INFO.transportPricePerKm} CHF/km.${cityHint}\n\n• Location min. 24h — prix sur demande\n• Location min. 48h — offert si vous avez déjà loué chez nous\n• Acompte obligatoire\n\n📱 Estimation précise : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Localisation / où êtes-vous / Evionnaz / Valais
  if (
    (lm.includes("où") || lm.includes("ou")) && (lm.includes("êtes") || lm.includes("etes") || lm.includes("trouver") || lm.includes("situ") || lm.includes("sont")) ||
    lm.includes("localisation") || lm.includes("evionnaz") || lm.includes("valais") ||
    (lm.includes("adresse") && (lm.includes("siege") || lm.includes("siège")))
  ) {
    return { content: `📍 **Localisation**\n\nNous sommes basés à **${SITE_INFO.location}** (Valais), au cœur de la Suisse romande.\n\n• **Récupération du véhicule :** Evionnaz\n• **Zone de livraison :** Suisse romande (transport au km)\n• **Carte :** [Voir sur Google Maps](${CONTACT.googleMapsUrl})\n\nPour louer ou réserver : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Âge minimum / permis
  if (lm.includes("âge") || lm.includes("age") || lm.includes("ans") && (lm.includes("minimum") || lm.includes("avoir")) || lm.includes("permis") && lm.includes("année")) {
    return { content: `📋 **Conditions d'âge & permis**\n\n• **Âge minimum :** ${SITE_INFO.minAge} ans\n• **Permis de conduire :** valide, détenu depuis au moins ${SITE_INFO.minPermitYears} ans\n• **Documents requis :** pièce d'identité, permis, justificatif de domicile\n• **Caution :** par carte bancaire (Audi R8 : 3'000 CHF, McLaren 570S : 10'000 CHF)\n\n📱 Pour réserver : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Caution / garantie
  if (lm.includes("caution") || lm.includes("garantie") || lm.includes("dépôt") || lm.includes("depot")) {
    const cautions = VEHICLES.map((v) => `• **${v.name}** : ${v.specs.caution}`).join("\n");
    return { content: `🔒 **Caution**\n\n${cautions}\n\nLa caution est bloquée par carte bancaire. Elle est libérée à la restitution du véhicule dans l'état convenu.\n\n📱 Questions ? **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Km inclus / kilométrage
  if (lm.includes("km") && (lm.includes("inclus") || lm.includes("forfait") || lm.includes("kilom")) || lm.includes("kilometrage")) {
    const kmInfo = VEHICLES.map((v) => {
      const p = v.pricing[0];
      return `• **${v.name}** — Journée : ${p.km}, forfaits week-end/mois : plus de km inclus`;
    }).join("\n");
    return { content: `📏 **Kilométrage inclus**\n\n${kmInfo}\n\nAu-delà du forfait : 0,50 CHF/km. Détails complets sur la page **Véhicules** ou **Calculez le prix**.\n\n📱 Estimation sur mesure : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Loue ton véhicule / rentabiliser / particuliers
  if (
    lm.includes("loue ton") || lm.includes("louer mon") || lm.includes("rentabiliser") ||
    lm.includes("mettre en location") || lm.includes("particulier") || lm.includes("catalogue des particuliers") ||
    lm.includes("véhicule hors") || lm.includes("hors rebellion")
  ) {
    return { content: `🚗 **Loue ton véhicule**\n\nVous souhaitez **rentabiliser votre véhicule** ? Rebellion Luxury propose un service de conciergerie automobile premium :\n\n• Revenus passifs mensuels\n• Gestion complète (location, sinistres, nettoyage)\n• Shooting photo & vidéo offerts\n• Forte visibilité sur nos réseaux\n• Conditions : véhicule homologué, assuré, expertisé\n\n📋 **Comment procéder :**\n1. Remplissez le formulaire sur **Loue ton véhicule**\n2. Envoyez des photos de votre véhicule\n3. Nous vous recontactons par WhatsApp ou téléphone\n\n• Maximum 3 demandes par jour\n• Consultez vos demandes sur **Voir mes demandes**\n\n📱 **WhatsApp** : **${CONTACT.phone}**` + whatsappCta() };
  }

  // Contact email / téléphone
  if (lm.includes("email") || lm.includes("mail") || lm.includes("téléphone") || lm.includes("telephone") || lm.includes("joindre") || lm.includes("contacter")) {
    if (lm.includes("email") || lm.includes("mail")) {
      return { content: `📧 **Email**\n\n**${CONTACT.email}**\n\nPour une réponse rapide, privilégiez **WhatsApp** au **${CONTACT.phone}** — idéal pour les réservations !` + whatsappCta() };
    }
    if (lm.includes("téléphone") || lm.includes("telephone") || lm.includes("tél") || lm.includes("tel")) {
      return { content: `📞 **Téléphone**\n\n**${CONTACT.phone}**\n\nOu contactez-nous sur **WhatsApp** : c'est le plus simple pour réserver ! → ${CONTACT.whatsappUrl}` + whatsappCta() };
    }
    return { content: `📱 **Nous contacter**\n\n• **WhatsApp** (recommandé) : **${CONTACT.phone}**\n• **Téléphone** : ${CONTACT.phone}\n• **Email** : ${CONTACT.email}\n\nLe plus rapide pour réserver : **WhatsApp** !` + whatsappCta() };
  }

  // Facebook / TikTok
  if (lm.includes("facebook")) {
    return { content: `📘 **Facebook**\n\nSuivez-nous : ${CONTACT.facebookUrl}\n\n📱 Pour réserver : **WhatsApp** au **${CONTACT.phone}** — le plus direct !` + whatsappCta() };
  }
  if (lm.includes("tiktok")) {
    return { content: `🎵 **TikTok**\n\nRetrouvez-nous : ${CONTACT.tiktokUrl}\n\n📱 Pour réserver : **WhatsApp** au **${CONTACT.phone}** !` + whatsappCta() };
  }

  // À propos / qui êtes-vous / rebellion luxury
  if (
    lm.includes("à propos") || lm.includes("a propos") || lm.includes("qui êtes-vous") || lm.includes("c est quoi") ||
    lm.includes("rebellion luxury") || lm.includes("rebellion luxe") || lm.includes("présentation")
  ) {
    return { content: `🏎️ **Rebellion Luxury**\n\nEntreprise de **location de véhicules haut de gamme** en Valais, spécialisée en supercars et sportives.\n\n• **Flotte :** Audi R8, McLaren 570S (+ catalogue particuliers)\n• **Zone :** Suisse romande — siège à Evionnaz\n• **Services :** location, transport sur plateau, conciergerie (Loue ton véhicule)\n• **Assurance & entretien** inclus, qualité premium\n\nPage complète : **À propos**` + whatsappCta() };
  }

  // Plan du site / pages / navigation
  if (lm.includes("plan du site") || lm.includes("pages") || lm.includes("navigation") || lm.includes("menu") && lm.includes("quoi")) {
    return { content: `🗺️ **Plan du site**\n\n• **Accueil** — Présentation\n• **Véhicules** — Catalogue + Catalogue des particuliers\n• **Calculez le prix** — Estimation tarifs\n• **Loue ton véhicule** — Rentabiliser votre voiture\n• **Voir mes demandes** — Suivi des demandes\n• **À propos** — Notre histoire, conditions\n• **Transport** — Livraison à domicile\n• **Réseaux** — Instagram, Facebook, TikTok\n• **Espace pro** — Gestion véhicules particuliers\n• **Contact** — Email, téléphone, WhatsApp\n\nQue souhaitez-vous savoir ?` };
  }

  // Calculez le prix (lien)
  if (lm.includes("calculez") || lm.includes("calculer") && lm.includes("prix") || lm.includes("simulateur")) {
    return { content: `💰 **Calculez le prix**\n\nUtilisez la page **Calculez le prix** pour une estimation détaillée : véhicule, durée, km supplémentaires, transport.\n\nOu posez-moi la question : ex. *"Combien pour 2 jours avec l'Audi et 50 km de transport ?"*` };
  }

  // Documents requis / quoi apporter
  if (lm.includes("document") || lm.includes("papier") || lm.includes("apporter") || lm.includes("fournir") || lm.includes("justificatif")) {
    const list = RESERVATION_DOCS.map((d) => `• **${d}**`).join("\n");
    return { content: `📋 **Documents pour réserver**\n\n${list}\n\nAcompte obligatoire. Caution par carte bancaire.\n\n📱 Envoyez vos documents sur **WhatsApp** au **${CONTACT.phone}** pour finaliser.` + whatsappCta() };
  }

  // Paiement / acompte
  if (lm.includes("paiement") || lm.includes("payer") || lm.includes("acompte") || lm.includes("carte bancaire")) {
    return { content: `💳 **Paiement**\n\n• **Acompte obligatoire** pour réserver le véhicule\n• **Caution** par carte bancaire (Audi : 3'000 CHF, McLaren : 10'000 CHF)\n• Détails des modalités lors de la réservation\n\n📱 **WhatsApp** au **${CONTACT.phone}** pour convenir des détails.` + whatsappCta() };
  }

  // Assurance
  if (lm.includes("assurance")) {
    return { content: `🛡️ **Assurance**\n\nTous nos véhicules sont **entièrement assurés**. Mécanique et entretien inclus pour une tranquillité d'esprit totale.\n\n📱 Questions spécifiques : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Suisse / étranger / frontière
  if (lm.includes("suisse") || lm.includes("étranger") || lm.includes("etranger") || lm.includes("frontière") || lm.includes("sortir")) {
    return { content: `🇨🇭 **Zone de circulation**\n\nLe véhicule doit **rester en Suisse** sauf accord préalable.\n\nNous sommes basés en **Suisse romande** (Evionnaz, Valais). Livraison possible partout en Suisse romande (transport au km).\n\n📱 Pour une exception (sortie Suisse) : contactez-nous au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Comparaison Audi vs McLaren
  if ((lm.includes("audi") || lm.includes("r8")) && (lm.includes("mclaren") || lm.includes("570")) && !lm.includes("louer")) {
    return { content: `⚖️ **Audi R8 vs McLaren 570S**\n\n**Audi R8 V8** — Dès 470 CHF/jour • 420 CH • Portes conventionnelles • Idéal week-end\n\n**McLaren 570S** — Dès 950 CHF/jour • 570 CH • Portes papillon • Supercar pure\n\nLes deux : transmission auto, caution (3k/10k CHF). Détails et tarifs complets sur **Véhicules**.\n\n📱 Pour choisir selon vos dates : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Vérifier ma demande / statut
  if (lm.includes("verifier") || lm.includes("vérifier") || lm.includes("demande") && (lm.includes("statut") || lm.includes("suivi")) || lm.includes("mes demandes")) {
    return { content: `📋 **Voir mes demandes**\n\nSi vous avez soumis une demande (Loue ton véhicule), consultez son statut sur la page **Vérifier ma demande**.\n\nVous serez notifié par téléphone ou WhatsApp lors du traitement (en attente, accepté, refusé).\n\n📱 Questions : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Espace pro
  if (lm.includes("espace pro")) {
    return { content: `👔 **Espace pro**\n\nL'Espace Pro permet aux propriétaires de véhicules (catalogue des particuliers) de gérer leurs annonces : fiche détaillée, tarifs, disponibilités, historique des demandes.\n\nAccès après acceptation de votre demande **Loue ton véhicule**.\n\n📱 **WhatsApp** : **${CONTACT.phone}**` + whatsappCta() };
  }

  // Rentabilité
  if (lm.includes("rentabilité") || lm.includes("rentabilite")) {
    return { content: `📈 **Rentabilité**\n\nConsultez la page **Rentabilité** pour une estimation des revenus potentiels de votre véhicule en location.\n\nRebellion Luxury propose une **estimation gratuite et sans engagement**.\n\n📱 Pour en savoir plus : **WhatsApp** au **${CONTACT.phone}**.` + whatsappCta() };
  }

  // Réseaux (général)
  if (lm.includes("réseaux") || lm.includes("reseaux") || lm.includes("suivre")) {
    return { content: `📱 **Nos réseaux**\n\n• **Instagram :** ${CONTACT.instagramUrl}\n• **Facebook :** ${CONTACT.facebookUrl}\n• **TikTok :** ${CONTACT.tiktokUrl}\n\nPour **réserver** : **WhatsApp** au **${CONTACT.phone}** — le plus rapide !` + whatsappCta() };
  }

  // Fallback intelligent — suggestions selon mots-clés détectés
  const suggestions: string[] = [];
  if (/audi|r8|mclaren|570|voiture|véhicule|auto/.test(lm)) suggestions.push("Infos sur l'Audi R8", "Infos sur la McLaren 570S", "Quels sont les tarifs ?");
  if (/prix|tarif|combien|coût|cout/.test(lm)) suggestions.push("Calculez le prix pour 2 jours Audi", "Calculez le prix pour 3 jours McLaren");
  if (/louer|réserver|reserver|location/.test(lm)) suggestions.push("Comment réserver ?", "Je veux louer la McLaren 570S", "Contact WhatsApp");
  if (/dispo|disponib|date|libre/.test(lm)) suggestions.push("Quelles sont les disponibilités ?");
  if (/contact|joindre|écrire|ecrire|appeler/.test(lm)) suggestions.push("Contact WhatsApp", "Je veux vous contacter par WhatsApp");
  if (suggestions.length === 0) suggestions.push(...FALLBACK_SUGGESTIONS);

  return {
    content: `Je n'ai pas trouvé de réponse précise à votre question. **Choisissez une suggestion ci-dessous** ou reformulez — je connais les véhicules, tarifs, réservations, transport, conditions, Loue ton véhicule et tout le reste du site !`,
    suggestions: [...new Set(suggestions)].slice(0, 6),
  };
};

const AIAssistant = ({ isOpen, onToggle, initialMessage }: AIAssistantProps) => {
  const isMobile = useIsMobile();
  const { user } = useUser();
  const { vehicleContext } = useChat();

  const welcomeContent = vehicleContext
    ? (user?.firstName
        ? `Bonjour **${user.firstName}**, vous avez cliqué sur la **${vehicleContext.vehicleName}**.\n\nJe connais tout le site sur le bout des doigts — posez-moi toutes les questions imaginables !`
        : `Bonjour, vous avez cliqué sur la **${vehicleContext.vehicleName}**.\n\nJe connais tout le site sur le bout des doigts — posez-moi toutes les questions imaginables !`)
    : user?.firstName
      ? `👋 Bienvenue, **${user.firstName}** ! Je suis **Rebellion IA**.\n\nJe connais tout le site sur le bout des doigts — posez-moi toutes les questions imaginables sur nos supercars, les tarifs, les réservations ou tout autre sujet !`
      : "👋 Bienvenue ! Je suis **Rebellion IA**.\n\nJe connais tout le site sur le bout des doigts — posez-moi toutes les questions imaginables sur nos supercars, les tarifs, les réservations ou tout autre sujet !";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeContent,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (vehicleContext) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: user?.firstName
            ? `Bonjour **${user.firstName}**, vous avez cliqué sur la **${vehicleContext.vehicleName}**.\n\nJe connais tout le site sur le bout des doigts — posez-moi toutes les questions imaginables !`
            : `Bonjour, vous avez cliqué sur la **${vehicleContext.vehicleName}**.\n\nJe connais tout le site sur le bout des doigts — posez-moi toutes les questions imaginables !`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [vehicleContext?.vehicleName]);

  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      aiMessages.push({ role: "user", content: userMessage.content });

      const result = await sendMessageToAI(aiMessages, vehicleContext?.vehicleName ?? null);
      const content = typeof result === "string" ? result : result.content;
      const suggestions = typeof result === "object" && "suggestions" in result ? result.suggestions : undefined;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        timestamp: new Date(),
        suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    handleSendMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickSuggestion = (message: string) => {
    handleSendMessage(message);
  };

  // Simple markdown-like rendering for bold text
  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Button + label Rebellion IA */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5 pb-[env(safe-area-inset-bottom)]"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              className="relative w-14 h-14 min-w-[56px] min-h-[56px] sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-white to-white/90 text-black flex items-center justify-center touch-manipulation border border-white/50 transition-shadow hover:shadow-xl hover:shadow-white/20"
              style={{
                boxShadow: "0 4px 24px rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.15) inset"
              }}
            >
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
            </motion.button>
            <motion.span
              className="label-rebellion-ia text-sm text-primary whitespace-nowrap"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              Rebellion IA
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window — plein écran sur mobile, fenêtre sur desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-50 flex flex-col overflow-hidden touch-manipulation
              sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[480px] sm:h-[min(700px,calc(100dvh-3rem))] sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl sm:glass-card
              inset-0 w-full h-[100dvh] rounded-none bg-background
            `}
            style={{
              boxShadow: isMobile ? "none" : "0 0 40px hsl(0 0% 100% / 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: isMobile ? "none" : "1px solid hsl(0 0% 100% / 0.2)"
            }}
          >
            {/* Header — safe area pour encoche */}
            <div className="flex items-center justify-between p-4 sm:p-5 pt-[max(1rem,env(safe-area-inset-top))] border-b border-border bg-gradient-to-r from-primary/20 via-primary/10 to-transparent shrink-0">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px hsl(0 0% 100% / 0.3)",
                      "0 0 40px hsl(0 0% 100% / 0.4)",
                      "0 0 20px hsl(0 0% 100% / 0.3)"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </motion.div>
                <div>
                  <h3 className="font-display text-xl font-bold">
                    <span className="text-gradient-orange">Rebellion</span> IA
                  </h3>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Connaît tout le site sur le bout des doigts
                  </span>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages — min-h-0 pour que le scroll fonctionne avec flex */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 overscroll-contain">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "bg-muted"
                        : "bg-primary"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-muted text-foreground rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {renderContent(message.content)}
                    </p>
                    {message.role === "assistant" && message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/40 flex flex-wrap gap-1">
                        {message.suggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleQuickSuggestion(s)}
                            className="px-2 py-1 rounded-md bg-muted/70 hover:bg-primary/15 border border-transparent hover:border-primary/30 text-[11px] font-medium transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <motion.span 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.span 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                      />
                      <motion.span 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input — text-base (16px) évite le zoom iOS au focus */}
            <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-border bg-card/50 shrink-0">
              {/* Suggestions : compactes, dans la zone input — masquées dès qu'on envoie un message */}
              {messages.length === 1 && !isLoading && (
                <div className="mb-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex gap-1.5 flex-nowrap">
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleQuickSuggestion(suggestion.message)}
                        className="shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/60 border border-border/80 hover:border-primary/40 hover:bg-primary/10 transition-all text-[11px] font-medium text-foreground/90"
                      >
                        <suggestion.icon className="w-3 h-3 text-primary shrink-0" />
                        <span className="whitespace-nowrap">{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez toute question..."
                  autoComplete="off"
                  className="flex-1 bg-muted rounded-xl px-4 py-3.5 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground touch-manipulation"
                />
                <Button
                  variant="hero"
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="h-[44px] min-h-[44px] w-12 rounded-xl touch-manipulation"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* WhatsApp toujours visible */}
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white font-medium text-sm transition-colors touch-manipulation"
                aria-label="Contacter par WhatsApp"
              >
                <IoLogoWhatsapp className="w-5 h-5 shrink-0" />
                Contacter par WhatsApp
              </a>

              <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                Propulsé par Rebellion IA
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
