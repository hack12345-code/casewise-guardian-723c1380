
/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
