---
name: investment-banking
description: Route Investment Banking work only when the user explicitly names or tags Investment Banking or unmistakably requests banker-owned transaction execution, such as a sell-side process, CIM, M&A/merger model, ECM/DCM/LevFin client mandate, or restructuring pitch. Do not use for generic memos, reports, decks, models, valuations, spreadsheets, research, or meeting preparation.
---

# Investment Banking Router

## Bundled Path Resolution

Derive the plugin root once from the actual filesystem location of this `SKILL.md`: it is two parent directories above this router directory. Set the shell working directory to that plugin root before the first bundled read or command, and resolve every router-owned bundled path from that root. Use only plugin-root-relative paths such as `references/...`, `skills/...`, and `skills/investment-banking/internal-support/...`. Do not apply `../..` to an already resolved plugin root, resolve paths from the broader marketplace or cache root, or probe alternate relative paths.

## Invocation Gate

Read `references/invocation-policy.md` before choosing any specialist.
If the prompt is neither an explicit Investment Banking invocation nor a perfect-fit banker execution mandate, do not route into this plugin.

## User Context Preflight

After the invocation gate passes and before substantive Investment Banking work, run `python3 skills/user-context/scripts/user_context_preflight.py` with the shell working directory set to this plugin's root. Set the working directory before the first attempt; do not probe alternate relative paths.

Use the returned envelope as a soft read-only preflight. Pass relevant entries from `saved_context` to the selected lead skill as handoff context. The router must not interpret saved output preferences, resolve or announce a presentation surface, or decide whether the requested work belongs in chat. Missing, malformed, unreadable, or uninitialized state must never block the requested workflow. Do not initialize, overwrite, repair, or reset state during ordinary workflow preflight. Do not inspect connectors or source readiness.

When an ordinary workflow returns `next_action.id = "offer_orientation"`, complete the requested work and then append one short optional setup offer: `I can also save a couple of Investment Banking defaults, connect source tools, offer one optional automation, and help you pick a starter workflow. Want to do that now?`

Do not append the offer for direct saved-context setup or status requests. Do not append it when `next_action` is `null`, including after onboarding is completed, deferred, or quiet. Leave other onboarding steps to the explicit `user-context` flow.

Route explicit onboarding, setup, orientation, or get-started requests, including a detail-page starter such as `Help me get started`, plus explicit remember, save, update, forget, inspect, export, reset, source-setup, or automation-setup requests for Investment Banking context to `skills/user-context/SKILL.md` as the primary workflow.

## Plugin Workflow Routing

After the gate passes, read `references/plugin-routing-playbook.md` and select one lead skill for the workflow. Use workflow and default-artifact metadata only when it helps distinguish the lead skill; do not use it to resolve the current request's output. After selecting the lead, load `skills/<lead-skill>/SKILL.md` from the plugin root before source gathering, analysis, connector use, deliverable intake, or any user-facing announcement about execution or packaging. The router must not continue substantive work as a substitute for the selected lead skill. Pass the request, routing rationale, and relevant saved context to the loaded lead skill, then load supporting skills only for the workstreams the lead skill assigns.

## Internal Support

Read `skills/investment-banking/internal-support/policy.md` when the lead workflow needs evidence control, generic data cleaning, HTML rendering, style application, or provider-specific call shaping after selecting a callable connector route. These supporting capabilities are bundled internal playbooks rather than selectable skills. Keep standalone normalization and model-audit requests with the visible `financials-normalizer` and `model-audit-tieout` workflows. For an explicitly requested internal support-only task admitted to this plugin, this router coordinates the task through the matching internal playbook.

## Deliverable Intake

The router does not perform deliverable intake. For a new standalone reader-facing hero artifact, the selected lead owner reads `references/deliverable-intake-policy.md` before source gathering or analysis and collects only unresolved preferences. The lead owner, not the router, interprets saved output preferences and resolves format, depth, artifact architecture, artifact hierarchy, and whether an explicitly lightweight response belongs in chat. Supporting skills and renderers inherit confirmed choices and do not re-prompt.

## Lead Workflow Handoff

After handoff, the selected lead workflow applies `references/artifact-manifest-standard.md`, `references/output-depth-policy.md`, and `references/deliverable-format-policy.md` as needed. Those policies govern the lead workflow's artifact and final response; they are not router-stage decision rules. For a producing skill migrated to `references/html-artifact-standard.md`, let that skill own its polished standalone HTML structure directly.
