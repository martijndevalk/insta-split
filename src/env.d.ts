/// <reference types="astro/client" />

/** CSS Module type declarations */
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
