# Investment Banking Plugin Routing Playbook

This playbook is the plugin-level router for broad Investment Banking prompts. Use it before selecting a skill when the user describes a transaction workflow, audience, committee, package, process, financing, or model update instead of naming one narrow deliverable.

The machine-readable companion is `references/plugin-routing-map.json`; the schema is `schemas/plugin_routing_map.schema.json`.

At the router stage, use this playbook only to choose the lead skill. Workflow cards, default hero artifacts, and artifact-mode metadata describe lead-skill expectations and may help distinguish adjacent routes; they do not authorize the router to resolve or announce the current request's presentation surface. Within workflow cards, `Default hero` and `Ask` guidance applies after handoff to the selected lead skill unless the question is necessary to distinguish the lead skill itself.

## Invocation Gate

Before routing an untagged request, apply `references/invocation-policy.md`. Enter this plugin only when the user explicitly names or tags Investment Banking or the request is an unmistakable banker-owned transaction execution workflow. Generic memo, deck, report, model, valuation, spreadsheet, company research, or meeting-prep requests are not automatic Investment Banking routes.

The `investment-banking` router reads `internal-support/policy.md` before using bundled evidence control, data cleaning, HTML rendering, or style support. Routing tables may refer to internal capability labels for those workstreams; resolve them to the router's bundled internal playbooks rather than presenting them as selectable skills. `financials-normalizer` and `model-audit-tieout` remain visible workflows when financial spreading/model updates or model review is the standalone user job.

## Routing Principles

1. Route by banker workflow first, skill lane second.
2. Keep one lead skill accountable for the first real judgment or hero artifact.
3. Use support skills only for owned workstreams: source normalization, model build, valuation, financing, covenant, restructuring, memo, deck, tracker, dashboard, or QC.
4. Validate cross-skill handoff JSON before importing it downstream.
5. Pass the request, routing rationale, and relevant saved context to the selected lead skill without interpreting saved output preferences or choosing a presentation surface.
6. The selected lead skill owns deliverable intake, format, depth, artifact hierarchy, and final-response behavior under the applicable output policies. Before it begins source gathering or analysis for a new standalone reader-facing hero artifact, it reads `references/deliverable-intake-policy.md`.
7. For an admitted support-only request, the root `investment-banking` router may coordinate the matching internal capability without promoting that capability to a visible skill.

## Workflow Router

| Workflow | Lead Skill | Core Support Skills | Default Hero Artifact | Key Gates |
| --- | --- | --- | --- | --- |
| Sell-side auction | `cim-teardown` | `financials-normalizer`, `buyer-investor-list`, `deal-process-tracker`, `cim-builder`, `pitch-deck-builder`, `ib-deck-qc` | HTML auction readiness / CIM teardown report; tracker workbook when execution-tracking is the ask | Source packet/version, seller claim labels, buyer-facing QC |
| Sponsor buy-side | `cim-teardown` | `financials-normalizer`, `lbo-model-build`, `comps-valuation`, `dcf-model-builder`, `scenario-sensitivity-generator`, `memo-builder` | Diligence report or model workbook | CIM-to-model validation, model audit, scenarios |
| LevFin financing | `capital-markets-issuance` | `private-credit-underwriting`, `covenant-package-analyzer`, `scenario-sensitivity-generator`, `memo-builder` | Financing alternatives workbook or HTML financing memo | Separate issuer advice from lender approval and legal covenant capacity |
| ECM | `capital-markets-issuance` | `company-tearsheet`, `comps-valuation`, `scenario-sensitivity-generator`, `memo-builder`, `pitch-deck-builder`, `ib-deck-qc` | ECM recommendation report or financing alternatives workbook | Current market data, dilution/proceeds citations, disclosure/compliance caveats |
| DCM | `capital-markets-issuance` | `private-credit-underwriting`, `covenant-package-analyzer`, `scenario-sensitivity-generator`, `memo-builder` | DCM alternatives workbook or issuer/lender report | Rates/spreads timestamp, ratings/covenant caveats, model tie-outs |
| Board package | `memo-builder` | `pitch-deck-builder`, `model-audit-tieout`, `ib-deck-qc`, `style-guide-adapter` | Board HTML memo/report or native deck/document | Board-ready citation validation, model audit, final QC |
| Fairness committee support | `memo-builder` | `comps-valuation`, `dcf-model-builder`, `merger-model-builder`, `model-audit-tieout`, `pitch-deck-builder`, `ib-deck-qc` | Committee support HTML report | No fairness opinion, model/source tie-out, committee posture guardrails |
| Restructuring pitch | `distressed-recovery-waterfall` | `covenant-package-analyzer`, `capital-markets-issuance`, `private-credit-underwriting`, `pitch-deck-builder`, `memo-builder`, `ib-deck-qc` | Recovery waterfall workbook or restructuring pitch report | Legal entitlement vs plan economics, lien/collateral caveats, deck QC |
| Model update | `financials-normalizer` | `excel-data-cleaner`, model builders, `model-audit-tieout`, `scenario-sensitivity-generator`, `dashboard-builder` | Updated/model-ready workbook | Preserve workbook, normalize before import, first-tab rule, model audit |
| Deal committee | `memo-builder` | model builders, `model-audit-tieout`, `scenario-sensitivity-generator`, `ib-deck-qc` | Deal committee HTML report | Recommendation clarity, source/model support, committee-ready citation validation |

## Workflow Cards

### Sell-side auction

Banker intent: launch or run a sale process with evidence-backed materials, a buyer universe, process tracker, source-aware CIM/deck, and circulation QC.

Typical prompts:

- "Prepare the sell-side process package for this target."
- "Build the buyer list, CIM story, first-wave diligence asks, and tracker for an auction."
- "We are launching a sale process; what should the team do first?"

Lead with `cim-teardown` when seller materials or claims need testing before downstream use. Add `financials-normalizer` before relying on financials; `buyer-investor-list` for the universe; `deal-process-tracker` for execution; `cim-builder` or `pitch-deck-builder` for buyer-facing materials; and `ib-deck-qc` before final circulation.

Required handoffs:

- `cim_teardown_to_memo_builder` when diligence findings feed a memo.
- `cim_builder_to_ib_deck_qc` when CIM or buyer-facing pages move to QC.
- `buyer_investor_list_to_deal_process_tracker` when the ranked universe becomes a tracker.

Default hero: HTML auction readiness or CIM teardown report. If execution tracking is the core ask, hero the XLSX tracker. Keep buyer CSVs, claims ledgers, handoff JSON, source indices, and logs as support.

Ask a clarifying question when the user has not made clear whether they need diligence, buyer list, tracker, CIM/deck creation, or final QC. Route to Legal for NDA, exclusivity, definitive agreement, or securities-law advice.

### Sponsor buy-side

Banker intent: evaluate a target from seller materials, build valuation/model workstreams, test financing capacity, and create an IC-ready decision view.

Typical prompts:

- "We are evaluating this CIM for a sponsor buy-side process."
- "Build the buy-side diligence, LBO, comps, DCF, scenarios, and IC view."
- "Should we pursue this asset and what breaks the thesis?"

Lead with `cim-teardown` so seller claims are tested before model import. Add `financials-normalizer`, `lbo-model-build`, `comps-valuation`, `dcf-model-builder`, `scenario-sensitivity-generator`, `model-audit-tieout`, and `memo-builder` as needed.

Required handoffs:

- `cim_teardown_to_model_builder` before model builders import CIM claims, KPIs, diligence flags, or source IDs.
- `cim_teardown_to_memo_builder` before memo synthesis imports teardown findings.

Default hero: diligence HTML report when judgment-first; banker-readable LBO/model workbook when model-first. For an expressly requested narrative view of an LBO workbook, use a polished standalone HTML underwriting summary grounded in workbook evidence rather than a dashboard contract. Keep normalized CSVs, source conflicts, model citations, and handoff payloads as support.

Ask when model architecture, transaction perimeter, or desired posture is ambiguous. Route to Private Markets when the output is sponsor IC work product rather than bank-side transaction execution.

### LevFin financing

Banker intent: advise on leveraged financing alternatives, lender appetite, debt sizing, covenant/document risks, and committee-ready financing posture.

Typical prompts:

- "Frame the LevFin package for this acquisition."
- "Compare loan, bond, private credit, and hybrid financing alternatives."
- "Build the lender case and covenant open-items view."

Lead with `capital-markets-issuance`. Add `private-credit-underwriting` for borrower/lender case, downside, collateral, and conditions precedent. Add `covenant-package-analyzer` for document-first definitions, baskets, leakage, amendments, or headroom. Add `scenario-sensitivity-generator` and `memo-builder` for cases and final synthesis.

Required handoffs:

- `capital_markets_issuance_to_private_credit_underwriting`
- `capital_markets_issuance_to_covenant_package_analyzer`
- `private_credit_underwriting_to_covenant_package_analyzer`

Default hero: financing alternatives workbook or LevFin recommendation HTML report. Keep issuance math JSON, covenant scan outputs, and handoff payloads as support.

Ask who the audience is: issuer/client, lender/credit committee, sponsor IC, or deal committee. Route to Legal for definitive covenant interpretation or securities/legal advice.

### ECM

Banker intent: advise on equity or equity-linked alternatives, market window, investor targeting, dilution, and execution readiness.

Typical prompts:

- "Frame an ECM transaction for this issuer."
- "Compare follow-on, block, ATM, PIPE, convert, and rights offering alternatives."
- "Build a board-ready equity issuance readout."

Lead with `capital-markets-issuance`. Add `company-tearsheet` for issuer facts, `comps-valuation` for trading/comps context, `scenario-sensitivity-generator` for dilution and proceeds cases, `memo-builder` for board/client synthesis, `pitch-deck-builder` for page plan, and `ib-deck-qc` before circulation.

Required handoffs:

- `company_tearsheet_to_memo_builder` when issuer facts feed a memo.
- `pitch_deck_builder_to_ib_deck_qc` when pitch or board pages go to QC.

Default hero: ECM recommendation report or financing alternatives workbook. Keep issuance math JSON, comps support CSV, and deck handoffs as support.

Ask which instrument family is in scope and what market-data timestamp should control. Route to Legal for disclosure, MNPI, wall-crossing, or securities-law advice; route to Public Markets for investor research rather than issuer advice.

### DCM

Banker intent: advise on bonds, loans, private placements, private credit, ratings/covenant constraints, market access, pricing, and execution risk.

Typical prompts:

- "Build a DCM financing alternatives view."
- "Assess whether this issuer should raise HY bonds, loans, or private debt."
- "Prepare a lender-ready DCM readout."

Lead with `capital-markets-issuance`. Add `private-credit-underwriting`, `covenant-package-analyzer`, `scenario-sensitivity-generator`, `memo-builder`, and `model-audit-tieout` when the route requires credit, document, scenario, synthesis, or model evidence.

Required handoffs:

- `capital_markets_issuance_to_private_credit_underwriting`
- `capital_markets_issuance_to_covenant_package_analyzer`
- `private_credit_underwriting_to_covenant_package_analyzer`

Default hero: DCM alternatives workbook or issuer/lender HTML report. Keep issuance math, covenant scan outputs, and raw support tables secondary.

Ask whether the decision is market access, pricing, documentation, lender approval, ratings, or covenant capacity. Route to Public Markets for credit trade research.

### Board package

Banker intent: package existing analysis into board-ready decision materials with source posture, model tie-outs, final QC, and a clear recommendation.

Typical prompts:

- "Prepare a board package for this transaction."
- "Turn these analyses into a board-ready memo and deck."
- "What can we send upward to the board?"

Lead with `memo-builder`; do not let the memo layer invent analysis. Pull from owning skills and produce a standalone HTML memo for ordinary HTML output. Add `pitch-deck-builder` or native presentation tooling when deck output is requested, run `model-audit-tieout`, and route final-circulation candidates to `ib-deck-qc`.

Required handoffs:

- `pitch_deck_builder_to_ib_deck_qc`
- `style_guide_adapter_style_profile`
- `style_guide_adapter_change_log`

Default hero: board-ready HTML memo/report or native deck/document. Keep model citations, manifests, audit logs, and handoff payloads as support.

Ask what the artifact is: memo, deck, dashboard, workbook, or complete board book. Route to Legal for fiduciary, fairness opinion, disclosure, privilege, or formal board legal advice.

### Fairness committee support

Banker intent: support a fairness or special committee process with valuation, source posture, and model tie-out while avoiding legal/fairness-opinion claims.

Typical prompts:

- "Prepare fairness committee support materials."
- "Build valuation support and model tie-out for a special committee."
- "Help organize committee-ready fairness support without giving a fairness opinion."

Lead with `memo-builder` as the synthesis owner. Add `comps-valuation`, `dcf-model-builder`, `merger-model-builder`, `model-audit-tieout`, `pitch-deck-builder`, `ib-deck-qc`, and `financial-source-of-truth`.

Required handoffs:

- `pitch_deck_builder_to_ib_deck_qc` when committee exhibits or pages move to QC.
- `style_guide_adapter_style_profile` when style controls are provided.

Default hero: committee support HTML report with valuation range, model/source posture, audit status, assumptions, and open items. Keep workbooks and audit logs as companions or support based on user ask.

Ask whether the user needs valuation support, committee memo, deck, model audit, or full committee package. Route to Legal if the user asks for a fairness opinion, fiduciary conclusion, or committee legal advice.

### Restructuring pitch

Banker intent: analyze distressed capital structure, value break, creditor dynamics, recovery ranges, restructuring alternatives, and pitch-ready storyline.

Typical prompts:

- "Build a restructuring pitch for this issuer."
- "Analyze the distressed cap stack, fulcrum, recoveries, and pitch angles."
- "Turn this waterfall into memo and pitch inputs."

Lead with `distressed-recovery-waterfall`. Add `covenant-package-analyzer`, `capital-markets-issuance`, `private-credit-underwriting`, `pitch-deck-builder`, `memo-builder`, and `ib-deck-qc`.

Required handoffs:

- `private_credit_underwriting_to_distressed_recovery_waterfall`
- `distressed_recovery_waterfall_to_memo_builder`
- `distressed_recovery_waterfall_to_pitch_deck_builder`
- `distressed_recovery_waterfall_to_ib_deck_qc`
- `capital_markets_issuance_to_covenant_package_analyzer` when document alternatives matter.

Default hero: recovery waterfall workbook for model-heavy work or polished standalone HTML restructuring memo for narrative/board-advice work. Keep waterfall engine JSON, cap-structure CSVs, model-citation ledgers, legal-review flags, manifests, and handoff payloads as support.

Ask what the immediate output is: recovery model, restructuring memo, pitch deck, covenant readout, or QC package. Route to Legal for bankruptcy, lien, collateral, intercreditor, plan, or legal entitlement advice.

### Model update

Banker intent: refresh an existing model or create model-ready inputs while preserving source fields, workbook structure, formulas, checks, and audit trail.

Typical prompts:

- "Update the model with these new financials."
- "Clean and spread this data, then refresh the scenarios and audit the model."
- "Turn these source files into model-ready inputs."

Lead with `financials-normalizer` for financial spreading and model-ready schedules. Add `excel-data-cleaner` for generic messy tables, the relevant model builder for workbook construction, `model-audit-tieout`, `scenario-sensitivity-generator`, `dashboard-builder`, and `financial-source-of-truth`.

Required handoff:

- `cim_teardown_to_model_builder` when CIM or seller-material claims feed model assumptions, KPIs, or diligence flags.

Default hero: updated/model-ready XLSX workbook with first visible tab `Cover`, `Executive Summary`, or `Dashboard`. Keep normalized CSVs, transform logs, source indices, and model citation JSON as support.

Ask whether this is a new model, an existing workbook refresh, or a model-ready input pack. Preserve workbooks by default and escalate before destructive edits.

### Deal committee

Banker intent: synthesize transaction analysis into an approval-ready committee view with recommendation, model evidence, source posture, risks, mitigants, and next actions.

Typical prompts:

- "Prepare the deal committee package."
- "Turn the model, diligence, financing, and open items into a committee-ready readout."
- "What should the committee approve, defer, or reject?"

Lead with `memo-builder`; import from owning analysis skills rather than inventing facts. Produce standalone HTML for the ordinary committee memo path. Add `model-audit-tieout`, `scenario-sensitivity-generator`, `ib-deck-qc`, `financial-source-of-truth`, and the relevant model/financing/covenant skills.

Required handoffs:

- `cim_teardown_to_memo_builder`
- `company_tearsheet_to_memo_builder`
- `meeting_prep_to_memo_builder`
- `pitch_deck_builder_to_ib_deck_qc`

Default hero: deal committee HTML report. Companion artifacts may include model audit report, sensitivity workbook, deck outline, and QC report. Support includes source register, model citations, manifests, and handoff payloads.

Ask which committee is the audience and what decision is requested. Route to Legal for legal, tax, accounting, fairness, fiduciary, securities, or regulatory conclusions.

## Manifest Routing Metadata

When a workflow writes files, add routing metadata to the artifact manifest when known:

- `transaction_workflow`
- `lead_skill`
- `supporting_skills`
- `routing_confidence`
- `handoff_contracts_used`
- `routing_reason`

These fields explain the chosen route. They do not change the artifact hierarchy: the hero deliverable stays first, companion deliverables second, and support artifacts last.

## Clarifying Question Discipline

Ask at the router stage only when the answer changes plugin admission or lead-skill selection. Do not ask router-stage questions about format, depth, audience, or artifact architecture merely to resolve the deliverable; pass those unresolved choices to the selected lead skill. Good routing questions identify:

- transaction side: sell-side, buy-side, issuer financing, restructuring, board/committee, or model update;
- audience and posture: analyst, associate, VP, MD, client, board, lender, committee, or external;
- source packet: controlling files, model version, date/as-of, and whether final circulation is expected.

After routing, the selected lead skill uses the adaptive `request_user_input` preflight in `references/deliverable-intake-policy.md` when deliverable choices remain unresolved. If enough routing context exists, select the lead skill and proceed with the handoff.

## Escalation Rules

Route outside Investment Banking when the core task is not bank transaction work:

- Legal: legal advice, contract drafting/interpretation, fiduciary advice, fairness opinions, bankruptcy legal conclusions, securities disclosure, privilege, regulatory advice.
- Private Markets: sponsor IC, portfolio monitoring, value creation, private-market diligence with no bank-side process output.
- Public Markets: public-equity or public-credit investment research, trade recommendations, catalyst calendars, earnings work.
- Corporate Finance: internal FP&A, budget, cash forecast, procurement, close/reconciliation, or CFO operating reporting.
- Presentations or Documents: native PPTX/DOCX production when the user explicitly asks for those file types.
