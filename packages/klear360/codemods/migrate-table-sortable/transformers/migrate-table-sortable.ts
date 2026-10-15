import type { Transform } from 'jscodeshift';
import { red } from '../../brand-refresh/transformers/utils';

/**
 * `TableColumnConfig` (Table's `columns` prop) and the column-config shapes consumers commonly
 * build on top of it always carry a `render` or `header` field alongside `sortable` - this is
 * used to avoid renaming an unrelated `sortable` property that happens to live on some other
 * object.
 */
const looksLikeColumnConfig = (keys: string[]): boolean =>
  keys.includes('sortable') && (keys.includes('render') || keys.includes('header'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPropertyKeyName = (property: any): string | undefined => {
  if (property?.key?.type === 'Identifier') {
    return property.key.name;
  }
  if (property?.key?.type === 'StringLiteral' || property?.key?.type === 'Literal') {
    return String(property.key.value);
  }
  return undefined;
};

// The babel-backed `tsx` parser types object-literal properties as `ObjectProperty`, not the
// estree-style `Property` - accept both so this works regardless of which parser produced the AST.
const isObjectProperty = (property: { type: string }): boolean =>
  property.type === 'ObjectProperty' || property.type === 'Property';

const transformer: Transform = (file, api, options) => {
  // Don't transform if the file doesn't import `@klear/klear360/components` because it's not using Klear360 components
  // Allow the migration test file to be transformed
  if (!file.source.includes('@klear/klear360/components') && file.path !== undefined) {
    return file.source;
  }

  const j = api.jscodeshift;
  const root = j.withParser('tsx')(file.source);
  let hasChanges = false;

  // Rename `sortable` -> `isSortable` on object literals shaped like a `TableColumnConfig`
  // (e.g. entries of Table's `columns` prop, or a consumer's own column-config helper).
  try {
    root.find(j.ObjectExpression).forEach((path) => {
      const properties = path.node.properties.filter(isObjectProperty);
      const keys = properties.map(getPropertyKeyName).filter((key): key is string => Boolean(key));

      if (!looksLikeColumnConfig(keys)) {
        return;
      }

      properties.forEach((property) => {
        if (getPropertyKeyName(property) !== 'sortable') {
          return;
        }

        hasChanges = true;
        if (property.shorthand) {
          property.shorthand = false;
          property.value = j.identifier('sortable');
        }
        property.key = j.identifier('isSortable');
      });
    });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while renaming "sortable" object properties.`),
      `\n${red(error.stack)}\n`,
    );
  }

  // Rename `sortable` -> `isSortable` on local TypeScript type/interface shapes that mirror
  // `TableColumnConfig` (e.g. a consumer's own column-config type built on top of it).
  try {
    root.find(j.TSTypeLiteral).forEach((path) => {
      const members = path.node.members.filter((member) => member.type === 'TSPropertySignature');
      const keys = members.map(getPropertyKeyName).filter((key): key is string => Boolean(key));

      if (!looksLikeColumnConfig(keys)) {
        return;
      }

      members.forEach((member) => {
        if (getPropertyKeyName(member) !== 'sortable') {
          return;
        }

        hasChanges = true;
        member.key = j.identifier('isSortable');
      });
    });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while renaming "sortable" type members.`),
      `\n${red(error.stack)}\n`,
    );
  }

  return hasChanges ? root.toSource(options.printOptions) : file.source;
};

export default transformer;
