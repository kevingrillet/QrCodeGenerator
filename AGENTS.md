# AGENTS.md — QrCodeGenerator

Guide pour agents IA. Site **statique** qui génère des QR codes **dans le navigateur**
(aucune donnée envoyée à un serveur), hébergeable sur GitHub Pages. Types supportés :
**Texte, URL, WiFi, Email, SMS, Téléphone, vCard, Géo**. Bilingue FR/EN, PWA (offline).

Ce projet est le dépôt d'origine du socle d'infrastructure réutilisable
[NodeTemplate](https://github.com/kevingrillet/NodeTemplate) (qui en est l'extraction
épurée du domaine).

## Commandes

| Commande            | Effet                                                              |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Serveur de dev (HMR).                                              |
| `npm run check`     | **À lancer avant de conclure** : format + lint + typecheck + test. |
| `npm run build`     | `tsc -b` + build Vite.                                             |
| `npm run test`      | Vitest (unitaires/composants).                                     |
| `npm run test:e2e`  | Playwright (e2e).                                                  |
| `npm run storybook` | Storybook (port 6006).                                             |

Après une modif : `npm run format` puis `npm run check`. Tout doit être vert.

## Stack

Vite · React 19 + TypeScript (strict, `noUnusedLocals`/`noUnusedParameters`) ·
Tailwind v4 (CSS-first, `@theme inline`) · Vitest + Testing Library · Playwright ·
Storybook 10 · ESLint (flat) + Prettier · PWA (manifest + service worker offline) ·
CI/CD GitHub Actions (qualité + tests, déploiement Pages) · Dependabot + auto-merge.

Dépendance runtime du domaine : **`qr-code-styling`** (encodage + rendu du QR). Hors
React/ReactDOM, tout le reste est en `devDependencies`.

## Structure

```
src/
├─ components/       Hint, Section, ThemeToggle/Selector, LanguageSwitcher,
│  │                 TypeSelector, QrForm, QrCustomizer, LogoControls,
│  │                 QrOutputControls, QrPreview (+ stories + tests)
├─ hooks/            useTheme (identité + clair/sombre)
├─ i18n/             I18nProvider + messages (FR/EN)
├─ lib/              qr.ts (construction des payloads par type),
│                    presets.ts (palettes), contrast.ts (garde-fou lisibilité)
├─ App.tsx           page principale
├─ theme.ts          déclaration des thèmes
└─ index.css         tokens des thèmes (variables CSS)
tests/               specs Playwright
```

## Domaine QR — où vit la logique

- **`src/lib/qr.ts`** : construction des chaînes encodées par type (WiFi, vCard, géo…).
  C'est la source de vérité du format de chaque payload — toute modif d'un type passe
  par là, couverte par `qr.test.ts`.
- **`src/lib/contrast.ts`** : garde-fou de lisibilité (contraste couleur QR / fond),
  testé par `contrast.test.ts`.
- **`src/lib/presets.ts`** : palettes de couleurs proposées.
- Personnalisation (couleurs, forme des modules, logo centré, correction d'erreur,
  densité/version, taille d'export) pilotée via `QrCustomizer` / `LogoControls` /
  `QrOutputControls` ; rendu et export PNG/SVG + copie presse-papier dans `QrPreview`.

Toute nouvelle logique de domaine va dans `src/lib/` **avec son test** ; les composants
restent fins (présentation + état UI).

## Ajouter un type de QR (guide pas à pas)

Grâce aux patterns _Registry_ + _Strategy_, ajouter un type de contenu ne touche **aucun
composant** : tout passe par la couche `payloads` et l'i18n. Exemple fil rouge : un type
`event` (événement calendrier). Étapes, dans l'ordre :

1. **Builder pur** — créer `src/lib/payloads/<type>.ts` : une interface de données et une
   fonction `build<Type>(data): string` **sans React ni accès DOM**, qui produit la chaîne
   encodée et **échappe** les caractères réservés du format (cf. `wifi.ts` / `vcard.ts`).
   Exporter aussi la fonction d'échappement si elle est réutilisable/testable seule.

2. **(Optionnel) Validation de format** — si le type a des contraintes (nombre, e-mail,
   URL…), ajouter un `validate<Type>Fields(values): FieldErrors` dans
   `src/lib/payloads/index.ts`. **Règle absolue : un champ vide ne produit jamais d'erreur**
   (la complétude est gérée par `isReady`). Les messages sont des **clés** `validation.*`.

3. **Entrée du registre** — ajouter un objet `PayloadType` dans `PAYLOAD_TYPES`
   (`src/lib/payloads/index.ts`) : `id`, `labelKey`, `descriptionKey`, la liste `fields`
   (chaque champ pointe des **clés** `fields.<type>.<champ>.*`), les `defaults`, le `build`
   (fin adaptateur qui lit les valeurs via `readString`/`readBoolean` et délègue au builder),
   et `validate` si présent. L'UI (`TypeSelector`, `QrForm`) se génère automatiquement.

4. **i18n FR ET EN** — dans `src/i18n/messages.ts`, renseigner les **deux** dictionnaires
   (`fr` puis `en`) pour toutes les clés introduites : `types.<id>`, `fields.<id>.*`, et
   éventuels `validation.*`. L'interface `Messages` est typée : une clé manquante d'un côté
   = **erreur TypeScript** (le `typecheck` échoue), ce qui garantit la parité FR/EN.

5. **Tests** (`src/lib/payloads/payloads.test.ts`) — couvrir le builder : cas nominal,
   champs optionnels omis, **échappement** des caractères réservés, et cas **Unicode/emoji**.
   Si un `validate` a été ajouté, tester acceptations et rejets (dont les cas limites). Le
   test `registre` vérifie déjà que chaque type construit depuis ses `defaults` sans lever.

6. **Story Storybook** — les types apparaissent dans `QrPreview.stories.tsx` (story
   `TousLesTypes`, générée depuis le registre) : y ajouter un échantillon pré-rempli pour
   documenter visuellement le rendu du nouveau format.

7. **Vérifier** — `npm run format` puis `npm run check` (format + lint + typecheck + test)
   jusqu'au vert ; la CI ajoute e2e (Playwright + axe-core) et `build-storybook`.

## Thèmes — règle absolue

Deux axes **indépendants**, runtime, persistés dans localStorage : l'**identité**
(`default`/`atelier`/`blueprint`/`aurora`, via `data-theme`) et le **mode clair/sombre**
(classe `dark`). 8 combinaisons valides.

**Toujours utiliser les tokens** (`bg-canvas`, `bg-surface`, `text-fg`, `text-fg-muted`,
`bg-accent`/`text-accent-fg`, `accent-strong`, `text-danger`, `text-warning`,
`text-success`, `rounded-card`/`rounded-control`, `shadow-card`/`shadow-btn`).
**Jamais de couleur Tailwind en dur** (`text-red-500`…) : elle casserait dans une des 8
combinaisons. Tokens dans `src/index.css` ; `theme.ts` + `hooks/useTheme.ts` appliquent
et gèrent l'anti-flash (cohérent avec le script de `index.html`).

> Note : les couleurs **du QR** (premier plan/fond, palettes) sont un choix utilisateur du
> domaine, distinct des tokens de thème de l'UI — ne pas confondre les deux.

**Ajouter un thème** : nom dans `THEMES` (`theme.ts`), tokens clairs+sombres dans
`index.css`, libellé dans `theme.names` (`i18n/messages.ts`).

## i18n

Maison, sans dépendance. `t('a.b.c')` résout une clé pointée. L'interface `Messages`
garantit que `fr` et `en` ont la même structure (clé manquante = erreur TS).
**Ajouter une chaîne** : étendre `Messages` puis renseigner `fr` ET `en`.

## Design system & Storybook

Composants partagés stylés uniquement via les tokens. **Storybook est la source de
vérité** : un composant a sa story (variants, états, a11y) et son test. `npm run check`
n'inclut pas Storybook, mais la CI vérifie `build-storybook`.

## Accessibilité

Navigation clavier, focus visible (`:focus-visible` global dans `index.css`), ARIA
pertinent. Garder ce niveau dans tout nouveau composant.

## Déploiement

`base: './'` (chemins relatifs) → compatible sous-chemin Pages
(`https://kevingrillet.github.io/QrCodeGenerator/`). Workflow `deploy.yml` à chaque push
sur `main`. Pages activé (source : GitHub Actions).
