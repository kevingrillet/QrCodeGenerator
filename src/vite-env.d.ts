/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Thème visuel choisi au build : default | atelier | blueprint | aurora. */
  readonly VITE_THEME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
