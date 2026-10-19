import type { Transform } from 'jscodeshift';
import { red } from '../../brand-refresh/transformers/utils';

/**
 * Klear360 v13 aligns `Dropdown`'s `onOpenChange` with the object-wrapped signature every other
 * overlay component (`DatePicker`, `Popover`, `Tooltip`, `Menu`, `TimePicker`,
 * `SpotlightPopoverTour`) already uses: `({ isOpen }: { isOpen: boolean }) => void` instead of a
 * bare `(isOpen: boolean) => void`. This only touches `onOpenChange` on a JSX element literally
 * named `Dropdown` - not `DropdownOverlay`/`DropdownButton`/etc, and not another component's own
 * `onOpenChange` (e.g. `DatePicker`, `Popover`) which is already in the new shape.
 */
const isDropdownElement = (openingElement: { name: { type: string; name?: string } }): boolean =>
  openingElement.name.type === 'JSXIdentifier' && openingElement.name.name === 'Dropdown';

const transformer: Transform = (file, api, options) => {
  // Don't transform if the file doesn't import `@klear/klear360/components` because it's not using Klear360 components
  // Allow the migration test file to be transformed
  if (!file.source.includes('@klear/klear360/components') && file.path !== undefined) {
    return file.source;
  }

  const j = api.jscodeshift;
  const root = j.withParser('tsx')(file.source);
  let hasChanges = false;

  try {
    root
      .find(j.JSXAttribute, { name: { name: 'onOpenChange' } })
      .filter((path) => {
        const openingElement = path.parent.node;
        return openingElement?.type === 'JSXOpeningElement' && isDropdownElement(openingElement);
      })
      .forEach((path) => {
        const value = path.node.value;
        if (value?.type !== 'JSXExpressionContainer') {
          return;
        }

        const expression = value.expression;

        // onOpenChange={setIsOpen} -> onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
        if (expression.type === 'Identifier') {
          hasChanges = true;
          const property = j.property('init', j.identifier('isOpen'), j.identifier('isOpen'));
          property.shorthand = true;
          value.expression = j.arrowFunctionExpression(
            [j.objectPattern([property])],
            j.callExpression(j.identifier(expression.name), [j.identifier('isOpen')]),
          );
          return;
        }

        // onOpenChange={(isOpen) => ...} -> onOpenChange={({ isOpen }) => ...} (body untouched,
        // so references to the original param name keep working)
        if (
          (expression.type === 'ArrowFunctionExpression' ||
            expression.type === 'FunctionExpression') &&
          expression.params.length === 1 &&
          expression.params[0].type === 'Identifier'
        ) {
          const paramName = expression.params[0].name;
          hasChanges = true;
          const property = j.property('init', j.identifier('isOpen'), j.identifier(paramName));
          property.shorthand = paramName === 'isOpen';
          expression.params[0] = j.objectPattern([property]);
        }
      });
  } catch (error) {
    console.error(
      red(`⛔️ ${file.path}: Oops! Ran into an issue while migrating Dropdown's "onOpenChange".`),
      `\n${red(error.stack)}\n`,
    );
  }

  return hasChanges ? root.toSource(options.printOptions) : file.source;
};

export default transformer;
