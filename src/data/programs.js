/* Program catalogue. `id` doubles as the URL slug: /programs/<id>.
   `image` is the photo on the home page's programme wheel, served from
   public/programs/ (photos from Unsplash, free to use under its licence). */

export const programs = [
  {
    id: "cybersecurity",
    code: "CS",
    name: "Cybersecurity",
    icon: "shield",
    image: "/programs/cybersecurity.jpg",
    label: "DEFEND THE DIGITAL WORLD",
    description:
      "Learn to secure systems, networks, applications, and digital infrastructure using modern security techniques and ethical hacking methodologies.",
    skills: [
      "Network Security",
      "Linux Security",
      "Ethical Hacking",
      "Web Security",
      "Penetration Testing",
      "Security Operations",
    ],
    careers: [
      "Security Analyst",
      "SOC Analyst",
      "Penetration Tester",
      "Cybersecurity Engineer",
    ],
  },
  {
    id: "artificial-intelligence",
    code: "AI",
    name: "Artificial Intelligence",
    icon: "brain",
    image: "/programs/artificial-intelligence.jpg",
    label: "BUILD WHAT THINKS AHEAD",
    description:
      "Build intelligent systems using machine learning, deep learning, generative AI, and modern AI engineering workflows.",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Generative AI",
      "LLM Applications",
      "Computer Vision",
      "AI Automation",
    ],
    careers: [
      "AI Engineer",
      "Machine Learning Engineer",
      "Data Scientist",
      "AI Research Associate",
    ],
  },
  {
    id: "blockchain",
    code: "BC",
    name: "Blockchain",
    icon: "cube",
    image: "/programs/blockchain.jpg",
    label: "ENGINEER DIGITAL TRUST",
    description:
      "Master decentralized technologies, smart contracts, Web3 development, and blockchain security concepts.",
    skills: [
      "Blockchain Fundamentals",
      "Solidity",
      "Smart Contracts",
      "DApps",
      "Web3 Development",
      "Blockchain Security",
    ],
    careers: [
      "Blockchain Developer",
      "Smart Contract Engineer",
      "Web3 Developer",
      "Blockchain Security Analyst",
    ],
  },
  {
    id: "networking",
    code: "NW",
    name: "Networking",
    icon: "network",
    image: "/programs/networking.jpg",
    label: "CONNECT EVERYTHING",
    description:
      "Learn enterprise networking, infrastructure management, routing, switching, and cloud networking technologies.",
    skills: [
      "Routing & Switching",
      "Network Administration",
      "Infrastructure Management",
      "Cloud Networking",
      "Troubleshooting",
      "Network Security",
    ],
    careers: [
      "Network Engineer",
      "Infrastructure Engineer",
      "System Administrator",
      "Cloud Support Engineer",
    ],
  },
  {
    id: "web-engineering",
    code: "WE",
    name: "Web Engineering",
    icon: "code",
    image: "/programs/web-engineering.jpg",
    label: "TURN IDEAS INTO EXPERIENCES",
    description:
      "Build modern, scalable, and responsive web applications using industry-standard development practices.",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "APIs",
      "Database Integration",
    ],
    careers: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Software Engineer",
    ],
  },
  {
    id: "game-development",
    code: "GD",
    name: "Game Development",
    icon: "gamepad",
    image: "/programs/game-development.jpg",
    label: "BUILD WORLDS PEOPLE PLAY",
    description:
      "Design and build playable games with industry engines, from core gameplay mechanics and 3D graphics to physics, multiplayer systems and publishing.",
    skills: [
      "Game Design",
      "Unity & C#",
      "Unreal Engine",
      "3D Graphics",
      "Game Physics",
      "Multiplayer Systems",
    ],
    careers: [
      "Game Developer",
      "Gameplay Programmer",
      "Game Designer",
      "Technical Artist",
    ],
  },
];

export const programBySlug = (slug) =>
  programs.find((program) => program.id === slug) || null;

export const programSlugs = programs.map((program) => program.id);
