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
  theme: { toLight: string; toDark: string; light: string; dark: string };
  language: { label: string; toggle: string };
  preview: {
    prompt: string;
    downloadPng: string;
    downloadSvg: string;
    error: string;
    alt: string;
    foregroundColor: string;
    backgroundColor: string;
  };
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
  theme: {
    toLight: 'Activer le thème clair',
    toDark: 'Activer le thème sombre',
    light: 'Thème clair',
    dark: 'Thème sombre',
  },
  language: { label: 'Langue', toggle: 'Passer en anglais' },
  preview: {
    prompt: 'Remplissez le formulaire pour générer le QR code.',
    downloadPng: 'Télécharger PNG',
    downloadSvg: 'Télécharger SVG',
    error: 'Erreur de génération',
    alt: 'QR code généré',
    foregroundColor: 'Couleur du QR code',
    backgroundColor: 'Couleur du fond',
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
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
    light: 'Light theme',
    dark: 'Dark theme',
  },
  language: { label: 'Language', toggle: 'Switch to French' },
  preview: {
    prompt: 'Fill in the form to generate the QR code.',
    downloadPng: 'Download PNG',
    downloadSvg: 'Download SVG',
    error: 'Generation error',
    alt: 'Generated QR code',
    foregroundColor: 'QR code color',
    backgroundColor: 'Background color',
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
