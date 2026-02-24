# API Auth Rebellion Luxury

Serveur minimal pour l’authentification (session persistante, refresh token).

## Démarrer

```bash
# À la racine du projet
cd server && npm install && npm run dev
```

Ou depuis la racine : `npm run dev:api` (après `cd server && npm install` une fois).

En parallèle, lancer le frontend : `npm run dev`. Le proxy Vite envoie `/api` vers `http://localhost:3001`.

## Routes

- `POST /api/auth/login` — Body: `{ email, password, rememberMe }`. Cookie HTTP-only `rebellion_refresh` + JWT access token.
- `POST /api/auth/refresh` — Renouvelle l’access token (cookie envoyé automatiquement). Rotation du refresh token.
- `POST /api/auth/logout` — Supprime le cookie et invalide le refresh token courant.
- `POST /api/auth/logout-all` — Invalide tous les refresh tokens de l’utilisateur (déconnexion sur tous les appareils).

## Variables d’environnement

- `PORT` — Port du serveur (défaut 3001).
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Identifiants admin.
- `JWT_SECRET` — Secret pour signer les access tokens (à changer en production).
- `FRONT_ORIGIN` — Origine CORS (défaut http://localhost:5173).
- `NODE_ENV=production` — Active les cookies `Secure` et CORS strict.

## Cookies

- `rebellion_refresh` : HTTP-only, Secure en production, SameSite=Lax. Durée 90 jours si « Maintenir la connexion », 24 h sinon.

## Test E2E manuel

1. Démarrer l’API : `npm run dev:api` (depuis la racine, après `cd server && npm install`).
2. Démarrer le frontend : `npm run dev`.
3. Ouvrir http://localhost:5173/admin, se connecter avec les identifiants admin en cochant « Maintenir la connexion ».
4. Fermer l’onglet ou le navigateur, rouvrir http://localhost:5173/admin → vous devez rester connecté (reconnexion silencieuse via cookie + refresh).
5. Paramètres → « Déconnexion sur tous les appareils » invalide tous les refresh tokens.
