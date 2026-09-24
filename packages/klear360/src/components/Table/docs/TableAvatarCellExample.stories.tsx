import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Table } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableData, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Avatar } from '~components/Avatar';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Avatar Cells',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

// Deterministic (not Math.random) so a given row's image is stable across re-renders, matching
// how a real user/company id would consistently resolve to the same photo/logo URL.
const hashString = (value: string): number =>
  Math.abs(value.split('').reduce((hash, char) => hash * 31 + char.charCodeAt(0), 0));

const PALETTE = ['#2F6FED', '#E8590C', '#2B8A3E', '#9C36B5', '#0C8599', '#C2255C'];

// These generate plain SVG data URIs rather than fetching real photos/flags/logos, so the story
// renders identically offline and in CI - but each one is deliberately much larger than the cell
// it'll be placed in (400x400 for a "profile photo", 480x160 for a "company logo"), because that
// mismatch - a source image far bigger than its intended cell - is the whole scenario this story
// is about. A real avatar upload or a fetched flag/logo asset is exactly as unpredictably sized.
const makeAvatarSrc = (seed: string): string => {
  const color = PALETTE[hashString(seed) % PALETTE.length];
  const initials = seed
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${color}"/><text x="200" y="245" font-family="sans-serif" font-size="150" font-weight="600" fill="white" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const makeFlagSrc = (countryCode: string): string => {
  const stripeColors = [
    PALETTE[hashString(countryCode) % PALETTE.length],
    '#FFFFFF',
    PALETTE[(hashString(countryCode) + 1) % PALETTE.length],
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">${stripeColors
    .map(
      (color, index) => `<rect x="${index * 100}" y="0" width="100" height="200" fill="${color}"/>`,
    )
    .join('')}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const makeLogoSrc = (companyName: string): string => {
  const color = PALETTE[hashString(companyName) % PALETTE.length];
  const mark = companyName.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160"><rect width="480" height="160" rx="24" fill="${color}"/><text x="240" y="105" font-family="sans-serif" font-size="90" font-weight="700" fill="white" text-anchor="middle">${mark}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const avatarCellsExampleData = createTransactionTableData(8);

/**
 * `TableColumnConfig['render']` can return anything, including a raw `<img>` - but an `<img>`
 * with no `width`/`height` of its own renders at its *own* intrinsic size (the source image's
 * actual pixel dimensions) no matter how its parent is sized. Sizing only the wrapping `Box` -
 * giving it a fixed `width`/`height` and leaving the `<img>` inside unconstrained - doesn't fix
 * that, since the `<img>` isn't a flex/grid item that shrinks to fit by default; it just keeps
 * being however large the source file is, and overflows (or gets randomly clipped, depending on
 * the wrapper's own `overflow`) rather than filling its box.
 *
 * The fix needs both halves: the wrapping `Box` gets the fixed cell size (`width`/`height`,
 * `overflow="hidden"` so a mismatched aspect ratio still clips cleanly instead of stretching the
 * row), *and* the `<img>` itself is told to fill that box (`width: '100%', height: '100%'` in its
 * own `style`, since `width`/`height` are native `<img>` attributes/CSS, not `Box` styled props)
 * plus an `objectFit` to decide how it fills: `'cover'` crops to fill the box completely (fine
 * for avatars/flags, where a small crop at the edges doesn't matter), `'contain'` letterboxes
 * instead of cropping (better for a logo/wordmark, where cropping could cut off part of the mark).
 *
 * For an actual user avatar specifically, prefer the design system's own `Avatar` component (used
 * for "Filed By" below) over hand-rolling this - it already implements exactly this two-part
 * pattern internally (a fixed-size wrapper plus a separately-sized `img` with `objectFit: 'cover'`
 * inside), so a photo of any source resolution renders correctly at whatever `size` you pick
 * without you having to think about any of the above. The flag and logo columns below have no
 * equivalent dedicated component, so they apply the same pattern by hand.
 */
export const AvatarLogoAndFlagCells = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    {
      key: 'transactionId',
      header: 'Transaction ID',
      render: (item) => <Code size="medium">{item.transactionId}</Code>,
      width: '150px',
    },
    {
      key: 'filedBy',
      header: 'Filed By',
      render: (item) => (
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Avatar size="small" name={item.username} src={makeAvatarSrc(item.username)} />
          <Text size="medium">{item.username}</Text>
        </Box>
      ),
      width: '200px',
    },
    {
      key: 'companyName',
      header: 'Company',
      render: (item) => (
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Box
            width="40px"
            height="28px"
            borderRadius="small"
            overflow="hidden"
            flexShrink={0}
            backgroundColor="surface.background.gray.subtle"
          >
            <img
              src={makeLogoSrc(item.companyName)}
              alt={`${item.companyName} logo`}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </Box>
          <Text size="medium">{item.companyName}</Text>
        </Box>
      ),
      width: '260px',
    },
    {
      key: 'countryOfExport',
      header: 'Country',
      render: (item) => {
        const countryCode = item.countryOfExport.slice(0, 2);
        return (
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Box width="28px" height="20px" borderRadius="small" overflow="hidden" flexShrink={0}>
              <img
                src={makeFlagSrc(countryCode)}
                alt={`Flag of ${item.countryOfExport}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
            <Text size="medium">{item.countryOfExport}</Text>
          </Box>
        );
      },
      width: '220px',
    },
    {
      key: 'transactionState',
      header: 'Transaction State',
      render: (item) => (
        <Badge size="medium" color={getTransactionStateColor(item.transactionState)}>
          {item.transactionState}
        </Badge>
      ),
      width: '150px',
    },
  ];

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Avatar, Logo, and Flag Cells</Heading>
        <Text>
          `Filed By` uses the design system&apos;s own `Avatar` component; `Company` and `Country`
          hand-roll the same fixed-box-plus-sized-`img` pattern for logos and flags, which have no
          dedicated component of their own.
        </Text>
      </Box>
      <Table data={avatarCellsExampleData} columns={columns} />
    </Box>
  );
};

/**
 * The bug this whole pattern avoids: the wrapping `Box` is sized (32x32px, same as
 * `AvatarLogoAndFlagCells`&apos;s working columns), but the `<img>` inside it has no `width`/
 * `height` of its own. The source image here is a deliberately oversized 400x400 SVG - the same
 * one `AvatarLogoAndFlagCells` uses for its (correctly-sized) avatars - so this renders it at its
 * real, literal, un-shrunk 400x400 size, spilling out of its 32x32 box and over the rows around
 * it. This story exists purely as the "before" - nothing here is a pattern to copy.
 */
export const UnconstrainedImageBug = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    {
      key: 'transactionId',
      header: 'Transaction ID',
      render: (item) => <Code size="medium">{item.transactionId}</Code>,
      width: '150px',
    },
    {
      key: 'filedBy',
      header: 'Filed By (broken)',
      render: (item) => (
        <Box display="flex" alignItems="center" gap="spacing.3">
          {/* Sized wrapper, unsized `img` - the bug. Compare to the working `Avatar`/logo/flag
              cells in `AvatarLogoAndFlagCells`, where the `<img>` also gets `width`/`height`. */}
          <Box width="32px" height="32px" borderRadius="max" flexShrink={0}>
            <img src={makeAvatarSrc(item.username)} alt={item.username} />
          </Box>
          <Text size="medium">{item.username}</Text>
        </Box>
      ),
      width: '260px',
    },
    {
      key: 'companyName',
      header: 'Company',
      render: (item) => item.companyName,
      width: '220px',
    },
  ];

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Unconstrained Image Bug</Heading>
        <Text>
          `Filed By (broken)`&apos;s wrapper `Box` is 32x32px, but its image element has no
          `width`/`height` - so the 400x400 source image renders at its real size instead of filling
          that box, overflowing into the surrounding rows.
        </Text>
      </Box>
      <Table data={avatarCellsExampleData} columns={columns} />
    </Box>
  );
};

export default TableMeta;
