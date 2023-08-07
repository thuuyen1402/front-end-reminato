/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_WEB_APP_PORT: number
  readonly VITE_SERVER_API_URL: string
  readonly VITE_SERVER_NOTIFY_API_URL: string

}

interface ImportMeta {
  readonly env: ImportMetaEnv
}