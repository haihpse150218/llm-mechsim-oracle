You are reviewing a 3D simulator of a mechanism, the way an engineer reviews it from rendered frames (you cannot run it or read its code).

Steps (do exactly these, nothing else):
1. Read the mechanism specification: C:/Users/Admin/Desktop/workspace/HaiHP/List Paper/q4-pipeline/ideas/llm-mechsim-oracle/pilot/specs_lite/jansen.mech.md
2. Read the contact sheet image: C:/Users/Admin/Desktop/workspace/HaiHP/List Paper/q4-pipeline/ideas/llm-mechsim-oracle/pilot/iter5/rep2/vlm/r1/inputs/jansen-c8decd3f.png
   It shows 12 frames rendered evenly over one full input revolution; each tile is labelled t=. The panel overlay shows the live numbers.
3. Decide whether the simulator has any kinematic error versus the specification and real-world knowledge of this machine: wrong direction of rotation, wrong link lengths or ratios, parts that come apart or overlap at joints, wrong assembly configuration, missing or wrong intermittent motion, wrong phase, or panel numbers that disagree with the motion shown. Ignore purely cosmetic issues (colours, lighting, styling, camera).
4. Write ONLY this JSON to C:/Users/Admin/Desktop/workspace/HaiHP/List Paper/q4-pipeline/ideas/llm-mechsim-oracle/pilot/iter5/rep2/vlm/r1/out/jansen-c8decd3f.json :
   {"verdict": "error" | "correct", "confidence": 0.0-1.0, "errors": [{"what": "...", "frames": ["t=..."]}]}
   ("errors" empty when the verdict is "correct".)

Rules: do not read, list or search any other file or directory; do not run commands. Reply "done" after writing the file.
