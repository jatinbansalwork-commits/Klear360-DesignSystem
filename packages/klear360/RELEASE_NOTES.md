# Release notes

What changed, and why it mattered. You're on `v0.5.5`.

> This is the human-readable story of the project — also published in Storybook under
> **Guides → Release Notes**. For the exact, version-accurate technical changelog (what
> `@klear/klear360`'s published npm version actually ships), see [`CHANGELOG.md`](./CHANGELOG.md).

## v0.5.5 · Oct 21, 2026

The big tidy-up. We checked every loading spinner, every "nothing here yet" moment, and every
disabled button across the whole kit, to make sure none of them were improvising. Two things fell
out of that: typing into a dropdown search with zero matches currently just... goes quiet, and a
very long list of options can get a little too enthusiastic about redrawing itself while you type.
Both are being fixed properly, not patched. Also added a note for anyone using the AI chat
components: they're the heaviest thing in the kit, and now there's a short guide on loading them
only when you actually need them.

## v0.5.4 · Oct 20, 2026

The counter input's little slide animation could get cut short if you clicked fast enough — fixed,
with a test that proves it stays fixed. The two "copy to clipboard" buttons in the AI components
were quietly running two separate copies of the same logic; now there's one. Also went looking for
tangled, circular wiring between files across the whole kit — found plenty, checked every one by
hand, and confirmed none of it was ever actually a problem.

## v0.5.3 · Oct 19, 2026

Behind-the-scenes week. Fixed a broken connection between the design kit and the AI coding
assistant that reads it (it was pointing at a folder that didn't exist anymore). Wrote down a rule
so that never happens again: one real copy of this project per machine, not a handful of drifting
clones. Also checked every "ref" passed around the kit and confirmed each one goes exactly where
it's supposed to.

## v0.5.2 · Oct 18, 2026

Dropdown's "did it open or close" callback used to speak a different shape than every other
overlay in the kit — the one component where a shared handler quietly wouldn't work. Aligned it
with the rest, with a proper upgrade path for anyone already using the old shape.

## v0.5.1 · Oct 17, 2026

Went through every component's props with a fine comb — sizes, booleans, callbacks, labels — to
make sure "small" means the same thing everywhere and "isLoading" always works the way you'd
expect. Found exactly one real inconsistency in the whole kit (a table prop that didn't follow the
naming convention) and logged it for a proper rename later, since renaming a prop without warning
isn't something we do lightly.

## v0.5.0 · Oct 16, 2026

### Measure Twice, Ship Once

By this point the kit had grown a lot, which is exactly when small inconsistencies start sneaking
in — one component calling it `isOpen`, another calling it `open`; one spinner meaning "loading,"
another meaning "disabled." So we stopped adding new things for a week and just checked. Every
prop, every callback, every loading state, every animation timer, compared against every other
component that does something similar. Most of it held up. The few things that didn't got written
down honestly instead of quietly patched over, and the real bugs got fixed with tests proving they
stay fixed.

## v0.4.14 · Oct 15, 2026

A proper migration guide for breaking changes now ships alongside the kit, plus a small script that
rewrites your code automatically when a prop gets renamed — no more find-and-replace by hand.

## v0.4.13 · Oct 14, 2026

Added tests that actually open a real browser for the handful of things a plain snapshot can't
catch — a dropdown really opening in the right spot, a drag gesture really working, an animation
really finishing.

## v0.4.12 · Oct 13, 2026

Table grew up: sorting, filtering, selecting across pages, and editing a cell right where it sits,
all without leaving the row you're on.

## v0.4.11 · Oct 12, 2026

Table got noticeably faster with big lists — scrolling through a few thousand rows now feels the
same as scrolling through ten.

## v0.4.10 · Oct 11, 2026

A Figma plugin landed. Designers can now check their file against the real, shipped components
instead of trusting a screenshot someone exported three versions ago.

## v0.4.9 · Oct 10, 2026

The kit now has its own AI coding assistant plugged in, so pulling up the right component and its
docs happens automatically while you're building, instead of tab-switching to look it up.

## v0.4.8 · Oct 9, 2026

Every bit of text in the kit is now translation-ready. Shipping in another language is a
configuration change now, not a rewrite.

## v0.4.7 · Oct 8, 2026

Went through every input and button and made sure a screen reader hears what a sighted person
sees — not an approximation of it, the actual thing.

## v0.4.6 · Oct 7, 2026

Tested every overlay with nothing but a keyboard — tab, escape, arrow keys — until all of them
behaved the way your hands expect, not just the way a mouse would.

## v0.4.5 · Oct 6, 2026

Visual regression screenshots are now taken automatically on every change. If a pixel moves without
anyone asking it to, somebody will see it before it ships.

## v0.4.4 · Oct 5, 2026

Confirmed, with real numbers, that importing one button doesn't quietly drag the rest of the
toolbox along with it. You only pay for what you use.

## v0.4.3 · Oct 4, 2026

The kit now tracks its own weight automatically. If a change makes something heavier, you'll see it
on the next review, not three months later when someone finally notices the app feels slower.

## v0.4.2 · Oct 3, 2026

Every component page now shows, at a glance, whether it works on phones and tablets too, not just
the web.

## v0.4.1 · Oct 2, 2026

Style and formatting checks now run automatically on every change, so nobody has to spend a code
review arguing about semicolons again.

## v0.4.0 · Oct 1, 2026

### Built to Last

For the first month and a half, "it works" mostly meant "it worked when I checked it on my
machine." That stops being good enough once more than one person is relying on something. So this
month was about turning the kit into something a whole team could trust without re-checking it
themselves — automated style checks, automated size checks, automated screenshots, real keyboard
and screen-reader testing, and the first outside tools (an AI assistant, a Figma plugin) that read
the kit directly instead of through someone's notes.

## v0.3.14 · Sep 30, 2026

The documentation site finally feels like a place worth visiting — real examples you can play with,
not just a list of prop names and their types.

## v0.3.13 · Sep 29, 2026

Segmented controls and counter inputs joined the family. The small, easy-to-overlook components
finally got the same care as the big ones.

## v0.3.12 · Sep 28, 2026

A carousel component arrived — swipe it on a touchscreen, arrow-key it on a laptop, same component
either way.

## v0.3.11 · Sep 27, 2026

A proper "nothing to show here" component. The empty state you see when a search comes up blank or
a list hasn't loaded anything yet is now something we designed on purpose, not something we left
blank and hoped nobody would notice.

## v0.3.10 · Sep 26, 2026

File upload landed — drag a file in, watch it actually upload, see a real error if it fails. No
more pretending a spinner is progress.

## v0.3.9 · Sep 25, 2026

Every color pairing in the kit now gets checked for contrast automatically. If something's
technically on the screen but practically invisible, it gets caught before anyone has to squint.

## v0.3.8 · Sep 24, 2026

Bottom sheets for mobile — the same thoughtful overlay experience small screens deserve, instead of
a desktop modal squeezed down to fit.

## v0.3.7 · Sep 23, 2026

A spotlight tour component, for walking someone through a screen one highlighted step at a time —
handy for onboarding, handy for "here's what's new."

## v0.3.6 · Sep 22, 2026

Chat messages can now hold more than text — badges, cards, even a small chart, straight out of an
AI response and into something that actually looks designed.

## v0.3.5 · Sep 21, 2026

The chat input component arrived — the typing box behind the AI assistant, attachments included.

## v0.3.4 · Sep 20, 2026

Toasts, tooltips, and popovers learned to get out of each other's way instead of occasionally
stacking on top of one another like an argument nobody won.

## v0.3.3 · Sep 19, 2026

If someone's told their device they'd prefer less motion, the kit now actually listens, everywhere,
not just in the one place we remembered to check first.

## v0.3.2 · Sep 18, 2026

A real motion system shipped — every animation's speed and easing now comes from the same shared
place as the colors and spacing, instead of each component guessing its own.

## v0.3.1 · Sep 17, 2026

Dark mode, done properly. Every color token flips with it — nothing left glowing white in a dark
room because someone forgot one corner.

## v0.3.0 · Sep 16, 2026

### The Human Touches

The kit had all the right pieces by now, but pieces aren't the same as something that feels
considered. This stretch was about the details you only notice when they're missing: motion that
respects how a person actually wants to move through a screen, dark mode that isn't a last-minute
color inversion, and a whole new family of components for the thing everyone was suddenly
building — chat interfaces for AI.

## v0.2.14 · Sep 15, 2026

Phone number and one-time-code inputs, built for the one moment nobody wants to think about input
formatting at all.

## v0.2.13 · Sep 14, 2026

A tree view component, for anything with branches — folders, categories, an org chart, whatever
needs to nest.

## v0.2.12 · Sep 13, 2026

A real pagination component. "Page 1 of 47" deserved better than an afterthought, so it got one.

## v0.2.11 · Sep 12, 2026

Charts arrived — bar, line, area, donut — all speaking the same color language instead of four
different opinions about what "positive" should look like.

## v0.2.10 · Sep 11, 2026

A menu component, for the moments you need a short list of actions without the full weight of a
dropdown page behind it.

## v0.2.9 · Sep 10, 2026

Modal and Drawer shipped — the two polite ways to interrupt someone, depending on how much you
need their attention.

## v0.2.8 · Sep 9, 2026

Breadcrumbs landed, so nobody gets more than one click lost in a deep page.

## v0.2.7 · Sep 8, 2026

Tabs and a top navigation bar, for the moments a full side navigation is more ceremony than the
page actually needs.

## v0.2.6 · Sep 7, 2026

Side navigation shipped, with sections that collapse and a mobile mode that doesn't just shrink —
it rethinks itself.

## v0.2.5 · Sep 6, 2026

Select input and multi-select arrived, both built on the same dropdown underneath — one mental
model, reused everywhere it fits.

## v0.2.4 · Sep 5, 2026

Table, version one. Headers, rows, pagination. Nothing fancy yet, but solid ground to build on.

## v0.2.3 · Sep 4, 2026

Time picker shipped, built with the same instincts and shortcuts as its calendar sibling.

## v0.2.2 · Sep 3, 2026

Date picker arrived, ranges and presets included, with a mobile layout that doesn't fight with your
thumb.

## v0.2.1 · Sep 2, 2026

Dropdown shipped — quietly the most important overlay in the kit, since half of what comes later is
built on top of it.

## v0.2.0 · Sep 1, 2026

### Room to Grow

The foundation worked. Now it was time to build the rooms people actually spend their day in:
dropdowns, calendars, tables, the navigation that holds a whole app together. Less "does this
exist," more "does this hold up under real use."

## v0.1.16 · Aug 31, 2026

The first real test suite shipped, covering everything built so far. "It worked when I checked"
quietly became "it's checked every time, automatically."

## v0.1.15 · Aug 30, 2026

Confirmed every component built so far works on phones too, not just the web — one codebase, both
platforms, no asterisks.

## v0.1.14 · Aug 29, 2026

Divider, Skeleton, and Spinner shipped — the quiet components that hold a layout together while
something else is loading.

## v0.1.13 · Aug 28, 2026

Avatar and Chip arrived, for showing who's involved in something and what's currently selected.

## v0.1.12 · Aug 27, 2026

Tooltip and Popover shipped — the first two components that actually had to know where they were on
the screen and flip out of the way of an edge.

## v0.1.11 · Aug 26, 2026

Textarea and a counter input landed, for the moments one line of text isn't enough, or a number
needs its own buttons.

## v0.1.10 · Aug 25, 2026

Password input and search input arrived, built on the same foundation as the text input, so
switching between them never feels like relearning anything.

## v0.1.9 · Aug 24, 2026

The real text input shipped — labels, helper text, error states, all built in from the start
instead of bolted on later.

## v0.1.8 · Aug 23, 2026

Switch and Badge arrived — small, honest components that almost every screen needs somewhere.

## v0.1.7 · Aug 22, 2026

Checkbox and Radio shipped, with proper keyboard support from day one. No mouse required, ever.

## v0.1.6 · Aug 21, 2026

Button landed, with every state it would ever need — loading, disabled, icon-only — built in from
the start rather than added later as an exception.

## v0.1.5 · Aug 20, 2026

Text and Heading components arrived. Typography you write in code, instead of styling by hand every
time.

## v0.1.4 · Aug 19, 2026

Box shipped — the quiet component almost everything else in the kit ends up standing on.

## v0.1.3 · Aug 18, 2026

The theme provider arrived. Wrap your app in it once, and every component below knows who it is and
what it should look like.

## v0.1.2 · Aug 17, 2026

Typography and spacing scales defined, so "a little bigger" and "a bit more room" stopped being
guesses and started being a shared number.

## v0.1.1 · Aug 16, 2026

Color tokens defined — one palette, one source of truth, instead of every screen quietly picking
its own shade of blue.

## v0.1.0 · Aug 15, 2026

### Day One

A design system doesn't start with components. It starts with a decision: stop letting every screen
reinvent the same button, the same spacing, the same shade of blue, slightly differently each time.
The brief was simple to say and a lot of work to mean: one shared language for colors, type, and
space, built to work the same way on web and mobile, that any component could be built on top of
from here on. Nothing flashy shipped today. Just the ground everything else now stands on.
