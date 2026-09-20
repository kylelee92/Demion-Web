# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite — chosen by the operator. `three`, `@types/three`, and `@react-three/fiber` are already installed and stay available. No bundler config, scaffold, or source files exist yet; the Vite setup is still to be created.

## Users

The project owner is the only user. This is a single-operator production tool for building the owner's own sites — there are no third-party end users of the tool itself, no accounts, no onboarding, no permissions, and no multi-tenant concerns. The tool is judged on production speed and the quality of what it emits.

The generated sites do have public visitors, but those visitors are users of the output, not of this system.

## Product Purpose

A homepage production system. The operator supplies site information, and the system carries it through to a deployed, reachable site. Success is a finished homepage that ships without hand-assembling each one.

## Positioning

Scope runs end to end through deployment rather than stopping at generation — the operator is not handed a code drop to finish by hand.

*Undecided:* what makes the emitted sites meaningfully different from template-based site builders. No differentiating mechanism has been stated yet, and future work must not assert one.

## Operating Context

- Windows workstation. Node 20.12.1, npm 10.5.1, uv 0.12.17, Python 3.12.
- Claude Code (desktop app) is the working environment.
- NotebookLM MCP is connected, intended for offloading long source material instead of pasting it into the working context.
- Design guidance installed: `impeccable` (this skill) plus the taste-skill set (`design-taste-frontend`, `minimalist-ui`, `industrial-brutalist-ui`, `high-end-visual-design`, and others).

## Capabilities and Constraints

- Input: site information supplied by the operator. Output: a deployed site.
- Deployment is inside the product's scope.
- The project is effectively greenfield: dependencies and one design reference document, nothing else.
- Node 20.12.1 is below the `>=22.18.0` that the Impeccable npm CLI declares. It runs today with an `EBADENGINE` warning; a future version may not.

*Undecided, and not to be invented by later work:*
- Hosting and deploy target.
- Whether each generated site is a one-off artifact or stays re-editable and regenerable.
- Whether the generator emits static HTML or a React app per site.
- How many sites the system is expected to carry.

## Evidence on Hand

- `design-portfolio/디자인-시안-3종.md` — three style-preset concepts (editorial luxury / utilitarian minimal / industrial brutalist), each with palette, type stack, layout rules, and the field it suits.
- The same three concepts as full desktop landing-page artboards on a live canvas: https://claude.ai/artifact/95h2jDDZ48iGpzE6KkNv6B (private to the owner).
- A Notion page mirroring the concept specs: https://app.notion.com/p/3e17410fd53d8162882df199ad372f6d (private draft).
- No customers, traffic, testimonials, benchmarks, pricing, or shipped sites exist. Future work must not imply otherwise.

## Product Principles

1. **Single operator, no product surface for anyone else.** Spend nothing on accounts, onboarding, permissions, or multi-tenancy.
2. **Deployed beats generated.** Work is finished when a site is reachable, not when code exists.
3. **Variety comes from explicit presets, not per-site improvisation.** The style-preset set is the unit of design reuse; a new site picks one rather than inventing a look.
4. **Record what the generator depends on.** A site should be regenerable from its recorded inputs rather than re-decided from memory.
