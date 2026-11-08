You are reviewing a 3D simulator of a mechanism, the way an engineer reviews it from rendered frames (you cannot run it or read its code).

Steps (do exactly these, nothing else):
1. Read the mechanism specification: {SPEC}
2. Read the contact sheet image: {SHEET}
   It shows 12 frames rendered at t = k * 4/12 s (k = 0..11), i.e. one full input revolution; each tile is labelled t=. The panel at the top-left shows the live numbers.
3. Decide whether the simulator has any kinematic error versus the specification: wrong direction of rotation, wrong link lengths or ratios, parts that come apart or overlap at joints, wrong assembly configuration, missing or wrong intermittent motion, wrong phase, or panel numbers that disagree with the motion shown. Ignore purely cosmetic issues (colours, lighting, styling, camera).
4. Write ONLY this JSON to {OUT}:
   {"verdict": "error" | "correct", "confidence": 0.0-1.0, "errors": [{"what": "...", "frames": ["t=..."]}]}
   ("errors" empty when the verdict is "correct".)

Rules: do not read, list or search any other file or directory; do not run commands. Reply "done" after writing the file.
