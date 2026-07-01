# Architecture

Site web **statique** (GitHub Pages), **100% client-side**. Complète l'`AGENTS.md`
du dépôt (qui fait foi). Volontairement court.

## Stack commune

Vite · React + TypeScript strict · Tailwind CSS (CSS-first, `@theme inline`) ·
Vitest + Testing Library · Playwright · Storybook · ESLint (flat) + Prettier ·
PWA (offline) · CI/CD GitHub Actions (qualité + tests → déploiement Pages).

> Versions exactes : voir `package.json` (ne pas les figer ici pour éviter l'obsolescence).

## Principes transverses

- Dépendances runtime minimales (`react`, `react-dom` + libs domaine justifiées, isolées).
- Thèmes runtime à 2 axes indépendants : identité (`data-theme`) × clair/sombre (`dark`).
- i18n maison FR/EN typée (`src/i18n/`).
- Déploiement : `deploy.yml` à chaque push sur `main` ; `base: './'` (sous-chemin Pages).

## Ce dépôt : QrCodeGenerator

Génère des QR codes **dans le navigateur** (aucune donnée envoyée), types : Texte, URL,
WiFi, Email, SMS, Téléphone, vCard, Géo. C'est le **dépôt d'origine** dont NodeTemplate
est l'extraction épurée du domaine. Dépendance domaine : **`qr-code-styling`**.

Le domaine vit dans `src/lib/` (avec ses tests) ; les composants restent fins.

- **`src/lib/qr.ts`** — source de vérité des **payloads par type** (WiFi, vCard, géo…).
  Toute modif d'un type passe par là (`qr.test.ts`).
- **`src/lib/contrast.ts`** — garde-fou de lisibilité (contraste QR / fond).
- **`src/lib/presets.ts`** — palettes proposées.
- Composants de présentation : `TypeSelector`, `QrForm`, `QrCustomizer`, `LogoControls`,
  `QrOutputControls`, `QrPreview` (rendu + export PNG/SVG + copie presse-papier).

> ⚠️ Les couleurs **du QR** (choix utilisateur du domaine) sont distinctes des tokens de
> thème de l'UI — ne pas confondre.
