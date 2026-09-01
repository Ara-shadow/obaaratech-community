/// <reference types="vite/client" />

declare module "*.css" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.scss" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.sass" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.less" {
    const content: { [className: string]: string };
    export default content;
}

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // Add other env variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}