import { strokeIconOnCanvas } from "../iconShapes";

/* ---------------------------------------------------------------------- */
/* Canvas drawing for the robot's sign face                              */
/*                                                                         */
/* The sign is a real 3D panel in the robot's hands, so its face is a      */
/* canvas texture rather than DOM: it tilts, catches the lighting and sits */
/* exactly where the model put it. It is redrawn whenever the programme or */
/* the theme changes.                                                      */
/* ---------------------------------------------------------------------- */

const FONT = `"Inter", "Aptos", "Segoe UI", system-ui, sans-serif`;

const FACE = {
  dark: {
    eyebrow: "#c9a2e6",
    tagline: "#fdf4d2",
    nameFrom: "#d2b0ee",
    nameTo: "#e7d2f7",
    tags: "#e9dfc4",
    dot: "#c9a2e6",
    icon: "#e7d2f7",
    cap: "#fdf4d2",
  },
  light: {
    eyebrow: "#4e1f6e",
    tagline: "#2b1a33",
    nameFrom: "#7b3fa8",
    nameTo: "#4e1f6e",
    tags: "#4a3b52",
    dot: "#7b3fa8",
    icon: "#4e1f6e",
    cap: "#4e1f6e",
  },
};

/* The largest size, down to `min`, at which `text` fits in `maxWidth`. */
function fitFont(g, text, weight, max, min, maxWidth) {
  let size = max;
  g.font = `${weight} ${size}px ${FONT}`;
  while (g.measureText(text).width > maxWidth && size > min) {
    size -= 4;
    g.font = `${weight} ${size}px ${FONT}`;
  }
  return size;
}

function drawCap(g, x, y, color) {
  g.fillStyle = color;
  g.strokeStyle = color;
  g.beginPath();
  g.moveTo(x, y + 80);
  g.lineTo(x + 200, y);
  g.lineTo(x + 400, y + 80);
  g.lineTo(x + 200, y + 160);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(x + 70, y + 120);
  g.lineTo(x + 70, y + 200);
  g.quadraticCurveTo(x + 200, y + 270, x + 330, y + 200);
  g.lineTo(x + 330, y + 120);
  g.lineTo(x + 200, y + 170);
  g.closePath();
  g.fill();
  g.lineWidth = 10;
  g.beginPath();
  g.moveTo(x + 360, y + 95);
  g.lineTo(x + 360, y + 200);
  g.stroke();
}

/* The face, laid out like the site's board: a small eyebrow, the
   programme's tagline, its name in the accent gradient, and its skills —
   with the programme's icon on the left and the graduation cap on the
   right. Canvas is 2600 x 880, the model's aspect for the sign. */
export function drawSignFace(g, w, h, domain, theme) {
  const c = FACE[theme === "dark" ? "dark" : "light"];
  g.clearRect(0, 0, w, h);
  g.textAlign = "center";
  g.textBaseline = "middle";

  g.fillStyle = c.eyebrow;
  g.font = `500 54px ${FONT}`;
  g.letterSpacing = "20px";
  g.fillText("NOW TEACHING", w / 2, 118);
  g.letterSpacing = "0px";

  /* Headline column sits between the two icons. */
  const column = 1440;

  g.fillStyle = c.tagline;
  fitFont(g, domain.tagline, 700, 116, 70, column);
  g.fillText(domain.tagline, w / 2, 290);

  fitFont(g, domain.name, 800, 196, 96, column);
  const half = Math.min(column, g.measureText(domain.name).width) / 2;
  const gradient = g.createLinearGradient(w / 2 - half, 0, w / 2 + half, 0);
  gradient.addColorStop(0, c.nameFrom);
  gradient.addColorStop(1, c.nameTo);
  g.fillStyle = gradient;
  g.fillText(domain.name, w / 2, 495);

  /* As many skills as fit on one line, in catalogue order. */
  g.font = `500 64px ${FONT}`;
  const sep = "   •   ";
  const maxTags = 2200;
  const tags = [];
  for (const skill of domain.skills) {
    const next = [...tags, skill].join(sep);
    if (g.measureText(next).width <= maxTags) tags.push(skill);
  }
  /* Drawn piecewise so the separating dots can take the accent colour. */
  const pieces = tags.flatMap((tag, i) => (i ? [sep, tag] : [tag]));
  const total = g.measureText(pieces.join("")).width;
  let x = w / 2 - total / 2;
  g.textAlign = "left";
  for (const piece of pieces) {
    g.fillStyle = piece === sep ? c.dot : c.tags;
    g.fillText(piece, x, 720);
    x += g.measureText(piece).width;
  }
  g.textAlign = "center";

  /* Programme icon on the left, graduation cap on the right. */
  /* The same icon the programme's card shows, from iconShapes.js. Those
     shapes fill most of their box, so 330px here matches the visual size
     the model's old, smaller drawings had in a 400px box. */
  g.save();
  g.translate(185, 235);
  g.strokeStyle = c.icon;
  strokeIconOnCanvas(g, domain.icon, 330);
  g.restore();

  drawCap(g, 2060, 250, c.cap);
}
