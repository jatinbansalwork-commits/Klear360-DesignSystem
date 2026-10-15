// `@table-library/react-table-library` ships this subpath's runtime as a sibling `table.js` file
// and its types as `table/index.d.ts`. Our moduleResolution ("node") doesn't rewrite a `.js`
// specifier to its `.d.ts` counterpart the way `bundler`/`node16` would, so the extension-ed
// specifier we must use at runtime (for strict ESM resolution) has no types of its own - alias it
// to the properly-typed extensionless specifier instead.
//
// This has to live in a file with no top-level import/export of its own: once a `.d.ts` file has
// one, TS treats it as a module file, where `declare module` only augments already-typed modules
// rather than declaring a brand-new ambient one.
declare module '@table-library/react-table-library/table.js' {
  export * from '@table-library/react-table-library/table';
}
declare module '@table-library/react-table-library/virtualized.js' {
  export * from '@table-library/react-table-library/virtualized';
}
declare module '@table-library/react-table-library/theme.js' {
  export * from '@table-library/react-table-library/theme';
}
declare module '@table-library/react-table-library/sort.js' {
  export * from '@table-library/react-table-library/sort';
}
declare module '@table-library/react-table-library/pagination.js' {
  export * from '@table-library/react-table-library/pagination';
}
declare module '@table-library/react-table-library/select.js' {
  export * from '@table-library/react-table-library/select';
}
declare module '@table-library/react-table-library/tree.js' {
  export * from '@table-library/react-table-library/tree';
}
