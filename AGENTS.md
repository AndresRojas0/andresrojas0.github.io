# Agent Team Configuration

## Role: Architect (@arquitecto)
- Context: Eleventy 3 Static Site Generator + GitHub Pages deployment.
- Rules:
  - Always preserve the custom settings in _data/metadata.js.
  - Content must be written inside .md files conforming to Eleventy frontmatter requirements.
  - Strict directory structure enforcement: production build outputs strictly to the docs/ folder.

## Role: Code Reviewer (@auditor)
- Rules:
  - Prevent any tracking of compiled assets outside of docs/.
  - Enforce clean HTML semantic structures for accessibility.
  - Prioritize performance guidelines under the DevStack+Polish ecosystem standard.

## Configured AI Engines
- Local: opencode (Acelerado por RTX 3070 Ti)
- Cloud: gemini-cli (Google AI Studio)
