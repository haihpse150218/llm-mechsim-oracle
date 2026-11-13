# Phase-8 (other-vendor replication) prompts, DeepSeek API, 2026-11-13

Models: `deepseek-v4-pro` (folder `dspro`) and `deepseek-flash` (folder `dsflash`), both reasoning models, default
sampling, `max_tokens` 128000, one fresh request per file (no conversation state). Runner: `oracle/api_agent.mjs`.

An API model cannot read or write files, so the runner inlines the same files a Claude Code sub-agent was told to read
(the spec; for repair also the current simulator and all review reports, oldest first) and writes the returned HTML
to the same path. The exact templates are `GEN_PROMPT` and `REPAIR_PROMPT` in `oracle/api_agent.mjs`; they follow
`gen_lite/PROMPT7.md` and `iter/PROMPT.md` sentence by sentence except for the file-I/O instructions:
- generation: "Reply with the complete HTML page and nothing else, inside a single ```html code block."
- repair: first line `CHANGED: ...` or `NO_CHANGE: ...`; if CHANGED, the whole revised file in one ```html block.
Raw replies (`*.raw.md`) and usage metadata (`*.api.json`) are stored next to every output.
