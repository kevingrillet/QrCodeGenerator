# Architecture

Site web **statique** (GitHub Pages), **100% client-side**. Complète l'`AGENTS.md`
du dépôt (qui fait foi). Volontairement court.

Stack, thèmes, i18n, dépendances minimales et déploiement : voir `AGENTS.md` (détail) et
`coding-standards.md` (règles transverses). Versions exactes : `package.json`.

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
