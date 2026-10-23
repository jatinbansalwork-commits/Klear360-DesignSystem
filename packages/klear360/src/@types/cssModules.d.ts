// Must stay free of top-level imports/exports: a wildcard `declare module` only works as an
// ambient declaration in a script file, not as an augmentation inside a module.
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
