/* ---------------------------------------------------------------------- */
/* Programme icons, as data                                                */
/*                                                                         */
/* One definition drawn in two places: <Icon> renders these as SVG on the   */
/* page and on the robot's programme cards, and the robot's sign draws the  */
/* same shapes onto its canvas. Keeping a single source is what stops the   */
/* sign and the cards showing two different pictures of the same thing.    */
/*                                                                         */
/* All shapes sit in a 24 x 24 box and are stroked, not filled, at 1.6.     */
/* ---------------------------------------------------------------------- */

export const ICON_STROKE = 1.6;

export const DOMAIN_ICONS = {
  shield: [
    { path: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" },
    { path: "m8 12 3 3 5-6" },
  ],
  brain: [
    { path: "M12 5c-2-4-7-1-6 2-4 0-4 6-1 7-2 4 3 8 7 5 4 3 9-1 7-5 3-1 3-7-1-7 1-3-4-6-6-2Z" },
    { path: "M12 5v14M8 8l4 3m4-3-4 3m-5 5 5-2 5 2" },
  ],
  cube: [
    { path: "m12 3 9 5v9l-9 5-9-5V8zM3 8l9 5 9-5M12 13v9" },
  ],
  network: [
    { rect: [9, 2, 6, 5, 1] },
    { rect: [2, 17, 6, 5, 1] },
    { rect: [16, 17, 6, 5, 1] },
    { path: "M12 7v5M5 17v-5h14v5" },
  ],
  code: [
    { path: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16" },
  ],
  gamepad: [
    { path: "M7.5 6.5h9a5.3 5.3 0 0 1 5.2 6.4l-.9 3.8a2.4 2.4 0 0 1-4 1.2l-2.1-2h-5.4l-2.1 2a2.4 2.4 0 0 1-4-1.2l-.9-3.8a5.3 5.3 0 0 1 5.2-6.4Z" },
    { path: "M6.5 11.5h4M8.5 9.5v4" },
    { circle: [15.2, 10.6, 0.6] },
    { circle: [17.4, 12.8, 0.6] },
  ],
};

/* Stroke one icon onto a 2D canvas, `size` pixels square, at the current
   origin. Uses the canvas's current strokeStyle. */
export function strokeIconOnCanvas(g, name, size) {
  const shapes = DOMAIN_ICONS[name];
  if (!shapes) return;
  g.save();
  g.scale(size / 24, size / 24);
  g.lineWidth = ICON_STROKE;
  g.lineCap = "round";
  g.lineJoin = "round";
  for (const shape of shapes) {
    const p = new Path2D();
    if (shape.path) {
      p.addPath(new Path2D(shape.path));
    } else if (shape.rect) {
      const [x, y, w, h, r] = shape.rect;
      if (p.roundRect) p.roundRect(x, y, w, h, r);
      else p.rect(x, y, w, h);
    } else if (shape.circle) {
      const [cx, cy, r] = shape.circle;
      p.arc(cx, cy, r, 0, Math.PI * 2);
    }
    g.stroke(p);
  }
  g.restore();
}
