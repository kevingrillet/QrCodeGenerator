# Générateur de QR code

Petit site **statique** qui génère des QR codes directement dans le navigateur — aucune
donnée n'est envoyée à un serveur. Conçu pour être hébergé gratuitement sur **GitHub
Pages**.

Types de contenu supportés : **Texte, URL, WiFi, Email, SMS, Téléphone, vCard, Géo**.
Interface **bilingue (fr / en)**, **personnalisation** du QR (couleurs + palettes, forme des
modules, **logo au centre**, correction d'erreur, **densité** — version auto ou forcée —,
taille d'export), **garde-fou de lisibilité** (contraste), export **PNG** / **SVG** et
**copie dans le presse-papier**.

Le **thème visuel** se choisit **au runtime** (menu déroulant) parmi quatre identités
(`default`, `atelier`, `blueprint`, `aurora`), chacune déclinée en variante **claire et
sombre** — voir [Thèmes](#thèmes). L'application est également une **PWA** : installable et
utilisable **hors-ligne**, avec un aperçu de partage de lien (**Open Graph**).

> 🔗 **Démo** : `https://kevingrillet.github.io/QrCodeGenerator/`

---

## Stack

| Rôle                         | Outil                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| Build / dev                  | [Vite](https://vitejs.dev/)                                                                       |
| UI                           | [React](https://react.dev/) + TypeScript                                                          |
| Style                        | [Tailwind CSS](https://tailwindcss.com/) v4 (config CSS-first, `@theme inline`)                   |
| Encodage QR                  | [`qr-code-styling`](https://www.npmjs.com/package/qr-code-styling) — **seule dépendance runtime** |
| Tests unitaires / composants | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)                   |
| Tests d'intégration / e2e    | [Playwright](https://playwright.dev/)                                                             |
| Documentation des composants | [Storybook](https://storybook.js.org/)                                                            |
| Qualité                      | ESLint + Prettier                                                                                 |
| CI/CD                        | GitHub Actions                                                                                    |

Les dépendances _runtime_ sont volontairement minimales : `react`, `react-dom`,
`qr-code-styling`. Tout le reste est en `devDependencies`.

---

## Démarrage rapide

```bash
npm install        # installe les dépendances
npm run dev        # lance le serveur de dev (http://localhost:5173)
```

Pour construire la version de production puis la prévisualiser :

```bash
npm run build
npm run preview    # http://localhost:4173
```

---

## Scripts npm

| Script                    | Rôle                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `npm run dev`             | Serveur de développement (rebuild + recharge à chaque sauvegarde) |
| `npm run build`           | Build de production (`tsc -b` + `vite build`)                     |
| `npm run preview`         | Prévisualise le build de production                               |
| `npm test`                | Tests unitaires / composants (Vitest)                             |
| `npm run test:watch`      | Tests en mode watch                                               |
| `npm run test:cov`        | Tests + rapport de couverture                                     |
| `npm run test:e2e`        | Tests d'intégration / e2e (Playwright)                            |
| `npm run test:e2e:ui`     | Tests e2e en mode UI Playwright (debug pas à pas)                 |
| `npm run lint`            | Lint (ESLint)                                                     |
| `npm run lint:fix`        | Lint + corrections automatiques                                   |
| `npm run format`          | Formatage (Prettier)                                              |
| `npm run format:check`    | Vérifie le formatage (utilisé en CI)                              |
| `npm run typecheck`       | Vérification des types TypeScript                                 |
| `npm run typecheck:watch` | Vérification des types en continu (watch)                         |
| `npm run storybook`       | Storybook en dev (http://localhost:6006)                          |
| `npm run build-storybook` | Build statique de Storybook                                       |
| `npm run check`           | Raccourci : format:check + lint + typecheck + test                |
| `npm run clean`           | Supprime `node_modules`, `dist`, rapports, caches…                |
| `npm run clean:dist`      | Comme `clean` mais conserve `node_modules`                        |

> ⚠️ Avant le premier `npm run test:e2e`, installez les navigateurs :
> `npx playwright install --with-deps chromium`.

---

## Comment ça marche

L'application est volontairement découpée en couches simples et testables.

### 1. Couche `payloads` — la logique métier (pattern _Strategy_ + _Registry_)

`src/lib/payloads/` contient une **fonction pure par type de contenu** qui transforme des
données en la chaîne réellement encodée dans le QR :

| Type      | Fichier    | Format produit                          |
| --------- | ---------- | --------------------------------------- |
| Texte     | `text.ts`  | le texte brut                           |
| URL       | `url.ts`   | `https://…` (schéma ajouté si absent)   |
| WiFi      | `wifi.ts`  | `WIFI:T:WPA;S:<ssid>;P:<pass>;H:true;;` |
| Email     | `email.ts` | `mailto:<addr>?subject=…&body=…`        |
| SMS       | `sms.ts`   | `SMSTO:<numéro>:<message>`              |
| Téléphone | `tel.ts`   | `tel:<numéro>`                          |
| vCard     | `vcard.ts` | vCard 3.0 (`BEGIN:VCARD … END:VCARD`)   |
| Géo       | `geo.ts`   | `geo:<lat>,<lng>`                       |

Ces fonctions gèrent l'**échappement** des caractères spéciaux (ex. `\ ; , : "` pour le
WiFi, `\ , ; \n` pour la vCard) et sont **100 % testées** sans React.

Le fichier `index.ts` est un **registre** : il associe chaque type à ses champs de
formulaire, ses valeurs par défaut et son builder. L'interface se génère entièrement à
partir de ce registre — **ajouter un type** = ajouter un builder + une entrée dans le
registre, sans toucher aux composants.

### 2. Couche `qr` — l'adaptateur d'encodage (pattern _Adapter_)

`src/lib/qr.ts` encapsule la librairie `qr-code-styling`. C'est le **seul** endroit qui en
dépend : il expose `toStylingOptions` (transformation **pure** de nos options vers celles de
la lib, testée unitairement), `createQr` (instance à `append`/`update` pour l'aperçu) et
`downloadQr` (export PNG / SVG). C'est ici que vivent les couleurs, la **forme des modules**
(carré / points / arrondi), le niveau de correction et la taille. Changer de moteur ne
toucherait que ce fichier. L'aperçu est rendu en `<canvas>` — le clic droit « Copier
l'image » du navigateur reste donc disponible.

Le module `src/lib/contrast.ts` (pur, testé) calcule le ratio de contraste WCAG entre les
couleurs choisies et avertit l'utilisateur si le QR risque d'être illisible.

### 3. Couche UI — React

- `TypeSelector` : sélection du type (motif ARIA `radiogroup`, navigation clavier) générée depuis le registre.
- `QrForm` : formulaire **dynamique** rendu d'après `type.fields`, avec validation par champ.
- `Section` : carte dépliable (accordéon) accessible structurant Contenu / Personnalisation.
- `QrCustomizer` : contrôles de **couleur** (palettes + pickers) et de **forme**.
- `LogoControls` : import d'un **logo** (image → data URL) incrusté au centre.
- `QrOutputControls` : **correction d'erreur**, **densité** (version auto ou forcée) et
  **taille** d'export — chacune avec une bulle d'aide (`Hint`).
- `QrPreview` : aperçu `<canvas>`, badge de lisibilité et téléchargements (PNG / SVG / copie).
- `ThemeSelector` + `ThemeToggle` + `useTheme` : choix de l'**identité visuelle** (menu) et
  du **mode clair/sombre** au runtime, deux axes indépendants persistés.
- `App` : assemble le tout et conserve les valeurs **par type** + le style du QR.

### Internationalisation (fr / en)

L'i18n est **maison, sans dépendance externe** (`src/i18n/`) :

- `messages.ts` contient les deux dictionnaires (`fr`, `en`). Une interface `Messages`
  garantit qu'ils ont **exactement la même structure** — impossible d'oublier une clé.
- `I18nProvider.tsx` expose un contexte React avec `lang`, `setLang` et `t(clé)` (clé en
  notation pointée, ex. `types.wifi.label`). La langue initiale vient de `localStorage`
  puis de la langue du navigateur ; le choix est persisté et met à jour `<html lang>`.
- Le composant `LanguageSwitcher` permet de basculer FR / EN.

Point de conception : le **registre des payloads ne contient aucune chaîne traduisible** —
seulement des **clés** (`labelKey`, `descriptionKey`, `placeholderKey`). Les textes vivent
uniquement dans les dictionnaires, ce qui garde la logique métier indépendante de la langue.

### Thèmes

Quatre **identités visuelles** sont disponibles, chacune décrite par un jeu de **design
tokens** (variables CSS : couleurs, rayons, ombres, épaisseur de bordure, police) dans
`src/index.css`. Un bloc `@theme inline` (Tailwind v4) expose ces variables sous forme de
couleurs sémantiques (`bg-surface`, `text-fg`, `bg-accent`, `border-line`…) : `inline` fait
que les utilitaires **référencent** les variables plutôt que d'en copier la valeur — ce qui
permet de changer de thème (et de mode clair/sombre) au runtime en ne touchant qu'aux
variables. Les composants n'utilisent **que** ces tokens.

| Thème       | Identité                                  |
| ----------- | ----------------------------------------- |
| `default`   | Indigo, neutre                            |
| `atelier`   | Neutres chauds + terracotta               |
| `blueprint` | Monospace, bordures franches, vert signal |
| `aurora`    | Verre dépoli, accent violet               |

Le thème se compose de **deux axes indépendants**, tous deux **choisis au runtime** et
persistés en `localStorage` (anti-flash via un script dans `index.html`) :

- l'**identité** (`ThemeSelector` → menu déroulant → `data-theme` sur `<html>`, clé
  `theme-name`) ;
- le **mode clair / sombre** (`ThemeToggle` → classe `dark` sur `<html>`, clé `theme`).

Chaque identité décline une **variante claire et une sombre** : les **huit combinaisons** sont
valides. Les valeurs vivent dans `src/index.css` (`[data-theme='x']` et `[data-theme='x'].dark`),
exposées à Tailwind via `@theme inline` — `inline` fait que les utilitaires (`bg-surface`,
`text-fg`, `bg-accent`…) **référencent** les variables plutôt que d'en copier la valeur, ce qui
permet de changer d'identité **et** de mode au runtime sans rebuild. La logique de
sélection/application vit dans `src/theme.ts` + `src/hooks/useTheme.ts`.

Dans **Storybook**, deux menus **indépendants** de la barre d'outils — **« Thème »**
(`data-theme`) et **« Mode »** (classe `dark`) — pilotent l'aperçu (voir
`.storybook/preview.tsx`). La page **Design → Thèmes** affiche un échantillon de tokens pour
comparer les identités d'un coup d'œil, et **Design → Couleurs** documente l'ensemble des
tokens sémantiques (surfaces, accent, états) ainsi que les **6 palettes de couleur du QR**.

> 💡 Le **fond** du QR reste clair par défaut pour garantir sa lisibilité par les scanners,
> quel que soit le thème de l'interface ; un garde-fou de contraste prévient les choix
> risqués.

### PWA (installable / hors-ligne)

Le site est une **Progressive Web App**, sans dépendance ni plugin de build :

- `public/manifest.webmanifest` (+ icône _maskable_ et `apple-touch-icon.png` 180×180 pour
  iOS) déclare l'app installable ;
- `public/sw.js` est un **service worker** qui met l'app shell en cache (stratégie
  _stale-while-revalidate_) : après la première visite, le générateur **fonctionne hors-ligne**.
  Il n'est enregistré qu'en production (voir `src/main.tsx`) et ses chemins sont relatifs, donc
  compatibles avec le sous-chemin GitHub Pages.

### Partage de lien (SEO)

`index.html` embarque les balises **Open Graph** et **Twitter Card** ainsi qu'une image
d'aperçu `public/og-image.png` (1200×630, source vectorielle `public/og-image.svg`).

---

## Tests

- **Unitaires / composants** (`npm test`) : les builders de payloads (cas nominaux +
  échappement), la **validation** (URL / email / géo), le **contraste**, le mapping
  d'options `qr` (`toStylingOptions`), et les composants (`TypeSelector`, `QrForm`,
  `QrCustomizer`, `App`).
- **Intégration / e2e** (`npm run test:e2e`) : parcours réel dans un navigateur — saisie,
  rendu du `<canvas>`, téléchargement, bascule de thème.

La CI exécute l'ensemble à chaque _push_ et _pull request_ (voir
`.github/workflows/ci.yml`).

---

## Déploiement sur GitHub Pages

Le déploiement est **automatisé** par `.github/workflows/deploy.yml`.

1. Créez un dépôt GitHub et poussez-y ce code.
2. Dans **Settings → Pages → Build and deployment → Source**, choisissez **GitHub Actions**
   (et _non_ « Deploy from a branch »).
3. Poussez sur la branche `main` : le workflow construit le site et le publie
   automatiquement. (Vous pouvez aussi le déclencher manuellement depuis l'onglet
   **Actions → Deploy to GitHub Pages → Run workflow**.)
4. Le site sera disponible sur `https://<utilisateur>.github.io/<dépôt>/`.

> 💡 `vite.config.ts` utilise `base: './'` : les chemins des assets sont **relatifs**, donc
> le site fonctionne quel que soit le nom du dépôt — pas besoin de configurer le sous-chemin.

> 🎨 Plus besoin de configurer le thème au déploiement : chaque visiteur choisit l'identité
> et le mode clair/sombre directement dans l'interface (préférences mémorisées localement).

---

## Licence

[GNU General Public License v3.0 ou ultérieure](./LICENSE).
