/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_GOOGLE_KEY: string;
    readonly VITE_APP_API_URL: string;

    // Add other environment variables here...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  