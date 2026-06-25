/**
 * Registre des types de contenu QR (pattern Registry/Factory).
 *
 * Chaque entrée décrit un type : ses champs de formulaire, ses valeurs par défaut
 * et sa fonction `build`. L'UI (`TypeSelector`, `QrForm`) se génère entièrement à
 * partir de ce registre — ajouter un nouveau type ne nécessite que d'ajouter une
 * entrée ici et un builder dans son propre fichier.
 *
 * Les textes affichés sont référencés par des clés i18n (`types.*`, `fields.*`,
 * `wifiEncryption.*`) résolues à l'affichage : le registre ne contient aucune
 * chaîne dépendante de la langue.
 *
 * Les `build` ci-dessous sont de fins adaptateurs : ils lisent les valeurs
 * (génériques) du formulaire et délèguent aux builders fortement typés.
 */
import type { PayloadType, FieldValues } from './types';
import { readString, readBoolean } from './types';
import { buildText } from './text';
import { buildUrl } from './url';
import { buildWifi, type WifiEncryption } from './wifi';
import { buildEmail } from './email';
import { buildSms } from './sms';
import { buildTel } from './tel';
import { buildVCard } from './vcard';
import { buildGeo } from './geo';

export const PAYLOAD_TYPES: PayloadType[] = [
  {
    id: 'text',
    labelKey: 'types.text.label',
    descriptionKey: 'types.text.description',
    fields: [
      {
        name: 'text',
        labelKey: 'fields.text.text.label',
        type: 'textarea',
        placeholderKey: 'fields.text.text.placeholder',
        required: true,
      },
    ],
    defaults: { text: '' },
    build: (v) => buildText(readString(v, 'text')),
  },
  {
    id: 'url',
    labelKey: 'types.url.label',
    descriptionKey: 'types.url.description',
    fields: [
      {
        name: 'url',
        labelKey: 'fields.url.url.label',
        type: 'url',
        placeholderKey: 'fields.url.url.placeholder',
        required: true,
      },
    ],
    defaults: { url: '' },
    build: (v) => buildUrl(readString(v, 'url')),
  },
  {
    id: 'wifi',
    labelKey: 'types.wifi.label',
    descriptionKey: 'types.wifi.description',
    fields: [
      { name: 'ssid', labelKey: 'fields.wifi.ssid.label', type: 'text', required: true },
      { name: 'password', labelKey: 'fields.wifi.password.label', type: 'password' },
      {
        name: 'encryption',
        labelKey: 'fields.wifi.encryption.label',
        type: 'select',
        options: [
          { value: 'WPA', labelKey: 'wifiEncryption.WPA' },
          { value: 'WEP', labelKey: 'wifiEncryption.WEP' },
          { value: 'nopass', labelKey: 'wifiEncryption.nopass' },
        ],
      },
      { name: 'hidden', labelKey: 'fields.wifi.hidden.label', type: 'checkbox' },
    ],
    defaults: { ssid: '', password: '', encryption: 'WPA', hidden: false },
    build: (v) =>
      buildWifi({
        ssid: readString(v, 'ssid'),
        password: readString(v, 'password'),
        encryption: readString(v, 'encryption') as WifiEncryption,
        hidden: readBoolean(v, 'hidden'),
      }),
  },
  {
    id: 'email',
    labelKey: 'types.email.label',
    descriptionKey: 'types.email.description',
    fields: [
      {
        name: 'to',
        labelKey: 'fields.email.to.label',
        type: 'email',
        placeholderKey: 'fields.email.to.placeholder',
        required: true,
      },
      { name: 'subject', labelKey: 'fields.email.subject.label', type: 'text' },
      { name: 'body', labelKey: 'fields.email.body.label', type: 'textarea' },
    ],
    defaults: { to: '', subject: '', body: '' },
    build: (v) =>
      buildEmail({
        to: readString(v, 'to'),
        subject: readString(v, 'subject'),
        body: readString(v, 'body'),
      }),
  },
  {
    id: 'sms',
    labelKey: 'types.sms.label',
    descriptionKey: 'types.sms.description',
    fields: [
      {
        name: 'number',
        labelKey: 'fields.sms.number.label',
        type: 'tel',
        placeholderKey: 'fields.sms.number.placeholder',
        required: true,
      },
      { name: 'message', labelKey: 'fields.sms.message.label', type: 'textarea' },
    ],
    defaults: { number: '', message: '' },
    build: (v) =>
      buildSms({
        number: readString(v, 'number'),
        message: readString(v, 'message'),
      }),
  },
  {
    id: 'tel',
    labelKey: 'types.tel.label',
    descriptionKey: 'types.tel.description',
    fields: [
      {
        name: 'number',
        labelKey: 'fields.tel.number.label',
        type: 'tel',
        placeholderKey: 'fields.tel.number.placeholder',
        required: true,
      },
    ],
    defaults: { number: '' },
    build: (v) => buildTel(readString(v, 'number')),
  },
  {
    id: 'vcard',
    labelKey: 'types.vcard.label',
    descriptionKey: 'types.vcard.description',
    fields: [
      { name: 'firstName', labelKey: 'fields.vcard.firstName.label', type: 'text', required: true },
      { name: 'lastName', labelKey: 'fields.vcard.lastName.label', type: 'text', required: true },
      { name: 'organization', labelKey: 'fields.vcard.organization.label', type: 'text' },
      { name: 'title', labelKey: 'fields.vcard.title.label', type: 'text' },
      { name: 'phone', labelKey: 'fields.vcard.phone.label', type: 'tel' },
      { name: 'email', labelKey: 'fields.vcard.email.label', type: 'email' },
      { name: 'url', labelKey: 'fields.vcard.url.label', type: 'url' },
    ],
    defaults: {
      firstName: '',
      lastName: '',
      organization: '',
      title: '',
      phone: '',
      email: '',
      url: '',
    },
    build: (v) =>
      buildVCard({
        firstName: readString(v, 'firstName'),
        lastName: readString(v, 'lastName'),
        organization: readString(v, 'organization'),
        title: readString(v, 'title'),
        phone: readString(v, 'phone'),
        email: readString(v, 'email'),
        url: readString(v, 'url'),
      }),
  },
  {
    id: 'geo',
    labelKey: 'types.geo.label',
    descriptionKey: 'types.geo.description',
    fields: [
      {
        name: 'latitude',
        labelKey: 'fields.geo.latitude.label',
        type: 'number',
        placeholderKey: 'fields.geo.latitude.placeholder',
        required: true,
      },
      {
        name: 'longitude',
        labelKey: 'fields.geo.longitude.label',
        type: 'number',
        placeholderKey: 'fields.geo.longitude.placeholder',
        required: true,
      },
    ],
    defaults: { latitude: '', longitude: '' },
    build: (v) =>
      buildGeo({
        latitude: readString(v, 'latitude'),
        longitude: readString(v, 'longitude'),
      }),
  },
];

/** Index par identifiant pour un accès direct. */
export const PAYLOAD_TYPES_BY_ID: Record<string, PayloadType> = Object.fromEntries(
  PAYLOAD_TYPES.map((type) => [type.id, type]),
);

/** Récupère une définition de type, ou lève une erreur si l'identifiant est inconnu. */
export function getPayloadType(id: string): PayloadType {
  const type = PAYLOAD_TYPES_BY_ID[id];
  if (!type) throw new Error(`Type de QR inconnu : ${id}`);
  return type;
}

/**
 * Indique si toutes les valeurs requises d'un type sont renseignées.
 * Sert à l'UI pour ne générer le QR que lorsque le formulaire est exploitable.
 */
export function isReady(type: PayloadType, values: FieldValues): boolean {
  return type.fields
    .filter((field) => field.required)
    .every((field) => readString(values, field.name).trim() !== '');
}

export * from './types';
