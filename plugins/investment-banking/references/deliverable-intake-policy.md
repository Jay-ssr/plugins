# Adaptive Deliverable Intake Policy

Use this policy before an Investment Banking skill acting as the lead owner creates a new standalone reader-facing artifact. It applies to memos, reports, briefings, decks, models, schedules, trackers, dashboards, and monitoring views. Support skills and renderers inherit the lead skill's resolved choices; they do not independently interrupt an already scoped workflow.

## Presentation-Surface Precedence

Resolve presentation format in this order:

1. Honor an explicit user-requested format.
2. Preserve the format of an existing artifact for edits and direct reviews unless the user requests conversion. When the workflow creates a separate review report, use that workflow's declared natural artifact without converting the source artifact.
3. Use the workflow's obvious natural artifact when the job is inherently artifact-specific:
   - Use an XLSX workbook for models, reusable calculations, schedules, trackers, normalization, and data cleaning.
   - Use a native deck or document for explicit slide, deck, presentation, or document work.
4. Apply a saved reader-facing output preference as the default when multiple reader-facing formats remain reasonable.
5. Otherwise, resolve any new standalone reader-facing output to polished standalone HTML.
6. Use chat-only output only when the user explicitly requests chat, inline, quick, no-file, or a similarly lightweight response.

Do not silently choose chat because the request appears narrow, conversational, or easy to answer inline. HTML is the normal fallback for a completed reader-facing deliverable, not a signal to compress analysis or force a standardized dashboard.

A direct analytical question, a detail-page hero prompt, or the absence of a requested filename is not an explicit lightweight-response request. Do not choose chat-only output because a concise answer seems sufficient or more useful. When a saved HTML preference applies and the workflow's natural artifact is reader-facing HTML, create the HTML artifact.

Once the presentation surface resolves to HTML, treat that as a committed deliverable decision. Create the HTML artifact before responding; do not later reconsider whether the analysis belongs in chat, split the full deliverable between the artifact and chat, or substitute an inline report. Use chat only as a concise cover note linking to the HTML artifact.

## When To Ask

Before source gathering, substantive analysis, building, or rendering, determine whether the user has already specified the output format, level of analysis, intended audience/use, and any decision-critical focus.

- Ask only for choices that are materially unresolved.
- Do not ask the format question when the user already requests DOCX, HTML, PPTX, XLSX, a dashboard, or inline output.
- A format-only request resolves only the delivery surface. For example, "make a doc" can select a Word document, but does not resolve depth, audience/use, or analytical focus. Do not silently infer those choices.
- When editing or reviewing an existing deck, workbook, or document, preserve that artifact's format as the selected surface unless the user asks for a conversion. Ask only missing depth, audience/use, or focus questions that would change the work.
- Apply a saved reader-facing output preference as the default when multiple reader-facing formats are reasonable. Do not let a saved HTML preference override an obvious workbook, deck, document, or existing-artifact workflow. Models, model updates, trackers, workbook audits, workbook-first calculations, deck requests, document requests, and edits to an existing artifact keep their natural format unless the user explicitly asks for conversion.
- Reuse answers already given in the current conversation or multi-step workflow. Downstream skills, QC steps, and `dashboard-builder` do not ask again unless a new hero artifact introduces a material unresolved choice.
- Keep these preferences in conversational context; do not add preference fields to manifests, handoff payloads, or renderer schemas.

## Native Prompt Contract

When a material choice remains unresolved and `request_user_input` is callable in an interactive Codex runtime, call `request_user_input` before generating the hero artifact:

- Include only unresolved decisions and no more than three questions.
- Give each question two or three meaningful options.
- The UI supplies a free-form `Other` response automatically; never include an `Other` option in the options list.
- Filter format choices to surfaces that the active runtime can produce. If a requested format is unavailable, ask the user to choose a feasible surface rather than silently substituting one.

If `request_user_input` is unavailable or errors in an interactive run, the missing material choices still require intake: ask one concise plain-text scoping question in normal chat and wait for the answer, covering only the unresolved preferences. Do not present a choice menu when the runtime disallows it, and do not silently select depth or audience. In a non-interactive run, apply the existing workflow default and state the assumed format and depth in the result.

When using the interactive chat fallback in the Codex composer, append this sentence after the blocking question: "For clickable intake options, switch to Plan mode with `Shift + Tab` in the Codex composer and resend your request; otherwise answer here and I will continue." This is guidance, not a requirement: do not require a mode change or use this hint instead of asking the unresolved scoping question.

## Format Choices

Use the format options for the routed artifact lane:

| Artifact lane | Options |
| --- | --- |
| Memo, narrative report, or briefing | `HTML report (Recommended)`, `Word document (.docx)`, `Inline response` |
| CIM, teaser, or CIM storyboard | `Polished HTML CIM / storyboard (Recommended)`, `Word document (.docx)`, `PowerPoint storyboard or deck (.pptx)` |
| Covenant package, amendment, or waiver review | `Polished HTML covenant review memo (Recommended)`, `Excel covenant headroom workbook`, `Word memo (.docx)` |
| Debtor-side recovery, sale-path, or restructuring alternatives review | `Polished HTML restructuring memo (Recommended)`, `Excel recovery waterfall workbook`, `Word memo (.docx)` |
| Sponsor LBO model, take-private screen, or acquisition-financing model | `Excel sponsor LBO workbook (Recommended)`, `Polished HTML underwriting summary`, `Inline screening view` |
| Merger model, accretion/dilution screen, or pro forma ownership model | `Excel merger / accretion workbook (Recommended)`, `Polished HTML transaction summary`, `Inline screening view` |
| Private credit screen, lender underwriting memo, or acquisition-financing credit review | `Polished HTML lender underwriting memo (Recommended)`, `Excel debt-capacity / lender-case workbook`, `Word credit memo (.docx)` |
| Deck or presentation | `PowerPoint deck (.pptx) (Recommended)`, `HTML storyboard`, `Inline outline` |
| Model, schedule, tracker, or tabular package | `Excel workbook (.xlsx) (Recommended)`, `HTML summary`, `Inline summary` |
| Dashboard or monitoring view | `HTML dashboard (Recommended)`, `Excel tracker`, `Inline brief` |

The chosen surface does not remove mandatory calculation or control artifacts. For example, a model workflow may still need its workbook as a companion even when the user wants an HTML executive view.

## Depth And Framing

When depth is unresolved, offer:

- `Focused first pass`: top drivers, risks, targeted analysis, and next questions.
- `Full working analysis (Recommended)`: the complete normal working artifact.
- `Deep diligence package`: expanded scenarios, supporting tables, evidence requests, and appendices.

Depth is not readiness. A deeper output is not client-ready, committee-ready, or decision-grade without the evidence and QA gates required by the owning skill.

Use the third question slot for audience/use when it changes structure, circulation posture, citations, or delivery:

- `Banker working team`
- `Senior or committee`
- `Client or external`

If audience is already clear or immaterial and the scope remains broad, ask for focus instead:

- `Valuation / returns`
- `Process / materials`
- `Diligence risks`

## Expected Behavior

- A generic pitch-materials request with no stated surface asks for format, depth, and audience before building, and recommends `PowerPoint deck (.pptx)`.
- A generic CIM, teaser, or CIM storyboard request recommends a polished HTML document; use PowerPoint without a format question only when the request explicitly asks for slides, a deck, a management presentation, or a lender presentation.
- A covenant package, amendment, or waiver review request recommends a polished HTML covenant review memo; use an Excel workbook as the first read without a format question when the request is for computed headroom, basket capacity, or scenario calculations.
- A debtor-side sale-path, restructuring-alternatives, or board-recommendation request recommends a polished HTML restructuring memo; use an Excel recovery workbook as the first read without a format question when the request is primarily for calculated recoveries, claims waterfalls, or value-break sensitivities.
- A sponsor LBO model, take-private screen, or acquisition-financing model recommends an Excel sponsor LBO workbook; use a polished standalone HTML underwriting summary only when the user selects or explicitly requests a narrative view.
- A merger model, accretion/dilution screen, or pro forma ownership model recommends an Excel merger/accretion workbook; use a polished standalone HTML transaction summary only when the user selects or explicitly requests a narrative view.
- A private-credit initial screen or lender underwriting memo recommends a polished standalone HTML lender underwriting memo; use a workbook as the hero deliverable for reusable debt-capacity, liquidity, covenant, or downside calculations.
- An explicit request for an HTML memo skips format intake and asks only any consequential unresolved depth, audience, or focus choice.
- A request to "make a doc" resolves Word format only and still asks for unresolved depth and audience before research begins.
- A review of an existing workbook preserves `.xlsx` as the surface and does not ask whether to turn it into a deck or report.
