# Klear360 re-audit findings

Source: adversarial re-audit of 3 September 2026 (after the color-file apply). Audit only — this file is the complete recorded list, not a live status board. Subsequent work may have closed some rows.

`LICENSE.md` still contains `Copyright (c) 2020 Razorpay` and was left untouched.

**Verdict:** still not ready as a standalone system. Batches 1, 3, and 4 hold. Batch 2 and the origin-docs pass do not.

---

## Step results

| Step | Result | What held | What failed |
| --- | --- | --- | --- |
| 1 Colors | Pass | Zero `hsla(218, 89%, 51%)` in the repo. Both `colors.ts` files are identical. createTheme web/native snaps resolve `azure.500` to `hsla(198, 100%, 18%)`. `theme.css` and Storybook primary match. Brand 500s were not reverted. | Tokens still use HSLA syntax (the token format, not hex literals). `ashGray*` still original Blade neutrals — the supplied palette file did not replace them. |
| 2 Fintech | Partial | ThemePlayground content is Workspace. `TopNav.stories.tsx` and `Dashboard.md` are clean. PaymentInput `decisions.md` gone. Listed BottomSheet / tooltip / placeholder / spatial RFC items updated. Three listed icon descriptions rewritten. | `Checkout/` folder still exists and still contains `klear360-qr-code.png`. `PaymentInput/_decisions` still has a card-anatomy PNG. `/magic-checkout`, UPI, Paytm, Payout still live across stories, tests, and MCP docs. |
| 3 Fonts | Pass | TASA gone from pbxproj and Android. No Lato. No Menlo. Native code font is Roboto Mono. `upgrade-v11` and font RFC instruct Inter/Roboto/Roboto Mono. Menlo decision was remove — applied. | None of the listed font items failed. |
| 4 Provenance | Pass | Plugin authors are Klear. Real names replaced with Maya Chen / Jordan Hale / etc. Segment TODO gone. Flipper LICENSE pointers gone. | Two plugin `package.json` authors are empty strings (not employee names). |
| 5 Fresh pass | Fail | Case-insensitive `blade` / `razorpay` / `tasa` / `@razorpay` only hits `LICENSE.md` (plus a `yarn.lock` integrity hash false positive). i18n README says vendored. | Dead `github.com/klear/*` links, Intro.mdx + upgrade-v11 Blade skeleton, KlearX mechanical renames, workspace folder still Untitled, leftover Checkout QR + PaymentInput anatomy PNGs. |

---

## Critical

| Risk | Step | File path | Line | What was found | Required fix |
| --- | --- | --- | --- | --- | --- |
| Critical | 2 | `packages/klear360/src/storybook-recipes/ThemePlayground/Checkout/klear360-qr-code.png` | — | Folder was not renamed away from Checkout. It still holds a leftover QR asset from the old checkout recipe. | Delete the Checkout directory and the PNG. |
| Critical | 2 | `packages/klear360/src/components/Input/PaymentInput/_decisions/payment-input-anatomy.png` | — | `decisions.md` was deleted; a card-form screenshot remains (Card Details, Mastercard, John Doe, CVV). | Delete `PaymentInput/` entirely — it is not a real component. |
| Critical | 2 | `packages/klear360/src/components/TopNav/docs/code.ts` | 189–190 | `href: "/magic-checkout"`, `title: "Express Checkout"` | Same Projects /insights swap as stories, or drop those demo items. |
| Critical | 2 | `packages/klear360/src/components/TopNav/docs/code.ts` | 546–547 | `href: '/magic-checkout'`, `title: 'Express Checkout'` | Same Projects /insights swap as stories, or drop those demo items. |
| Critical | 2 | `packages/klear360/src/components/TopNav/docs/TabNav.stories.tsx` | 223–224 | `href: '/magic-checkout'`, `title: 'Express Checkout'` | Same Projects /insights swap as stories, or drop those demo items. |
| Critical | 2 | `packages/klear360/src/components/TopNav/__tests__/TabNav.test.stories.tsx` | 39–40 | `href: '/magic-checkout'`, `title: 'Express Checkout'` | Same Projects /insights swap as stories, or drop those demo items. |
| Critical | 2 | `packages/klear360/src/components/TopNav/__tests__/TabNav.test.stories.tsx` | 150–151, 165 | Assertions still look up the `Express Checkout` link / menuitem. | Update assertions after the demo item is renamed or dropped. |
| Critical | 2 | `packages/klear360/src/components/TopNav/__tests__/TopNavExample.web.tsx` | 36 | `href: '/magic-checkout'` | Same Projects /insights swap as stories, or drop those demo items. |
| Critical | 2 | `packages/klear360/src/components/TopNav/_decisions/decisions.md` | 505 | `<ExploreItem title="Express Checkout" …>` | Neutral product name in the decision example. |
| Critical | 2 | `packages/klear360/src/components/TopNav/_decisions/decisions.md` | 517 | “initial ordering of Express Checkout & KlearNow Pay” | Neutral product names. |
| Critical | 2 | `packages/klear360/src/components/TopNav/_decisions/decisions.md` | 640 | `title="Express Checkout"` | Neutral product name. |
| Critical | 2 | `packages/klear360/src/components/TopNav/_decisions/decisions.md` | 710 | `title="Express Checkout"` | Neutral product name. |
| Critical | 2 | `packages/klear360/src/components/TopNav/_decisions/decisions.md` | 753 | `<ExploreItem title="Express Checkout" …>` | Neutral product name. |
| Critical | 2 | `packages/klear360/src/components/Settings/Settings.stories.tsx` | 429–430 | `href: '/magic-checkout'`, `title: 'Express Checkout'` | Same Projects /insights swap as stories, or drop those demo items. |
| Critical | 2 | `packages/klear360/src/components/BaseMotion/docs/MotionDashboardComponents.web.tsx` | 253–254 | `href: '/app/magic-checkout'`, `title: 'Express Checkout'` | Same Projects /insights swap as stories, or drop those demo items. |
| Critical | 2 | `packages/klear360/klear360-dashboard-template/src/navigation/TopNav.tsx` | 177 | `href: '/magic-checkout'` | Same Projects /insights swap as stories, or drop those demo items. |
| Critical | 2 | `packages/klear360/src/components/Tabs/Tabs.stories.tsx` | 465 | “Accept recurring payments via UPI apps like PhonePe, Paytm & BHIM” | Neutral product sentence. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/components/Checkbox.md` | 344 | `helpText="Google Pay, PhonePe, Paytm UPI, etc."` | Neutral checkbox help text. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/components/Checkbox.md` | 347 | `helpText="Paytm, Amazon Pay, PhonePe, etc."` | Neutral checkbox help text. |
| Critical | 2 | `packages/klear360/src/components/Toast/Toast.stories.tsx` | 163 | `<Heading>Introducing TurboUPI</Heading>` | Neutral product copy. |
| Critical | 2 | `packages/klear360/src/components/Toast/Toast.stories.tsx` | 181 | `text: 'Try TurboUPI'` | Neutral product copy. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/components/Toast.md` | 272 | `<Heading>Introducing TurboUPI</Heading>` | Match the neutralized story. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/components/Toast.md` | 289–291 | `text: 'Try TurboUPI'` / `console.log('Try TurboUPI clicked')` | Match the neutralized story. |
| Critical | 2 | `packages/klear360/src/components/Typography/Heading/Heading.stories.tsx` | 54 | `children: 'Get Started With Payment Gateway'` | Neutral product sentence and matching test assertions. |
| Critical | 2 | `packages/klear360/src/components/Typography/Heading/Heading.stories.tsx` | 85 | `Payment Gateway` | Neutral product sentence. |
| Critical | 2 | `packages/klear360/src/components/Typography/Display/Display.stories.tsx` | 88 | `Payment Gateway` | Neutral product sentence. |
| Critical | 2 | `packages/klear360/src/components/Typography/Heading/__tests__/Heading.web.test.tsx` | 11, 14, 19, 26, 31, 43, 51, 58, 63, 70, 75, 82, 110 | `Get Started With Payment Gateway` / `Payment Gateway` | Update assertions after story copy changes. |
| Critical | 2 | `packages/klear360/src/components/Typography/Heading/__tests__/Heading.native.test.tsx` | 10, 12, 17, 30, 38, 44, 49, 55, 60, 66, 71, 77, 92 | `Get Started With Payment Gateway` / `Payment Gateway` | Update assertions after story copy changes. |
| Critical | 2 | `packages/klear360/src/components/Typography/Display/__tests__/Display.web.test.tsx` | 47 | `Payment Gateway` | Update assertions after story copy changes. |
| Critical | 2 | `packages/klear360/src/components/Typography/Display/__tests__/Display.native.test.tsx` | 56 | `Payment Gateway` | Update assertions after story copy changes. |
| Critical | 2 | `packages/klear360/src/components/Accordion/Accordion.stories.tsx` | 365 | `<AccordionItemHeader title="PhonePe Wallet" …>` | Neutral wallet / method name. |
| Critical | 2 | `packages/klear360/src/components/Accordion/Accordion.stories.tsx` | 392 | `label="Google Pay UPI ID"` / `placeholder="xyz@okhdfcbank"` | Neutral account-id example. |
| Critical | 2 | `packages/klear360/src/components/Accordion/Accordion.stories.tsx` | 635–636 | “How can I setup Payouts?” / “Use Klear Payouts to send money to bank accounts, UPI IDs, or wallets…” | Neutral product FAQ copy. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 267 | `MagicCheckoutIcon` described as “Klear Express Checkout product icon” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 268 | `MagicCheckoutFilledIcon` — filled variant of MagicCheckoutIcon | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 35 | `AcceptPaymentsIcon` — “Klear product icon for accepting payments” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 40 | `AffordabilityIcon` — “Klear product icon for affordability solutions (EMI, pay later)” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 75 | `AutomateAccountingIcon` — “Klear product icon for automated accounting” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 76 | `AutomatePayrollIcon` — “Klear product icon for payroll automation” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 79 | `BankAccountVerificationIcon` — “Klear product icon for bank account verification” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 94 | `BfsiIcon` — “Klear product icon for BFSI (Banking, Financial Services, Insurance)” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 109 | `BusinessBankingIcon` — “Klear product icon for business banking” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 110 | `BusinessSpendManagementIcon` — “Klear product icon for business spend management” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 149 | `CompanyRegistrationIcon` — “Klear product icon for company registration” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 168 | `CreditsAndLoansIcon` — “Klear product icon for credits and loans” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 172 | `CurrentAccountIcon` — “Klear product icon for current account” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 179 | `DigitalLendingIcon` — “Klear product icon for digital lending” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 181 | `DisbursePaymentsIcon` — “Klear product icon for disbursing payments” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 191 | `EcommerceIcon` — “Klear product icon for e-commerce solutions” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 196 | `EducationIcon` — “Klear product icon for education sector” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 201 | `EscrowAccountIcon` — “Klear product icon for escrow accounts” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 221 | `ForexManagementIcon` — “Klear product icon for forex/currency management” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 223 | `FreelanceIcon` — “Klear product icon for freelance solutions” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 245 | `InstantSettlementIcon` — “Klear product icon for instant settlements” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 247 | `InternationalPaymentsIcon` — “Klear product icon for international payments” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 249 | `InvoicesIcon` — “Klear product icon for invoices” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 262 | `LoansForBusinessesIcon` — “Klear product icon for business loans” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 286 | `MobileAppIcon` — “Klear product icon for mobile app solutions” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 307 | `PaymentButtonIcon` — “Klear product icon for payment buttons” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 309 | `PaymentButtonsIcon` — “Klear product icon for payment buttons (alternate)” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 312 | `PaymentLinkIcon` — “Klear product icon for payment links” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 314 | `PaymentLinksIcon` — “Klear product icon for payment links (alternate)” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 315 | `PaymentPagesIcon` — “Klear product icon for payment pages” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 317 | `PayoutLinkIcon` — “Klear product icon for payout links” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 318 | `PayrollAddonsIcon` — “Klear product icon for payroll add-ons” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 320 | `PayrollForCaIcon` — “Klear product icon for payroll for chartered accountants” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 322 | `PayrollForStartupOrSmeIcon` — “Klear product icon for payroll for startups/SMEs” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 325 | `PettyCashBudgetIcon` — “Klear product icon for petty cash budget management” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 343 | `PosIcon` — “Klear product icon for point-of-sale” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 368 | `SaasIcon` — “Klear product icon for SaaS solutions” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 376 | `SettlementsIcon` — “Klear product icon for settlements” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 397 | `SolutionsIcon` — “Klear product icon for business solutions” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 400 | `SourceToPayIcon` — “Klear product icon for source-to-pay workflow” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 409 | `SubscriptionsIcon` — “Klear product icon for subscription management” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 417 | `TaxPaymentsIcon` — “Klear product icon for tax payments” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 444 | `UpiAutopayIcon` — “Klear product icon for UPI Autopay recurring payments” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 2 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 457 | `VendorPaymentsIcon` — “Klear product icon for vendor payments” | Rewrite remaining payment-product descriptions; keep icon IDs. |
| Critical | 5 | `LICENSE.md` | 3 | `Copyright (c) 2020 Razorpay` — expected, do not edit. | Leave as-is. Only intentional Razorpay string. |

---

## Moderate

| Risk | Step | File path | Line | What was found | Required fix |
| --- | --- | --- | --- | --- | --- |
| Moderate | 1 | `packages/klear360/src/tokens/global/colors.ts` | `ashGrayLight` / `ashGrayDark` | Still original Blade neutrals. The supplied palette file left them unchanged. | Send ash-gray hexes or accept as a known leftover. |
| Moderate | 1 | `packages/klear360-core/src/tokens/global/colors.ts` | `ashGrayLight` / `ashGrayDark` | Same original Blade neutrals as klear360 (files are identical). | Keep both files in lockstep if ash-gray is later replaced. |
| Moderate | 2 | `packages/klear360/src/components/Modal/docs/stories.ts` | 117 | `subtitle="Saving addresses will improve your checkout experience"` | Same delivery-faster copy as BottomSheet. |
| Moderate | 2 | `packages/klear360/src/components/Modal/__tests__/Modal.web.test.tsx` | 54 | `subtitle="Saving addresses will improve your checkout experience"` | Same delivery-faster copy as BottomSheet; update assertion if needed. |
| Moderate | 2 | `packages/klear360/src/components/Drawer/__tests__/Drawer.web.test.tsx` | 65 | `subtitle="Saving addresses will improve your checkout experience"` | Same delivery-faster copy as BottomSheet; update assertion if needed. |
| Moderate | 2 | `packages/klear360/src/components/Drawer/__tests__/Drawer.native.test.tsx` | 51 | `subtitle="Saving addresses will improve your checkout experience"` | Same delivery-faster copy as BottomSheet; update assertion if needed. |
| Moderate | 2 | `packages/klear360/src/components/ButtonGroup/docs/ButtonGroup.stories.tsx` | 99 | `<Button icon={PlusIcon}>Payout</Button>` | Neutral button labels. |
| Moderate | 2 | `packages/klear360/src/components/ButtonGroup/docs/ButtonGroup.stories.tsx` | 105 | `<ActionListItem title="Bulk Payout" …>` | Neutral menu item labels. |
| Moderate | 2 | `packages/klear360/src/components/ButtonGroup/docs/ButtonGroup.stories.tsx` | 515 | `<Button icon={PlusIcon}>Payout</Button>` | Neutral button labels. |
| Moderate | 2 | `packages/klear360/src/components/ButtonGroup/docs/ButtonGroup.stories.tsx` | 521 | `<ActionListItem title="Bulk Payout" …>` | Neutral menu item labels. |
| Moderate | 2 | `packages/klear360/src/components/ButtonGroup/__tests__/ButtonGroup.web.test.tsx` | 39, 44, 57 | Button text `Payout`; item `Bulk Payout`; assertion `toHaveTextContent('Payout')` | Neutral labels and matching assertions. |
| Moderate | 2 | `packages/klear360/src/components/ButtonGroup/__tests__/ButtonGroup.allowedChildren.native.test.tsx` | 39–40, 53, 59–60 | `Bulk Payout` / `Single Payout` / `<Button>Payout</Button>` | Neutral labels and matching assertions. |
| Moderate | 2 | `packages/klear360/src/components/ButtonGroup/_decisions/decisions.md` | 110, 115 | Example still uses `Payout` / `Bulk Payout` | Neutral example labels. |
| Moderate | 2 | `packages/klear360-mcp/knowledgebase/components/ButtonGroup.md` | 161, 168 | `Payout` / `Bulk Payout` | Match the neutralized stories, then regen MCP doc snaps. |
| Moderate | 2 | `packages/klear360/src/components/Input/TextInput/TextInput.stories.tsx` | 859 | `label="Enter your upi id"` | Neutral input label. |
| Moderate | 2 | `packages/klear360/src/components/Input/TextInput/TextInput.stories.tsx` | 866 | `<ActionListItem title="@oksbi" value="sbi" />` | Neutral handle / badge. |
| Moderate | 2 | `packages/klear360/src/components/Input/TextInput/TextInput.stories.tsx` | 902 | `label="Enter your upi id"` | Neutral input label. |
| Moderate | 2 | `packages/klear360/src/components/Input/TextInput/TextInput.stories.tsx` | 908 | `label="Enter your upi id"` | Neutral input label. |
| Moderate | 2 | `packages/klear360/src/components/Input/TextInput/TextInput.stories.tsx` | 915 | `label="Enter your upi id"` | Neutral input label. |
| Moderate | 2 | `packages/klear360/src/components/Input/TextInput/TextInput.stories.tsx` | 925–927 | `label="Enter your upi id"`; `trailing={<Badge>@oksbi</Badge>}` | Neutral label and badge. |
| Moderate | 2 | `packages/klear360/src/components/Input/TextInput/TextInput.stories.tsx` | 1320 | `trailing={<Badge>@oksbi</Badge>}` | Neutral badge. |
| Moderate | 2 | `packages/klear360-mcp/knowledgebase/components/TextInput.md` | 512 | `placeholder="Enter UPI handle"` | Match the neutralized story placeholder. |
| Moderate | 2 | `packages/klear360-mcp/knowledgebase/components/TextInput.md` | 516 | `trailing={<Badge>@oksbi</Badge>}` | Neutral badge. |
| Moderate | 2 | `packages/klear360/src/storybook-recipes/ThemePlayground/index.tsx` | 27 | Dead branch still checks `selectedPreBuiltTheme === 'paymentTheme'` | Delete the dead branch. |
| Moderate | 2 | `packages/klear360/src/components/Drawer/docs/Drawer.stories.tsx` | 91, 225, 333 | Button label `Payout` | Neutral button label. |
| Moderate | 2 | `packages/klear360/src/components/Drawer/docs/stories.ts` | 48 | `<Button>Payout</Button>` | Neutral button label. |
| Moderate | 2 | `packages/klear360-mcp/knowledgebase/components/Drawer.md` | 245 | `<Button …>Payout</Button>` | Match the neutralized stories, then regen MCP doc snaps. |
| Moderate | 2 | `packages/klear360/src/components/SideNav/docs/SideNav.stories.tsx` | 186, 189, 192 | `title: 'Payouts'`; tooltip “Open Payouts”; “Create Payout” | Neutral nav labels. |
| Moderate | 2 | `packages/klear360/src/components/SideNav/docs/code.ts` | 321, 324, 327 | Same Payouts / Create Payout copy | Neutral nav labels. |
| Moderate | 2 | `packages/klear360/src/components/SideNav/_decisions/decisions.md` | 27, 289–290, 357 | `title="Create Payouts"` / `Create Payout` | Neutral example titles. |
| Moderate | 5 | `packages/klear360/docs/guides/Intro.mdx` | file | Still has Klear360 Rebranded, Blade-era YouTube embed, `github.com/klear` badges. | Backlog: rewrite or quarantine. Do not treat as a live consumer guide. |
| Moderate | 5 | `packages/klear360/docs/migration-docs/upgrade-v11.md` | 1–32 | Still “Upgrade Guide for v11 (Brand Refresh)” / `@klear/klear360-rebranded`. | Backlog: rewrite or quarantine. Do not treat as a live consumer guide. |
| Moderate | 5 | `rfcs/` (series) | — | RFC series still carries origin structure; dead `github.com/klear/klear360` links (see inventory below). | Point at local paths or drop the URLs. Do not rewrite RFC narrative unless asked. |
| Moderate | 5 | `packages/klear360/src/components/Icons/KlearXIcon/` | public API | Mechanical RazorpayX → KlearX rename — obvious on inspection. | Known structural tell. Rename only if you want another pass. |
| Moderate | 5 | `packages/klear360/src/components/Icons/KlearxPayrollIcon/` | public API | Mechanical RazorpayX payroll rename. | Known structural tell. Rename only if you want another pass. |
| Moderate | 5 | `packages/klear360/src/components/Icons/KlearxPayrollFilledIcon/` | public API | Filled variant of the same mechanical rename. | Known structural tell. Rename only if you want another pass. |
| Moderate | 5 | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` | 352–354 | `KlearXIcon` / `KlearxPayrollIcon` / `KlearxPayrollFilledIcon` described as KlearX / Klear Payroll product logos. | Update descriptions if those icons are renamed. |

---

## Low

| Risk | Step | File path | Line | What was found | Required fix |
| --- | --- | --- | --- | --- | --- |
| Low | 5 | `packages/klear360/scripts/copySvelteStorybook.js` | file | Process-flavored filename; svelte is out of scope. | Delete or archive the script. |
| Low | 5 | Workspace folder name `Untitled` | — | Repo root still reads as an unfinished clone (`DS2.0/Untitled`). | Rename the working directory when convenient. |
| Low | 5 | `packages/klear360/docs/tokens/Typography.mdx` | 85 | “Era of rising Fintech” example line. | Neutral sample sentence. |
| Low | 5 | `packages/plugin-figma-pattern-creator/package.json` | 15 | `author` is empty string. | Set author to Klear. |
| Low | 5 | `packages/widget-figma-dev-handoff-checklist/package.json` | 15 | `author` is empty string. | Set author to Klear. |

---

## Earlier re-audit pass (same day, before `theme.css` / snapshot cutover)

These Critical rows were recorded on the first re-audit pass the same day, before the color-file apply finished compiled CSS and snaps. They are included so nothing from that table is dropped. The later pass marked Step 1 as Pass.

| Risk | Step | File path | Line | What was found | Required fix |
| --- | --- | --- | --- | --- | --- |
| Critical | 1 | `packages/klear360-core/src/tokens/theme.css` | 33 hits | Compiled tokens still hard-code `hsla(218, 89%, 51%)` for primary surface/interactive/data. | Run `yarn generate:tokens-css` in klear360-core. |
| Critical | 1 | `packages/klear360/.storybook/react/storybook-theme.ts` | 2 | `klear360Primary` is still `hsla(218, 89%, 51%, 1)`. | Set to `hsla(198, 100%, 18%, 1)` (`#003F5B`). |
| Critical | 1 | ~155 snapshot/test files + 2 source tests | — | createTheme snaps were regenerated; Button, TopNav, Charts, Drawer, Switch, etc. still resolve Blade blue. `getFocusRingStyles.web.test.ts` and `baseBoxStyles.test.ts` hardcode it. | Regen remaining snaps; update the two hardcoded expects. |
| Critical | 1 | `packages/klear360-core` styles: `modal.module.css`, `bottomSheet.module.css` | fallback | Fallback outline still `hsla(218, 89%, 51%, 1)`. | Change fallback after theme.css regen, or drop the hardcoded fallback. |
| Critical | 2 | `packages/klear360/src/storybook-recipes/ThemePlayground/Checkout/` | empty dir | Folder name Checkout is still on disk next to Workspace/. | Delete the empty Checkout directory. (Later pass found this folder was not empty — it still held the QR PNG.) |
| Moderate | 1 | `colors.ts` `sea` / `cloud` / `forest` / `orchid` / `magenta` / `topaz` + most neutrals | ramps | Still original Blade HSLA. Intentional after Batch 1 Q&A (accents left unused). | Send remaining ramps or accept mixed palette as a known gap. (Later filled from the supplied palette file except `ashGray*`.) |
| Moderate | 1 | `blueGrayLight` 200–400, 700, 900–1300 | scale | Only 50/100/500/600/800 were swapped. Scale is non-monotonic (700 lighter than 600). | Provide the missing Blue Gray steps. (Later filled; scale became monotonic.) |
| Low | 2 | `packages/klear360/src/components/Input/PaymentInput/_decisions/` | empty | Directory leftover after `decisions.md` delete. | Remove the empty folders. (Later pass found `payment-input-anatomy.png` still inside.) |

---

## Dead `github.com/klear/klear360` inventory

The re-audit recorded “100+ files still point at `github.com/klear/klear360` (does not exist).” The complete file list from that sweep (with link counts) is below. Risk: Moderate. Step: 5. Required fix: PR / issue / discussion / compare / `/assets/` → remove the URL and keep prose; blob/tree file paths → relative local path.

| File path | Links found |
| --- | ---: |
| `packages/klear360-core/src/utils/types.ts` | 1 |
| `packages/klear360-coverage-extension/README.md` | 1 |
| `packages/klear360-mcp/README.md` | 1 |
| `packages/klear360/.storybook/react/storybook-theme.ts` | 1 |
| `packages/klear360/README.md` | 4 |
| `packages/klear360/codemods/brand-refresh/transformers/__tests__/migrate-contrast-intent-variant.test.ts` | 4 |
| `packages/klear360/docs/guides/Contributing.mdx` | 1 |
| `packages/klear360/docs/guides/FAQ.mdx` | 1 |
| `packages/klear360/docs/guides/Installation.mdx` | 1 |
| `packages/klear360/docs/guides/IntegrationExamples.mdx` | 2 |
| `packages/klear360/docs/guides/Intro.mdx` | 9 |
| `packages/klear360/docs/migration-docs/upgrade-v11.md` | 1 |
| `packages/klear360/docs/utils/CoverageExtensionPrivacyPolicy.mdx` | 2 |
| `packages/klear360/docs/utils/makeMotionTime.mdx` | 1 |
| `packages/klear360/docs/utils/makeTypographySize.mdx` | 1 |
| `packages/klear360/src/components/Accordion/AccordionItem.tsx` | 1 |
| `packages/klear360/src/components/Accordion/__tests__/Accordion.ssr.test.tsx` | 1 |
| `packages/klear360/src/components/Accordion/_decisions/decisions.md` | 2 |
| `packages/klear360/src/components/Alert/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/Amount/__tests__/Amount.native.test.tsx` | 1 |
| `packages/klear360/src/components/Amount/__tests__/Amount.web.test.tsx` | 1 |
| `packages/klear360/src/components/AutoComplete/_decisions/decisions.md` | 6 |
| `packages/klear360/src/components/BaseMotion/docs/MotionIntro.mdx` | 1 |
| `packages/klear360/src/components/BottomSheet/BottomSheet.stories.tsx` | 1 |
| `packages/klear360/src/components/BottomSheet/_decisions/api-revision-1.md` | 6 |
| `packages/klear360/src/components/BottomSheet/_decisions/bottomsheet-header-footer-unification.md` | 1 |
| `packages/klear360/src/components/Box/BaseBox/useMemoizedStyles.web.ts` | 2 |
| `packages/klear360/src/components/Box/Box.stories.tsx` | 1 |
| `packages/klear360/src/components/Box/Box.tsx` | 2 |
| `packages/klear360/src/components/Box/LayoutPrimitivesDocs.tsx` | 4 |
| `packages/klear360/src/components/Box/__tests__/Box.native.test.tsx` | 2 |
| `packages/klear360/src/components/Box/__tests__/Box.web.test.tsx` | 3 |
| `packages/klear360/src/components/Button/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/Carousel/__tests__/Carousel.test.stories.tsx` | 1 |
| `packages/klear360/src/components/Carousel/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/Charts/AreaChart/AreaChart.stories.tsx` | 1 |
| `packages/klear360/src/components/Charts/BarChart/BarChart.stories.tsx` | 1 |
| `packages/klear360/src/components/Charts/DonutChart/DonutChart.stories.tsx` | 1 |
| `packages/klear360/src/components/Charts/LineChart/LineChart.stories.tsx` | 1 |
| `packages/klear360/src/components/Charts/SankeyChart/SankeyChart.stories.tsx` | 1 |
| `packages/klear360/src/components/Checkbox/CheckboxGroup.stories.tsx` | 1 |
| `packages/klear360/src/components/Collapsible/_decisions/decisions.md` | 3 |
| `packages/klear360/src/components/Counter/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/CreationView/CreationView.stories.tsx` | 1 |
| `packages/klear360/src/components/DatePicker/CalendarStyles.web.tsx` | 1 |
| `packages/klear360/src/components/DatePicker/DatePicker.stories.tsx` | 1 |
| `packages/klear360/src/components/DetailedView/_decisions/decisions.md` | 2 |
| `packages/klear360/src/components/Drawer/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/Dropdown/DropdownOverlay.web.tsx` | 1 |
| `packages/klear360/src/components/Dropdown/__tests__/Dropdown.web.test.tsx` | 1 |
| `packages/klear360/src/components/Elevate/Elevate.stories.tsx` | 1 |
| `packages/klear360/src/components/Fade/Fade.stories.tsx` | 1 |
| `packages/klear360/src/components/FileUpload/_decisions/decisions.md` | 2 |
| `packages/klear360/src/components/FormGroup/_decisions/decisions.md` | 2 |
| `packages/klear360/src/components/Icons/Icons.stories.tsx` | 1 |
| `packages/klear360/src/components/Input/BaseInput/__tests__/BaseInput.native.test.tsx` | 1 |
| `packages/klear360/src/components/Input/BaseInput/_decisions/_decisions.md` | 1 |
| `packages/klear360/src/components/Input/BaseInput/utils.ts` | 1 |
| `packages/klear360/src/components/Input/DropdownInputTriggers/SelectInput.stories.tsx` | 1 |
| `packages/klear360/src/components/Input/DropdownInputTriggers/__tests__/AutoComplete.web.test.tsx` | 1 |
| `packages/klear360/src/components/Input/OTPInput/OTPInput.stories.tsx` | 1 |
| `packages/klear360/src/components/Input/PasswordInput/PasswordInput.stories.tsx` | 1 |
| `packages/klear360/src/components/Input/PasswordInput/__tests__/PasswordInput.native.test.tsx` | 1 |
| `packages/klear360/src/components/Input/PhoneNumberInput/PhoneNumberInput.stories.tsx` | 1 |
| `packages/klear360/src/components/Input/SearchInput/SearchInput.stories.tsx` | 1 |
| `packages/klear360/src/components/Input/SearchInput/__tests__/SearchInput.native.test.tsx` | 1 |
| `packages/klear360/src/components/Input/SearchInput/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/Input/TextArea/TextArea.stories.tsx` | 1 |
| `packages/klear360/src/components/Input/TextArea/__tests__/TextArea.native.test.tsx` | 1 |
| `packages/klear360/src/components/Input/TextInput/TextInput.stories.tsx` | 1 |
| `packages/klear360/src/components/Input/TextInput/__tests__/TextInput.native.test.tsx` | 1 |
| `packages/klear360/src/components/Input/TextInput/_decisions/_decisions.md` | 1 |
| `packages/klear360/src/components/Link/BaseLink/BaseLink.stories.tsx` | 1 |
| `packages/klear360/src/components/Link/BaseLink/__tests__/BaseLink.native.test.tsx` | 1 |
| `packages/klear360/src/components/Link/BaseLink/__tests__/BaseLink.web.test.tsx` | 1 |
| `packages/klear360/src/components/Link/BaseLink/__tests__/__snapshots__/BaseLink.web.test.tsx.snap` | 1 |
| `packages/klear360/src/components/Link/Link/Link.stories.tsx` | 4 |
| `packages/klear360/src/components/Modal/_decisions/decisions.md` | 3 |
| `packages/klear360/src/components/Move/Move.stories.tsx` | 1 |
| `packages/klear360/src/components/Popover/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/Scale/Scale.stories.tsx` | 1 |
| `packages/klear360/src/components/Skeleton/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/Slide/Slide.stories.tsx` | 1 |
| `packages/klear360/src/components/SpotlightPopoverTour/_decisions/decisions.md` | 7 |
| `packages/klear360/src/components/Tabs/_decisions/decisions.md` | 2 |
| `packages/klear360/src/components/TimePicker/TimePicker.stories.tsx` | 1 |
| `packages/klear360/src/components/Toast/_decisions/decisions.md` | 1 |
| `packages/klear360/src/components/Tooltip/__tests__/Tooltip.web.test.tsx` | 1 |
| `packages/klear360/src/components/Tooltip/_decisions/decisions.md` | 4 |
| `packages/klear360/src/components/TopNav/_decisions/decisions.md` | 2 |
| `packages/klear360/src/components/Typography/Code/Code.stories.tsx` | 1 |
| `packages/klear360/src/components/Typography/Display/Display.stories.tsx` | 1 |
| `packages/klear360/src/components/Typography/Heading/Heading.stories.tsx` | 1 |
| `packages/klear360/src/components/Typography/Text/Text.stories.tsx` | 1 |
| `packages/klear360/src/components/VisuallyHidden/VisuallyHidden.stories.tsx` | 1 |
| `packages/klear360/src/utils/index.ts` | 2 |
| `packages/klear360/src/utils/storybook/ComponentStatusTable.tsx` | 2 |
| `packages/klear360/src/utils/storybook/StoryPageWrapper.tsx` | 2 |
| `packages/klear360/src/utils/types.ts` | 1 |
| `packages/plugin-figma-klear360-coverage/README.md` | 3 |
| `rfcs/2021-06-15-shipping-klear360.md` | 1 |
| `rfcs/2022-02-11-responsive-and-adaptive-layout-strategy.md` | 3 |
| `rfcs/2022-03-22-motion-rfc.md` | 2 |
| `rfcs/2022-04-09-accessibility.md` | 7 |
| `rfcs/2023-11-08-font-loading-strategy.md` | 3 |
| `rfcs/2024-08-21-motion-presets.md` | 1 |
| `rfcs/accessibility-checklist.md` | 3 |
| `rfcs/discussions.md` | 1 |
| `packages/klear360/package.json` | 1 (`ssh://git@github.com/klear/klear360.git`) |
| `packages/klear360-core/package.json` | 1 (`ssh://git@github.com/klear/klear360.git`) |
| `packages/klear360-mcp/package.json` | 1 (`ssh://git@github.com/klear/klear360.git`) |

**Total from that sweep:** 185 links in 111 files.

Also recorded on that sweep (different host, same dead repo; not rewritten by the `github.com/klear/klear360` pass):

| File path | What was found | Required fix |
| --- | --- | --- |
| `packages/klear360/README.md` | `raw.githubusercontent.com/klear/klear360/...` logo SVGs | No local branding files to swap; strip or retarget. |
| `packages/klear360/docs/guides/Intro.mdx` | Same raw GitHub logo + shields.io badge hitting `klear/klear360` | Strip or retarget. |
| `packages/klear360/.storybook/react/storybook-theme.ts` | raw GitHub brand SVG | Strip or retarget. |
| `packages/klear360/src/utils/storybook/Sandbox/baseCode.ts` | raw GitHub favicon | Strip or retarget. |
| `packages/klear360/.storybook/react/manager-head.html` | raw GitHub favicon | Strip or retarget. |
| `packages/klear360-mcp/src/utils/skillUtils.ts` | `raw.githubusercontent.com/klear/klear360/master/packages/klear360-mcp/skillTemplate` | Point at a live raw URL or ship the template another way. |
| `packages/klear360-mcp/src/utils/__tests__/__snapshots__/skillUtils.test.ts.snap` | Same BASE_URL | Update with the source. |
| `packages/klear360/scripts/generateBundleDiff.js` | raw GitHub `bundle-size-stats` JSON | Retarget or drop. |

`github.com/klear/klear360-old` was excluded on purpose (different repo).

---

## Images and i18n (from the re-audit callout)

| File path | What was found | Required fix |
| --- | --- | --- |
| `packages/klear360/src/storybook-recipes/ThemePlayground/Checkout/klear360-qr-code.png` | QR, teal blocks, no visible Razorpay wordmark | Delete with the Checkout folder. |
| `packages/klear360/src/components/Input/PaymentInput/_decisions/payment-input-anatomy.png` | Card form with Mastercard | Delete with PaymentInput. |
| `packages/plugin-figma-pattern-creator/src/assets/icon.png` | One plugin chrome PNG remains | Leave or replace if a new mark exists. |
| Android mipmaps | None found to re-OCR | No action. |
| `packages/klear360-i18n/README.md` | States the package is vendored | Acceptable as a generic vendored-internal note; do not name the original source package in-repo. |
