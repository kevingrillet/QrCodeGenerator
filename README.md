# Générateur de QR code

Petit site **statique** qui génère des QR codes directement dans le navigateur — aucune
donnée n'est envoyée à un serveur. Conçu pour être hébergé gratuitement sur **GitHub
Pages**.

Types de contenu supportés : **Texte, URL, WiFi, Email, SMS, Téléphone, vCard, Géo**.
Interface **bilingue (fr / en)**, thème **clair / sombre**, export **PNG** et **SVG**.

> 🔗 **Démo** : `https://kevingrillet.github.io/QrCodeGenerator/`

---

## Stack

| Rôle                         | Outil                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------- |
| Build / dev                  | [Vite](https://vitejs.dev/)                                                     |
| UI                           | [React](https://react.dev/) + TypeScript                                        |
| Style                        | [Tailwind CSS](https://tailwindcss.com/) (`darkMode: 'class'`)                  |
| Encodage QR                  | [`qrcode`](https://www.npmjs.com/package/qrcode) — **seule dépendance runtime** |
| Tests unitaires / composants | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |
| Tests d'intégration / e2e    | [Playwright](https://playwright.dev/)                                           |
| Documentation des composants | [Storybook](https://storybook.js.org/)                                          |
| Qualité                      | ESLint + Prettier                                                               |
| CI/CD                        | GitHub Actions                                                                  |

Les dépendances _runtime_ sont volontairement minimales : `react`, `react-dom`, `qrcode`.
Tout le reste est en `devDependencies`.

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
| `npm run watch`           | Alias de `dev` (même serveur, rebuild auto au save)               |
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

`src/lib/qr.ts` encapsule la librairie `qrcode`. C'est le **seul** endroit qui en dépend :
il expose le rendu canvas (aperçu + PNG) et SVG, plus les utilitaires de téléchargement.
Changer de moteur d'encodage ne toucherait que ce fichier.

### 3. Couche UI — React

- `TypeSelector` : onglets générés depuis le registre.
- `QrForm` : formulaire **dynamique** rendu d'après `type.fields`.
- `QrPreview` : dessine le QR dans un `<canvas>` et propose les exports PNG / SVG.
- `ThemeToggle` + `useTheme` : thème clair/sombre.
- `App` : assemble le tout et conserve les valeurs **par type**.

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

### Thème clair / sombre

`useTheme` lit la préférence dans `localStorage` (clé `theme`), sinon suit le système
(`prefers-color-scheme`), et applique la classe `dark` sur `<html>` (variantes `dark:` de
Tailwind). Un court script dans `index.html` applique le thème **avant** le rendu pour
éviter tout « flash ». Le QR lui-même reste noir sur blanc pour garantir sa lisibilité par
les scanners.

---

## Tests

- **Unitaires / composants** (`npm test`) : tous les builders de payloads (cas nominaux +
  échappement), le rendu SVG, et les composants (`TypeSelector`, `QrForm`, `App`).
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

---

## Licence

[GNU General Public License v3.0 ou ultérieure](./LICENSE.md).
