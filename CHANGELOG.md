# Journal des modifications

Toutes les évolutions notables de ce projet sont consignées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et le projet suit le [versionnage sémantique](https://semver.org/lang/fr/).

## [2.2.0] — 2026-07-02

Renforcement de la qualité et de la robustesse : couverture de tests mesurée en
CI, audits d'accessibilité (unitaires et automatisés) et de performance web,
garde-fous de saisie, et validation e-mail durcie. Alignement des patterns
transverses sur le socle NodeTemplate.

### Ajouté

- **Couverture de tests en CI** : `npm run test:cov` (reporters `text` /
  `text-summary` / `json-summary` / `lcov`) avec **seuils** (`vite.config.ts` :
  lignes/instructions/fonctions 80 %, branches 75 %). La CI publie un **résumé de
  couverture** et un **artefact** `coverage/`.
- **Tests d'accessibilité unitaires** (`*.a11y.test.tsx` + helper partagé
  `src/test/a11y.tsx`) pour `Section`, `ThemeToggle`, `LanguageSwitcher` et
  `ThemeSelector` : rôles / noms accessibles, ARIA d'état, classe `dark` /
  `data-theme`, persistance `localStorage` et navigation clavier.
- **Accessibilité automatisée e2e** : intégration d'**axe-core**
  (`@axe-core/playwright`) au smoke Playwright — échec sur les violations WCAG 2.x
  A/AA `serious`/`critical` (clair **et** sombre, aperçu QR inclus).
- **Lighthouse CI** : `@lhci/cli` + `lighthouserc.json` (accessibilité **bloquante**
  ≥ 0.9, performance / best-practices / SEO en avertissement) et workflow
  `.github/workflows/lighthouse.yml`.
- **Tests unitaires de `QrPreview`** (jusque-là non testé) en **mockant
  `qr-code-styling`** : rendu réussi, échec d'encodage (message affiché), copie
  presse-papier (API Clipboard **et** repli « clic droit »), export PNG.
- **Garde-fous de saisie** (module pur `src/lib/limits.ts`, testé) :
  - **longueur du contenu** — au-delà de la capacité d'un QR (fonction du niveau de
    correction), un message i18n clair remplace l'erreur brute du moteur ;
  - **poids du logo importé** — au-delà de 1 Mo, l'import est refusé avec un message
    explicite au lieu d'alourdir le QR.
- **Guide d'extension** « Ajouter un type de QR » (pas à pas) dans `AGENTS.md`.
- **Cas de tests Unicode / emoji** pour les builders (vCard, URL/IDN, WiFi, SMS,
  Email) : préservation des caractères non-ASCII et échappements corrects.

### Modifié

- **Validation e-mail durcie** : la regex acceptait `x@x.x`. Elle exige désormais un
  domaine d'au moins deux étiquettes non vides et une extension ≥ 2 caractères
  (choix **pragmatique**, non RFC 5322 complet ; les domaines internationalisés /
  IDN restent acceptés). Tests ajoutés.

### Dépendances

- Ajout des dépendances de développement `@axe-core/playwright` et `@lhci/cli`.

## [2.1.1] — 2026-07-01

Version d'outillage et de documentation : hooks Git versionnés, normalisation des
fins de ligne et migration de la documentation agents. Aucun changement fonctionnel.

### Ajouté

- **Hooks Git versionnés** (`.githooks/`, activés automatiquement par le script npm
  `prepare` à chaque `npm install`) : `commit-msg` (sujet conforme Conventional
  Commits), `pre-commit` (`npm run check`) et `pre-push` (`test:e2e` +
  `build-storybook`, parité CI).

### Modifié

- **Fins de ligne normalisées en LF** via `.gitattributes` (`eol=lf`).
- **Documentation agents migrée vers `AGENTS.md`** (ex-`CLAUDE.md`) ; `CLAUDE.md` et
  `.github/copilot-instructions.md` ne sont plus que des renvois vers `AGENTS.md`.
  Ajout de références Claude Code et du garde-fou `--no-verify`.

### Dépendances

- Nettoyage du `package-lock.json` (déduplication de `tailwindcss`) et montées de
  version de développement (dependabot).

## [2.1.0] — 2026-06-26

Thème choisi au runtime (et décliné clair/sombre pour les quatre identités),
application installable hors-ligne (PWA), aperçu de partage (Open Graph) et
plusieurs améliorations d'accessibilité.

### Ajouté

- **Choix du thème au runtime** via un menu déroulant dans l'en-tête (`ThemeSelector`),
  en remplacement de la variable de build `VITE_THEME`. Le choix est persisté
  (clé localStorage `theme-name`) et appliqué avant le rendu (anti-flash).
- **Variantes claire ET sombre pour les quatre thèmes** (`default`, `atelier`,
  `blueprint`, `aurora`) : les huit combinaisons identité × mode sont désormais
  valides. La bascule clair/sombre est toujours disponible (auparavant limitée au
  thème `default`).
- **PWA** : `manifest.webmanifest` + icône maskable + `apple-touch-icon.png` (180×180,
  pour iOS) + service worker (`public/sw.js`) sans dépendance. L'application est
  **installable** et **fonctionne hors-ligne** après la première visite (app shell en
  cache, stratégie « stale-while-revalidate »).
- **Aperçu de partage de lien (SEO)** : balises **Open Graph** et **Twitter Card**,
  `theme-color`, et une image d'aperçu `public/og-image.png` (1200×630).
- **Image d'aperçu source** `public/og-image.svg` (versionnable).
- **Storybook** : pages **Design / Thèmes** (aperçu des tokens, à combiner avec les
  menus « Thème » et « Mode » de la barre d'outils) et **Design / Couleurs**
  (référence des **tokens sémantiques** — surfaces, accent, états — et des **6
  palettes de couleur du QR**) ; stories pour des briques jusque-là absentes :
  `Section`, `Hint`, `QrCustomizer` (couleurs / formes), `LanguageSwitcher`,
  `ThemeSelector`, `LogoControls` et `QrOutputControls`.

### Modifié

- **Sélecteur de type** (`TypeSelector`) : navigation clavier conforme au motif
  ARIA « tabs » (flèches ←/→/↑/↓, Début/Fin, « roving tabindex ») et libellé du
  `tablist` internationalisé.
- **Bulle d'aide** (`Hint`) : le texte est relié au bouton « ? » par
  `aria-describedby` (annoncé par les lecteurs d'écran) et la bulle se ferme avec
  Échap (WCAG 1.4.13).

### Accessibilité (audit RGAA)

- **Repère `<main>`** + **lien d'évitement** « Aller au contenu » (RGAA 9.2, 12.7).
- **Sélecteur de type** : passage du motif ARIA « tabs » (incomplet, sans panneaux)
  au motif **`radiogroup` / `radio` + `aria-checked`**, plus fidèle à une sélection
  unique (RGAA 7.1).
- **Hiérarchie de titres** : les en-têtes de `Section` portent de vrais niveaux
  (`h2`/`h3`) ; Couleur/Forme/Logo passent en `h3` sous « Personnalisation » (RGAA 9.1).
- **Regroupement des champs** WiFi / vCard / Email / SMS / Géo dans un `<fieldset>`
  avec `<legend>` (RGAA 11.5).
- **Focus clavier** toujours perceptible : indicateur global basé sur `accent-strong`
  (l'accent jaune de Blueprint était invisible sur blanc) ; idem pour l'anneau de
  sélection des palettes (RGAA 10.7 / 3.3).
- **Contrastes (RGAA 3.2/3.3)** : couleurs d'état tokenisées (`--color-danger` /
  `--color-warning`, déclinées clair/sombre) en remplacement des `text-red/amber-*`
  trop clairs ; ajustement de `fg-muted` et des accents là où le ratio AA (4.5:1)
  n'était pas atteint. Les 8 combinaisons thème × mode respectent désormais AA pour
  le texte et les indicateurs.
- **Confirmation de copie** annoncée via une région `aria-live` ; **nom accessible
  du QR** enrichi du type de contenu (sans divulguer les valeurs sensibles).
- **Copie dans le presse-papier** rendue compatible Safari (construction
  synchrone du `ClipboardItem` avec une promesse de blob) et **Firefox / anciens
  navigateurs** (repli : message « clic droit → Copier l'image » au lieu d'un
  échec silencieux).
- **Système de thèmes** (`theme.ts`, `useTheme`) refondu autour de deux axes
  indépendants (identité + mode), tous deux persistés.

### Corrigé

- L'aperçu du QR (`<canvas>`) n'avait pas de **nom accessible** : ajout de
  `role="img"` + `aria-label` (clé i18n `preview.alt`, jusque-là inutilisée).
- **Storybook — bascule clair/sombre inopérante** : les deux décorateurs de
  `@storybook/addon-themes` (`withThemeByClassName` / `withThemeByDataAttribute`)
  écrivaient dans le même global `theme` (collision : un seul menu actif) et ne
  posaient pas forcément `data-theme` et `.dark` sur le même élément. Remplacés par
  deux globals indépendants (« Thème » + « Mode ») appliqués au `<html>` de
  l'iframe, comme `useTheme` en production.
- **Liste déroulante du sélecteur de thème illisible** sur les thèmes « verre »
  (aurora) : les `<option>` héritaient du fond translucide du `<select>` (texte
  clair sur fond clair). Fond désormais opaque (`--color-canvas`).

### Supprimé

- Sélection du thème au build via `VITE_THEME` (et la déclaration de type associée
  dans `vite-env.d.ts`), remplacée par le choix au runtime.
- Dépendance de dev `@storybook/addon-themes`, devenue inutile (thèmes gérés par des
  globals personnalisés dans `preview.tsx`).

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
