(() => {
    const canvas = document.getElementById('bio-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const C_MAIN  = 'rgba(0,0,0,0.055)';
    const C_MID   = 'rgba(0,0,0,0.04)';
    const C_LIGHT = 'rgba(0,0,0,0.025)';
    const FONT    = '500 10px "DM Sans", sans-serif';

    const S = (s, c = C_MAIN) => { ctx.strokeStyle = c; ctx.lineWidth = s; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; };
    const dot = (x, y, r, f = C_MAIN) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = f; ctx.fill(); };
    const hexPath = (cx, cy, r, rot = 0) => { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i + rot, px = cx + r * Math.cos(a), py = cy + r * Math.sin(a); i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); } ctx.closePath(); };
    const lbl = (t, x, y, c = C_LIGHT) => { ctx.save(); ctx.font = FONT; ctx.fillStyle = c; ctx.fillText(t, x, y); ctx.restore(); };

    function drawHelix(x, amp, freq, phase, H) {
      S(1.2); [0, Math.PI].forEach(off => { ctx.beginPath(); for (let y = 0; y < H; y += 2) { const px = x + amp * Math.sin(freq * y + phase + off); y === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y); } ctx.stroke(); });
      const period = (2 * Math.PI) / freq;
      for (let y = 20; y < H - 20; y += period / 2) { const x1 = x + amp * Math.sin(freq * y + phase), x2 = x + amp * Math.sin(freq * y + phase + Math.PI); S(1, C_MID); ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); dot(x1, y, 2.2, C_MAIN); dot(x2, y, 2.2, C_MAIN); }
    }

    function drawBenzene(cx, cy, r, rot = 0) { S(1.1); hexPath(cx, cy, r, rot); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, r * 0.52, 0, Math.PI * 2); ctx.stroke(); dot(cx, cy, 2, C_MAIN); }

    function drawCell(cx, cy, r) {
      S(1.4, C_MID); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      S(0.6, C_LIGHT); ctx.beginPath(); ctx.arc(cx, cy, r - 3.5, 0, Math.PI * 2); ctx.stroke();
      const nr = r * 0.37, nx = cx + r * 0.1, ny = cy - r * 0.1;
      S(1, C_MAIN); ctx.beginPath(); ctx.arc(nx, ny, nr, 0, Math.PI * 2); ctx.stroke();
      S(0.6, C_LIGHT); ctx.beginPath(); ctx.arc(nx, ny, nr + 3, 0, Math.PI * 2); ctx.stroke();
      S(0.9, C_MID); ctx.beginPath(); ctx.arc(nx - nr * 0.2, ny + nr * 0.1, nr * 0.3, 0, Math.PI * 2); ctx.stroke();
    }

    function drawGPCR(cx, cy, scale = 1) {
      const pos = [{ dx: -50, dy: -8 }, { dx: -30, dy: -28 }, { dx: -4, dy: -34 }, { dx: 24, dy: -24 }, { dx: 44, dy: -4 }, { dx: 34, dy: 22 }, { dx: 6, dy: 30 }];
      S(1); pos.forEach(({ dx, dy }, i) => { const hx = cx + dx * scale, hy = cy + dy * scale, hw = 7 * scale, hh = 20 * scale; ctx.beginPath(); ctx.roundRect(hx - hw / 2, hy - hh / 2, hw, hh, hw / 2); ctx.stroke(); lbl(`TM${i + 1}`, hx - 7 * scale, hy + hh / 2 + 11 * scale); });
      S(0.8, C_MID); for (let i = 0; i < pos.length - 1; i += 2) { const a = pos[i], b = pos[i + 1]; ctx.beginPath(); ctx.moveTo(cx + a.dx * scale, cy + a.dy * scale - 20 * scale); ctx.quadraticCurveTo(cx + (a.dx + b.dx) / 2 * scale, cy + (a.dy + b.dy) / 2 * scale - 36 * scale, cx + b.dx * scale, cy + b.dy * scale - 20 * scale); ctx.stroke(); }
    }

    function drawPhyloTree(cx, cy, depth = 0, angle = -Math.PI / 2, len = 48, scale = 1) {
      if (depth > 4) return;
      const ex = cx + len * scale * Math.cos(angle), ey = cy + len * scale * Math.sin(angle);
      S(depth === 0 ? 1.2 : 0.85); ctx.strokeStyle = depth < 2 ? C_MAIN : C_MID; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
      if (depth === 4) { dot(ex, ey, 2.5 * scale, C_MAIN); return; }
      const spread = (Math.PI * 0.55) * Math.pow(0.7, depth);
      drawPhyloTree(ex, ey, depth + 1, angle - spread, len * 0.72, scale);
      drawPhyloTree(ex, ey, depth + 1, angle + spread, len * 0.72, scale);
      if (depth < 3) dot(ex, ey, 1.8 * scale, C_MID);
    }

    function drawAminoAcid(cx, cy, s = 1) {
      const dx = s * 26, dy = s * 15;
      S(1, C_MAIN); ctx.beginPath(); ctx.moveTo(cx - dx, cy); ctx.lineTo(cx, cy - dy); ctx.lineTo(cx + dx, cy); ctx.stroke();
      S(0.8, C_MID); [[cx - dx, -14, -10], [cx - dx, -14, 10]].forEach(([ox, ddx, ddy]) => { ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox + ddx * s, cy + ddy * s); ctx.stroke(); });
      S(0.8, C_MID); ctx.beginPath(); ctx.moveTo(cx, cy - dy); ctx.lineTo(cx, cy - dy - 18 * s); ctx.stroke();
      dot(cx - dx, cy, 3 * s, C_MID); dot(cx, cy - dy, 2.5 * s, C_MID); dot(cx + dx, cy, 3 * s, C_MID);
    }

    function drawRestrictionMap(sx, sy, len, s = 1) {
      S(1.1, C_MAIN); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + len * s, sy); ctx.stroke();
      S(0.6, C_MID);  ctx.beginPath(); ctx.moveTo(sx, sy + 5 * s); ctx.lineTo(sx + len * s, sy + 5 * s); ctx.stroke();
      [0.22, 0.47, 0.73, 0.89].forEach(t => { const rx = sx + t * len * s; S(0.9, C_MID); ctx.beginPath(); ctx.moveTo(rx, sy - 7 * s); ctx.lineTo(rx - 2.5 * s, sy + 2 * s); ctx.stroke(); ctx.beginPath(); ctx.moveTo(rx, sy + 13 * s); ctx.lineTo(rx + 2.5 * s, sy + 4 * s); ctx.stroke(); });
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      [{ x: W * 0.03, amp: 26, freq: 0.021, phase: 0 }, { x: W * 0.14, amp: 20, freq: 0.017, phase: Math.PI * 0.7 }, { x: W * 0.47, amp: 28, freq: 0.020, phase: Math.PI * 0.3 }, { x: W * 0.58, amp: 18, freq: 0.019, phase: Math.PI * 1.1 }, { x: W * 0.72, amp: 24, freq: 0.022, phase: Math.PI * 0.5 }, { x: W * 0.86, amp: 22, freq: 0.018, phase: Math.PI * 0.9 }, { x: W * 0.96, amp: 16, freq: 0.023, phase: Math.PI * 0.2 }].forEach(h => drawHelix(h.x, h.amp, h.freq, h.phase, H));
      [{ cx: W * 0.26, cy: 140, r: 28 }, { cx: W * 0.62, cy: 280, r: 22 }, { cx: W * 0.41, cy: 480, r: 34 }, { cx: W * 0.79, cy: 390, r: 26 }, { cx: W * 0.11, cy: 650, r: 24 }, { cx: W * 0.50, cy: 750, r: 30 }, { cx: W * 0.23, cy: 920, r: 32 }, { cx: W * 0.66, cy: 1050, r: 20 }, { cx: W * 0.43, cy: 1180, r: 36 }, { cx: W * 0.77, cy: 1420, r: 26 }, { cx: W * 0.90, cy: 1800, r: 30 }].forEach(h => { if (h.cy < H + 60) drawBenzene(h.cx, h.cy, h.r); });
      [{ cx: W * 0.30, cy: 200, s: 0.9 }, { cx: W * 0.68, cy: 560, s: 0.85 }, { cx: W * 0.20, cy: 860, s: 1.0 }, { cx: W * 0.55, cy: 1100, s: 0.9 }, { cx: W * 0.82, cy: 1320, s: 0.8 }].forEach(a => { if (a.cy < H + 60) drawAminoAcid(a.cx, a.cy, a.s); });
      [{ cx: W * 0.32, cy: 370, r: 52 }, { cx: W * 0.70, cy: 700, r: 44 }, { cx: W * 0.16, cy: 1000, r: 48 }, { cx: W * 0.57, cy: 1250, r: 56 }, { cx: W * 0.88, cy: 1500, r: 40 }].forEach(c => { if (c.cy < H + 80) drawCell(c.cx, c.cy, c.r); });
      [{ cx: W * 0.44, cy: 330, s: 0.75 }, { cx: W * 0.75, cy: 900, s: 0.70 }, { cx: W * 0.22, cy: 1380, s: 0.72 }].forEach(g => { if (g.cy < H + 100) drawGPCR(g.cx, g.cy, g.s); });
      [{ cx: W * 0.43, cy: 550, s: 0.75 }, { cx: W * 0.78, cy: 1150, s: 0.70 }, { cx: W * 0.18, cy: 1450, s: 0.72 }].forEach(t => { if (t.cy < H + 120) drawPhyloTree(t.cx, t.cy, 0, -Math.PI / 2, 44, t.s); });
      [{ sx: W * 0.25, sy: 420, len: 180, s: 0.85 }, { sx: W * 0.45, sy: 1020, len: 160, s: 0.8 }, { sx: W * 0.06, sy: 780, len: 140, s: 0.75 }, { sx: W * 0.55, sy: 1500, len: 170, s: 0.82 }].forEach(r => { if (r.sy < H + 60) drawRestrictionMap(r.sx, r.sy, r.len, r.s); });
    }

    let resizeFrame = 0;

    function resize() {
      resizeFrame = 0;
      if (document.documentElement.dataset.theme !== 'light') return;

      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
      draw();
    }

    function scheduleResize() {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(resize);
    }

    window.addEventListener('resize', scheduleResize);
    window.addEventListener('load', scheduleResize);
    new MutationObserver(scheduleResize).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  })();
