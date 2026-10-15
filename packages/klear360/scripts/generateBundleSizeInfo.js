const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const execa = require('execa');
// eslint-disable-next-line import/no-extraneous-dependencies
const prettier = require('prettier');

// Folders re-exported from src/components/index.ts that aren't individually-sized components.
const excludedPublicPaths = ['Icons', 'Form', 'types'];

// Derive the component index paths from src/components/index.ts (the package's declared public
// API) rather than globbing the build output recursively. The build directory contains many
// internal, non-public barrel files (style helpers, base/internal implementation folders, etc.)
// nested under component folders; globbing for every `index.js` under `components/**` picks
// those up too, inflating the measured component count with entries that aren't part of the
// public API and making the result non-reproducible across builds.
const getPublicIndexPaths = () => {
  const componentsIndexContent = fs.readFileSync(
    path.resolve(__dirname, '../src/components/index.ts'),
    'utf8',
  );

  const publicPaths = [...componentsIndexContent.matchAll(/export \* from '\.\/([^']+)'/g)]
    .map(([, publicPath]) => publicPath)
    .filter((publicPath) => !excludedPublicPaths.includes(publicPath));

  return publicPaths
    .map((publicPath) => `build/lib/web/production/components/${publicPath}/index.js`)
    .filter((indexPath) => fs.existsSync(path.resolve(__dirname, `../${indexPath}`)));
};

const main = async () => {
  const indexPaths = getPublicIndexPaths();

  const excludedComponents = [
    'useTheme',
    'announce',
    'clearAnnouncer',
    'destroyAnnouncer',
    'getTextProps',
    'screenReaderStyles',
    'useActionListContext',
    'ActionListItemAsset', // This is just an <img> tag
    // These are same as Badge, Amount, Counter, Link, Text components excluding them to save total script runtime
    'CardHeaderAmount',
    'CardHeaderBadge',
    'CardHeaderCounter',
    'CardHeaderLink',
    'CardHeaderText',
    'ComponentIds',
    // Accessibility components
    'SkipNavContent',
    'SkipNavLink',
    'VisuallyHidden',
    // Not exposed to the user
    'NavigationButton',
    'CheckboxIcon',
    'PopupArrow',
  ];
  const sizes = [];

  const runSizeLimit = ({ name, importedComponents }) => {
    // Write size-limit configuration to .size-limit.json for each component
    fs.writeFileSync(
      path.resolve(__dirname, '../.size-limit.json'),
      JSON.stringify(
        [
          {
            name,
            path: './build/lib/web/production/components/index.js',
            import: importedComponents,
            // Set high limit for the component size so that it doesn't fail the size-limit check
            limit: '2000 kb',
            running: false,
            gzip: true,
          },
        ],
        null,
        2,
      ),
    );

    // Run size-limit command and capture the output to gather size information
    const { stdout } = execa.commandSync('yarn size-limit --json');

    // Process the size-limit output to extract relevant information
    const jsonLikeString = stdout
      .split('\n') // remove new line chars => []
      .map((item) => item.trim()) // remove whitespace
      .filter((item) => item !== '') // filter empty array items
      .join('');

    sizes.push(
      JSON.parse(
        jsonLikeString.substring(jsonLikeString.indexOf('[') + 1, jsonLikeString.indexOf(']')),
      ),
    );
  };

  // Run size-limit for the empty import to get the base project size
  runSizeLimit({ name: 'Base', importedComponents: '{}' });

  // Get all the components name exported from the bundle and add them to the size-limit configuration
  indexPaths.forEach((indexPath) => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, `../${indexPath}`), 'utf8');

    // Parse the file content to generate an AST
    const ast = babelParser.parse(fileContent, {
      sourceType: 'module',
    });
    // Arrays to store size-limit stats and component names to exclude
    const exportedComponents = [];

    // Traverse the AST to get the component names
    traverse(ast, {
      // Get the component name from the export statement
      ExportSpecifier: ({ node }) => {
        const componentName = node.exported.name;

        // We don't want to add Icon components to the size-limit configuration
        if (
          !(
            excludedComponents.includes(componentName) ||
            componentName.startsWith('Base') ||
            componentName === 'default'
          )
        ) {
          exportedComponents.push(componentName);
        }
      },
    });

    if (exportedComponents.length > 0) {
      const imports = exportedComponents.join(', ');

      runSizeLimit({ name: imports, importedComponents: `{ ${imports} }` });
    }
  });

  // Write the gathered size information to the specified file
  const filename = process.env.BUNDLE_SIZE_STATS_FILENAME || 'prBundleSizeStats.json';
  // Format the file content using prettier & write it to the file
  fs.writeFileSync(
    path.resolve(__dirname, `../${filename}`),
    prettier.format(JSON.stringify(sizes), {
      parser: 'json',
    }),
  );
};

main();
