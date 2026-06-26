# Journal des modifications

Toutes les évolutions notables de ce projet sont consignées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et le projet suit le [versionnage sémantique](https://semver.org/lang/fr/).

## [2.0.0] — 2026-06-26

Refonte de l'interface, personnalisation avancée du QR, système de thèmes et
remise à niveau complète des dépendances (et de l'environnement Node).

### Ajouté

- **Nouvelle interface en deux colonnes** (inspirée des générateurs en ligne) : à
  gauche des sections dépliables **Contenu**, **Personnalisation** (Couleur, Forme,
  Logo) et **Réglages avancés** ; à droite l'aperçu, la taille et les
  téléchargements (composants `Section`, `QrCustomizer`, `LogoControls`,
  `QrOutputControls`, `Hint`).
- **Personnalisation des couleurs** : 6 palettes prêtes à l'emploi + sélecteurs de
  couleur pour les modules et le fond.
- **Forme des modules** : carré, points, arrondi.
- **Logo au centre** : import d'une image (lue en **data URL**, tout reste dans le
  navigateur) incrustée au centre du QR ; les modules sous le logo sont masqués et
  la correction d'erreur passe automatiquement en « Maximale (H) » pour préserver
  la lisibilité.
- **Niveau de correction d'erreur** (L / M / Q / H) exposé dans l'UI, avec une
  bulle d'aide explicative.
- **Densité (version du QR)** : automatique (recommandée) ou forcée (1 à 40), avec
  bulle d'aide ; signalement d'erreur si la version forcée est trop basse pour les
  données.
- **Taille de l'image** exportée réglable (128 à 2048 px).
- **Copie du QR dans le presse-papier** (en plus des exports PNG / SVG).
- **Garde-fou de lisibilité** : avertissement lorsque le contraste des couleurs
  choisies risque de rendre le QR illisible (nouveau module pur `lib/contrast.ts`).
- **Validation des champs** par type (URL, email, latitude / longitude) avec
  messages d'erreur affichés sous chaque champ et `aria-invalid`.
- **Système de thèmes choisis au build** via la variable d'environnement
  `VITE_THEME` (`default`, `atelier`, `blueprint`, `aurora`), reposant sur des
  design tokens (variables CSS). Le mode clair/sombre ne s'applique qu'au thème
  `default`. Les quatre thèmes sont prévisualisables dans Storybook.

### Modifié

- **Moteur d'encodage** migré de `qrcode` vers `qr-code-styling` (adaptateur
  `lib/qr.ts`) — ce qui débloque les formes et la personnalisation. L'aperçu reste
  rendu en `<canvas>` afin de conserver le clic droit « Copier l'image ».
- **Style** refondu autour de design tokens (variables CSS) exposés à Tailwind ;
  les variantes `dark:` sont remplacées par des tokens qui changent selon le thème.
- **Bascule clair/sombre synchronisée** : les transitions sont coupées le temps du
  basculement pour éviter l'effet de désynchronisation fond / boutons.
- **i18n** (fr / en) complétée pour toutes les nouvelles chaînes.

### Corrigé

- Les sélecteurs de couleur pouvaient produire un QR illisible (contraste trop
  faible ou « négatif ») sans aucun avertissement.
- Bouton d'aide « ? » mal centré verticalement.
- Bulle d'aide tronquée par l'`overflow-hidden` des cartes de section.
- Suite de tests inopérante sous jsdom faute de `localStorage` (polyfill ajouté
  dans `src/test/setup.ts`).

### Supprimé

- Script npm `watch` (redondant avec `dev`).
- Dépendance runtime `qrcode` (remplacée par `qr-code-styling`).
- `autoprefixer` et `tailwind.config.js` (Tailwind v4 : configuration CSS-first via
  `@theme inline` dans `src/index.css`).

### Outillage et dépendances

- Mises à jour majeures : **React 19**, **TypeScript 6**, **Vite 8** (moteur
  Rolldown), **Vitest 4**, **ESLint 10**, **Storybook 10**, **Tailwind CSS 4**,
  `jsdom` 29, `eslint-plugin-react-hooks` 7, `globals` 17, et leurs satellites.
- Ajout de `@types/node`, `@tailwindcss/postcss`.
- **Node 26** : CI, déploiement et environnement de dev (`.nvmrc`, champ `engines`)
  passés de Node 24 à Node 26.
- Tests e2e (`tests/qr.spec.ts`) fiabilisés face au rendu asynchrone du `<canvas>`
  de `qr-code-styling` (attente de l'élément `canvas` plutôt que de son conteneur).

## [1.0.0] — 2026-06-25

Première version : générateur de QR codes **statique**, fonctionnant entièrement
dans le navigateur (aucune donnée envoyée à un serveur), prévu pour GitHub Pages.

### Ajouté

- Génération de QR pour **8 types de contenu** : Texte, URL, WiFi, Email, SMS,
  Téléphone, vCard, Géo (couche `lib/payloads`, patterns Registry + Strategy).
- Interface **bilingue (fr / en)**, i18n maison sans dépendance externe.
- Thème **clair / sombre** (`useTheme`, classe `dark`, anti-flash).
- **Aperçu** en `<canvas>` et **export PNG / SVG**, avec choix des couleurs.
- Architecture en couches testable : adaptateur d'encodage (`lib/qr.ts`),
  formulaire dynamique généré depuis le registre des types.
- Tests **unitaires / composants** (Vitest + Testing Library), **e2e**
  (Playwright) et documentation **Storybook**.
- Qualité (ESLint + Prettier) et **CI/CD** (GitHub Actions) avec déploiement
  automatique sur GitHub Pages.

> Correspond aux commits initiaux : `Initial commit`, `Initial QR Code Generator app`
> puis `Bump Node.js version to 24 in workflows`.
