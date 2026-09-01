/// <reference types="vite/client" />

declare module "*.docx" {
  const src: string;
  export default src;
}

declare module "*.tex" {
  const src: string;
  export default src;
}
