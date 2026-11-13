"""Figure 1: Jansen leg with the published link lengths vs a generated simulator with swapped links.

Data: the published ("holy") numbers used by the oracle (pilot/oracle/run_oracle_lite.mjs, MECH.jansen.HOLY) and
SIM.params of pilot/gen_lite/sonnet/jansen_s1.html (VU/WU and UT/WT swapped; the file runs and animates).
The linkage is solved with the oracle's circle-intersection and canonical assembly branches.
Run:  python -I make_fig_jansen.py   (writes jansen.pdf next to this script)
"""
import math
import os

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

HOLY = dict(OZ=15, ZY=50, XY=41.5, ZW=61.9, XW=39.3, XV=40.1, YV=55.8, VU=39.4, WU=36.7, UT=65.7, WT=49)
GEN = dict(OZ=15, ZY=50, XY=41.5, ZW=61.9, XW=39.3, XV=40.1, YV=55.8, VU=36.7, WU=39.4, UT=49, WT=65.7)
O, X = (0.0, 0.0), (-38.0, -7.8)


def circ(P, rp, Q, rq, side):
    d = math.dist(P, Q)
    if d > rp + rq or d < abs(rp - rq) or d == 0:
        return None
    a = (rp * rp - rq * rq + d * d) / (2 * d)
    h = math.sqrt(max(0.0, rp * rp - a * a))
    u = ((Q[0] - P[0]) / d, (Q[1] - P[1]) / d)
    M = (P[0] + a * u[0], P[1] + a * u[1])
    return (M[0] - side * h * u[1], M[1] + side * h * u[0])


def pick(P, rp, Q, rq, better):
    c1, c2 = circ(P, rp, Q, rq, 1), circ(P, rp, Q, rq, -1)
    return (c1, 1) if better(c1, c2) else (c2, -1)


# canonical branches from the published geometry at crank angle 0 (same rule as the oracle)
_Z = (HOLY["OZ"], 0.0)
_Y, sY = pick(X, HOLY["XY"], _Z, HOLY["ZY"], lambda p, q: p[1] > q[1])
_W, sW = pick(X, HOLY["XW"], _Z, HOLY["ZW"], lambda p, q: p[1] < q[1])
_V, sV = pick(X, HOLY["XV"], _Y, HOLY["YV"], lambda p, q: p[0] < q[0])
_U, sU = pick(_V, HOLY["VU"], _W, HOLY["WU"], lambda p, q: p[0] < q[0])
_T, sT = pick(_W, HOLY["WT"], _U, HOLY["UT"], lambda p, q: p[1] < q[1])


def solve(L, th):
    Z = (O[0] + L["OZ"] * math.cos(th), O[1] + L["OZ"] * math.sin(th))
    Y = circ(X, L["XY"], Z, L["ZY"], sY)
    W = circ(X, L["XW"], Z, L["ZW"], sW)
    V = circ(X, L["XV"], Y, L["YV"], sV)
    U = circ(V, L["VU"], W, L["WU"], sU)
    T = circ(W, L["WT"], U, L["UT"], sT)
    return dict(O=O, X=X, Z=Z, Y=Y, W=W, V=V, U=U, T=T)


LINKS = [("O", "Z"), ("Z", "Y"), ("Z", "W"), ("X", "Y"), ("X", "W"), ("X", "V"), ("Y", "V"), ("V", "U"), ("W", "U"),
         ("U", "T"), ("W", "T")]


def panel(ax, L, title, th_pose=math.radians(200)):
    N = 360
    pts = [solve(L, 2 * math.pi * k / N)["T"] for k in range(N + 1)]
    ax.plot([p[0] for p in pts], [p[1] for p in pts], color="black", lw=1.4, label="foot path (T)")
    s = solve(L, th_pose)
    for a, b in LINKS:
        ax.plot([s[a][0], s[b][0]], [s[a][1], s[b][1]], color="0.55", lw=1.0)
    for n in ("O", "X"):
        ax.plot(*s[n], marker="^", color="black", ms=5)
    for n in ("Z", "Y", "W", "V", "U"):
        ax.plot(*s[n], marker="o", color="0.3", ms=2.5)
    ax.plot(*s["T"], marker="o", color="black", ms=4)
    ys = [p[1] for p in pts]
    xs = [p[0] for p in pts]
    ylo = min(ys)
    flat = [x for x, y in zip(xs, ys) if y < ylo + 2.0]  # ground-contact band: within 2 mm of the lowest point
    stride = max(flat) - min(flat)
    ax.set_title(title, fontsize=8)
    ax.set_aspect("equal")
    ax.set_xlim(-150, 35)
    ax.set_ylim(-112, 45)
    ax.tick_params(labelsize=7)
    ax.set_xlabel("x (mm)", fontsize=7)
    return stride


fig, axs = plt.subplots(1, 2, figsize=(6.6, 3.0), sharey=True)
s1 = panel(axs[0], HOLY, "(a) published link lengths")
s2 = panel(axs[1], GEN, "(b) generated: VU/WU and UT/WT swapped")
axs[0].set_ylabel("y (mm)", fontsize=7)
fig.tight_layout()
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "jansen.pdf")
fig.savefig(out)
fig.savefig(out.replace(".pdf", ".png"), dpi=150)
print("written", out, "strides", round(s1, 1), round(s2, 1))
