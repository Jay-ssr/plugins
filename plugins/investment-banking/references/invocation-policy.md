# Investment Banking Invocation Policy

## Entry Gate

Activate this plugin only when at least one of these conditions is satisfied:

1. **Explicit invocation.** The user tags or names Investment Banking, uses `@investment-banking`, supplies its plugin link, or explicitly invokes one of its skills.
2. **Perfect-fit mandate.** The prompt unambiguously asks for a banker-owned transaction execution workflow where selecting Investment Banking is not an inference from generic finance wording.

When the fit is merely plausible, do not activate this plugin. A deliverable format, finance topic, company name, valuation mention, or available spreadsheet does not on its own pass the gate.

## Perfect-Fit Signals

The untagged prompt must contain a strong banking workflow signal, such as:

- a sell-side auction, CIM/teaser, buyer universe, management presentation, or banker pitch-book request for a client transaction;
- an M&A process, merger/accretion-dilution model, fairness committee support, or board transaction package;
- issuer ECM, DCM, or LevFin advice, capital-markets execution materials, or a restructuring/recovery pitch in an advisory context.

## Non-Triggers

Do not invoke Investment Banking automatically for generic requests to create a memo, report, deck, model, dashboard, valuation, company profile, diligence summary, spreadsheet cleanup, meeting brief, or source synthesis. Do not choose it simply because a user works in finance or an artifact could be used by a banker.

## After Activation

Once this gate is met, the router uses `plugin-routing-playbook.md` only to choose the owning workflow. The selected lead workflow, not the router, reads `deliverable-intake-policy.md` before a new standalone reader-facing hero artifact begins and resolves presentation choices. Specialist and rendering skills inherit this activation decision and do not independently broaden the plugin's scope.
