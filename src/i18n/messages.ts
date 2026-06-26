/**
 * Dictionnaires de traduction (français / anglais).
 *
 * Le français est la langue de référence. L'interface `Messages` garantit que
 * les deux dictionnaires ont la même structure : il est impossible d'oublier une
 * section. Les chaînes sont organisées par domaine ; le registre des payloads
 * (`lib/payloads`) ne stocke que des *clés* (ex. `types.wifi.label`) résolues ici.
 */
export type Lang = 'fr' | 'en';

export const LANGS: Lang[] = ['fr', 'en'];

export interface Messages {
  app: { title: string; privacy: string };
  /** Libellés d'accessibilité réutilisables. */
  a11y: { help: string; contentType: string; skipToContent: string };
  theme: {
    toLight: string;
    toDark: string;
    light: string;
    dark: string;
    /** Libellé du sélecteur d'identité visuelle. */
    select: string;
    /** Noms des identités visuelles (clé = default | atelier | blueprint | aurora). */
    names: Record<string, string>;
  };
  language: { label: string; toggle: string };
  preview: {
    prompt: string;
    downloadPng: string;
    downloadSvg: string;
    copy: string;
    copied: string;
    copyHint: string;
    error: string;
    alt: string;
    foregroundColor: string;
    backgroundColor: string;
    errorCorrectionLabel: string;
    errorCorrectionHint: string;
    contrastWarningLow: string;
    contrastWarningInverted: string;
    readabilityOk: string;
    readabilityRisk: string;
    size: string;
  };
  /** Titres des sections de configuration (Contenu / Personnalisation / …). */
  sections: {
    content: string;
    customization: string;
    color: string;
    shape: string;
    logo: string;
    output: string;
  };
  /** Section logo : import d'une image au centre du QR. */
  logo: { upload: string; remove: string; hint: string; alt: string };
  /** Réglages du code : densité (version du QR). */
  output: {
    densityLabel: string;
    densityAuto: string;
    versionPrefix: string;
    densityHint: string;
  };
  /** Libellés des formes de modules (clé = square | dots | rounded). */
  shape: Record<string, string>;
  /** Noms des palettes de couleurs prêtes à l'emploi. */
  presets: Record<string, string>;
  /** Libellés des niveaux de correction d'erreur (clé = L | M | Q | H). */
  errorCorrection: Record<string, string>;
  /** Messages de validation, indexés par clé de règle (ex. `url`, `latitude`). */
  validation: Record<string, string>;
  /** Libellé + description par type de contenu (clé = identifiant du type). */
  types: Record<string, { label: string; description: string }>;
  /** Libellé + placeholder par champ, indexés par type puis par nom de champ. */
  fields: Record<string, Record<string, { label: string; placeholder?: string }>>;
  /** Libellés des options de chiffrement WiFi. */
  wifiEncryption: Record<string, string>;
}

const fr: Messages = {
  app: {
    title: 'Générateur de QR code',
    privacy: "Généré localement dans votre navigateur — aucune donnée n'est envoyée à un serveur.",
  },
  a11y: { help: 'Aide', contentType: 'Type de contenu', skipToContent: 'Aller au contenu' },
  theme: {
    toLight: 'Activer le mode clair',
    toDark: 'Activer le mode sombre',
    light: 'Mode clair',
    dark: 'Mode sombre',
    select: 'Thème',
    names: {
      default: 'Défaut',
      atelier: 'Atelier',
      blueprint: 'Blueprint',
      aurora: 'Aurora',
    },
  },
  language: { label: 'Langue', toggle: 'Passer en anglais' },
  preview: {
    prompt: 'Remplissez le formulaire pour générer le QR code.',
    downloadPng: 'Télécharger PNG',
    downloadSvg: 'Télécharger SVG',
    copy: "Copier l'image",
    copied: 'Copié !',
    copyHint:
      'Copie non disponible sur ce navigateur : faites un clic droit sur le QR puis « Copier l’image ».',
    error: 'Erreur de génération',
    alt: 'QR code généré',
    foregroundColor: 'Couleur du QR code',
    backgroundColor: 'Couleur du fond',
    errorCorrectionLabel: "Niveau de correction d'erreur",
    errorCorrectionHint:
      'Le QR embarque des données redondantes : il reste lisible même si une partie est abîmée, pliée ou masquée (logo). L ≈ 7 %, M ≈ 15 %, Q ≈ 25 %, H ≈ 30 % récupérables. Plus le niveau est haut, plus le QR est dense.',
    contrastWarningLow:
      'Contraste trop faible : ce QR code risque de ne pas être lisible par les scanners.',
    contrastWarningInverted:
      'Modules plus clairs que le fond : certains lecteurs ne scanneront pas ce QR code « en négatif ».',
    readabilityOk: 'Lisibilité optimale',
    readabilityRisk: 'Lisibilité à vérifier',
    size: "Taille de l'image",
  },
  sections: {
    content: 'Contenu',
    customization: 'Personnalisation',
    color: 'Couleur',
    shape: 'Forme des modules',
    logo: 'Logo',
    output: 'Réglages avancés',
  },
  logo: {
    upload: 'Importer une image',
    remove: 'Retirer le logo',
    hint: "Le logo masque une partie du QR : la correction d'erreur est automatiquement passée en « Maximale (H) » pour préserver la lisibilité. Préférez un logo simple, sur fond transparent ou clair.",
    alt: 'Logo du QR code',
  },
  output: {
    densityLabel: 'Densité (version)',
    densityAuto: 'Auto (recommandé)',
    versionPrefix: 'Version',
    densityHint:
      'La densité correspond à la « version » du QR : sa finesse, c.-à-d. son nombre de modules (de 21×21 à 177×177). En « Auto », l’encodeur choisit automatiquement la plus petite version qui contient vos données au niveau de correction choisi — c’est le réglage conseillé. Forcer une version plus haute densifie le code ; trop basse, les données ne tiennent plus. À ne pas confondre avec la taille (en pixels) du fichier exporté.',
  },
  shape: {
    square: 'Carré',
    dots: 'Points',
    rounded: 'Arrondi',
  },
  presets: {
    classic: 'Classique',
    ink: 'Encre',
    ocean: 'Océan',
    forest: 'Forêt',
    berry: 'Mûre',
    slate: 'Ardoise',
  },
  errorCorrection: {
    L: 'Faible (L · ~7 %)',
    M: 'Moyenne (M · ~15 %)',
    Q: 'Élevée (Q · ~25 %)',
    H: 'Maximale (H · ~30 %)',
  },
  validation: {
    url: 'Adresse web invalide.',
    email: 'Adresse email invalide.',
    latitude: 'Latitude hors limites (entre -90 et 90).',
    longitude: 'Longitude hors limites (entre -180 et 180).',
  },
  types: {
    text: { label: 'Texte', description: 'Un texte brut, encodé tel quel.' },
    url: {
      label: 'URL',
      description: 'Un lien web. `https://` est ajouté automatiquement si absent.',
    },
    wifi: { label: 'WiFi', description: 'Connexion automatique à un réseau WiFi.' },
    email: { label: 'Email', description: 'Ouvre le client mail avec un message pré-rempli.' },
    sms: { label: 'SMS', description: 'Ouvre l’application de messages avec un SMS pré-rempli.' },
    tel: { label: 'Téléphone', description: 'Déclenche un appel téléphonique.' },
    vcard: { label: 'vCard', description: 'Carte de contact (ajout au carnet d’adresses).' },
    geo: { label: 'Géo', description: 'Une position géographique (latitude, longitude).' },
  },
  fields: {
    text: { text: { label: 'Texte', placeholder: 'Saisissez votre texte…' } },
    url: { url: { label: 'Adresse', placeholder: 'exemple.com' } },
    wifi: {
      ssid: { label: 'Nom du réseau (SSID)' },
      password: { label: 'Mot de passe' },
      encryption: { label: 'Chiffrement' },
      hidden: { label: 'Réseau masqué' },
    },
    email: {
      to: { label: 'Destinataire', placeholder: 'nom@exemple.com' },
      subject: { label: 'Sujet' },
      body: { label: 'Message' },
    },
    sms: {
      number: { label: 'Numéro', placeholder: '+33612345678' },
      message: { label: 'Message' },
    },
    tel: { number: { label: 'Numéro', placeholder: '+33612345678' } },
    vcard: {
      firstName: { label: 'Prénom' },
      lastName: { label: 'Nom' },
      organization: { label: 'Organisation' },
      title: { label: 'Fonction' },
      phone: { label: 'Téléphone' },
      email: { label: 'Email' },
      url: { label: 'Site web' },
    },
    geo: {
      latitude: { label: 'Latitude', placeholder: '48.8584' },
      longitude: { label: 'Longitude', placeholder: '2.2945' },
    },
  },
  wifiEncryption: {
    WPA: 'WPA / WPA2 / WPA3',
    WEP: 'WEP',
    nopass: 'Aucun (réseau ouvert)',
  },
};

const en: Messages = {
  app: {
    title: 'QR code generator',
    privacy: 'Generated locally in your browser — no data is sent to any server.',
  },
  a11y: { help: 'Help', contentType: 'Content type', skipToContent: 'Skip to content' },
  theme: {
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    light: 'Light mode',
    dark: 'Dark mode',
    select: 'Theme',
    names: {
      default: 'Default',
      atelier: 'Atelier',
      blueprint: 'Blueprint',
      aurora: 'Aurora',
    },
  },
  language: { label: 'Language', toggle: 'Switch to French' },
  preview: {
    prompt: 'Fill in the form to generate the QR code.',
    downloadPng: 'Download PNG',
    downloadSvg: 'Download SVG',
    copy: 'Copy image',
    copied: 'Copied!',
    copyHint: 'Copy isn’t available in this browser: right-click the QR and choose “Copy image”.',
    error: 'Generation error',
    alt: 'Generated QR code',
    foregroundColor: 'QR code color',
    backgroundColor: 'Background color',
    errorCorrectionLabel: 'Error correction level',
    errorCorrectionHint:
      'The QR embeds redundant data: it stays readable even if part of it is damaged, folded or covered (logo). L ≈ 7%, M ≈ 15%, Q ≈ 25%, H ≈ 30% recoverable. The higher the level, the denser the QR.',
    contrastWarningLow: 'Contrast too low: this QR code may not be readable by scanners.',
    contrastWarningInverted:
      'Modules lighter than the background: some readers won’t scan this “negative” QR code.',
    readabilityOk: 'Optimal readability',
    readabilityRisk: 'Check readability',
    size: 'Image size',
  },
  sections: {
    content: 'Content',
    customization: 'Customization',
    color: 'Color',
    shape: 'Module shape',
    logo: 'Logo',
    output: 'Advanced settings',
  },
  logo: {
    upload: 'Upload an image',
    remove: 'Remove logo',
    hint: 'The logo covers part of the QR: error correction is automatically set to “High (H)” to keep it scannable. Prefer a simple logo on a transparent or light background.',
    alt: 'QR code logo',
  },
  output: {
    densityLabel: 'Density (version)',
    densityAuto: 'Auto (recommended)',
    versionPrefix: 'Version',
    densityHint:
      'Density is the QR “version”: its fineness, i.e. its number of modules (from 21×21 to 177×177). In “Auto”, the encoder automatically picks the smallest version that fits your data at the chosen error-correction level — the recommended setting. Forcing a higher version makes the code denser; too low and the data no longer fits. Not to be confused with the exported file size (in pixels).',
  },
  shape: {
    square: 'Square',
    dots: 'Dots',
    rounded: 'Rounded',
  },
  presets: {
    classic: 'Classic',
    ink: 'Ink',
    ocean: 'Ocean',
    forest: 'Forest',
    berry: 'Berry',
    slate: 'Slate',
  },
  errorCorrection: {
    L: 'Low (L · ~7%)',
    M: 'Medium (M · ~15%)',
    Q: 'Quartile (Q · ~25%)',
    H: 'High (H · ~30%)',
  },
  validation: {
    url: 'Invalid web address.',
    email: 'Invalid email address.',
    latitude: 'Latitude out of range (between -90 and 90).',
    longitude: 'Longitude out of range (between -180 and 180).',
  },
  types: {
    text: { label: 'Text', description: 'Plain text, encoded as-is.' },
    url: { label: 'URL', description: 'A web link. `https://` is added automatically if missing.' },
    wifi: { label: 'WiFi', description: 'Automatic connection to a WiFi network.' },
    email: { label: 'Email', description: 'Opens the mail client with a prefilled message.' },
    sms: { label: 'SMS', description: 'Opens the messaging app with a prefilled SMS.' },
    tel: { label: 'Phone', description: 'Starts a phone call.' },
    vcard: { label: 'vCard', description: 'Contact card (add to address book).' },
    geo: { label: 'Geo', description: 'A geographic location (latitude, longitude).' },
  },
  fields: {
    text: { text: { label: 'Text', placeholder: 'Enter your text…' } },
    url: { url: { label: 'Address', placeholder: 'example.com' } },
    wifi: {
      ssid: { label: 'Network name (SSID)' },
      password: { label: 'Password' },
      encryption: { label: 'Encryption' },
      hidden: { label: 'Hidden network' },
    },
    email: {
      to: { label: 'Recipient', placeholder: 'name@example.com' },
      subject: { label: 'Subject' },
      body: { label: 'Message' },
    },
    sms: {
      number: { label: 'Number', placeholder: '+33612345678' },
      message: { label: 'Message' },
    },
    tel: { number: { label: 'Number', placeholder: '+33612345678' } },
    vcard: {
      firstName: { label: 'First name' },
      lastName: { label: 'Last name' },
      organization: { label: 'Organization' },
      title: { label: 'Title' },
      phone: { label: 'Phone' },
      email: { label: 'Email' },
      url: { label: 'Website' },
    },
    geo: {
      latitude: { label: 'Latitude', placeholder: '48.8584' },
      longitude: { label: 'Longitude', placeholder: '2.2945' },
    },
  },
  wifiEncryption: {
    WPA: 'WPA / WPA2 / WPA3',
    WEP: 'WEP',
    nopass: 'None (open network)',
  },
};

export const messages: Record<Lang, Messages> = { fr, en };
