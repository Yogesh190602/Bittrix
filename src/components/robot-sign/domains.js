import { programs } from "../../data/programs";

/* ---------------------------------------------------------------------- */
/* The five programmes the robot presents                                  */
/*                                                                         */
/* Each programme is a labelled card beside the robot — icon, caption and  */
/* name — wired back to its chest core. Order is the presentation order,   */
/* alternating sides so the highlight moves across the robot.              */
/*                                                                         */
/* Names, taglines and skills come from src/data/programs.js — the model   */
/* shipped with its own hard-coded list ("Data Science", "Cloud Computing" */
/* and others BitTrix does not teach), which this replaces.                */
/* ---------------------------------------------------------------------- */

/* Card centres in metres. Each card's inner edge sits CARD_HALF_WIDTH in
   from its centre, which is where the wire from the chest core ends. The
   captions are the ones the old hero placeholder used on these cards. */
const LAYOUT = [
  { id: "artificial-intelligence", icon: "brain",   kicker: "Intelligence",         position: [-0.72, 0.95, 0.2] },
  { id: "cybersecurity",           icon: "shield",  kicker: "Digital defense",      position: [0.72, 0.86, 0.2] },
  { id: "web-engineering",         icon: "code",    kicker: "Build & deploy",       position: [-0.74, 0.56, 0.2] },
  { id: "networking",              icon: "network", kicker: "Connected systems",    position: [0.74, 0.5, 0.2] },
  { id: "blockchain",              icon: "cube",    kicker: "Decentralized future", position: [-0.7, 0.18, 0.2] },
  { id: "game-development",        icon: "gamepad", kicker: "Play & create",        position: [0.7, 0.18, 0.2] },
];

/* Half a card's width in world units. Cards are sized in CSS as a fixed
   share of the canvas width (see .robot-card), so this holds at any size. */
export const CARD_HALF_WIDTH = 0.3;

export const DOMAINS = LAYOUT.map((entry) => {
  const program = programs.find((p) => p.id === entry.id);
  const label = program.label.toLowerCase();
  return {
    ...entry,
    name: program.name,
    tagline: label.charAt(0).toUpperCase() + label.slice(1),
    skills: program.skills,
  };
});
