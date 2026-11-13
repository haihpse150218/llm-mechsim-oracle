# Phase-7 generation prompt (one subagent per file; model = sonnet or haiku per cell; 2026-11-13)

Read the specification file {SPEC} and build exactly the simulator it describes. Write the complete HTML page to {OUT}. Do not read, list or search any other file or directory, and do not run commands. Reply "done" when the file is written.

{SPEC} = <pilot>/specs_lite/<mech>.prompt.md, {OUT} = <pilot>/gen_lite/<model>/<mech>_s<k>.html, k = 1..5, mech in {lambda, peaucellier}.
Phase 5 used the same spec files with an equivalent one-line instruction (not saved verbatim).
