/* Editorial content for the home page sections. */

export const trust = [
  ["code", "Project-Based Learning"],
  ["people", "Industry Mentorship"],
  ["briefcase", "Internship Opportunities"],
  ["compass", "Career Guidance"],
  ["layers", "Hands-On Projects"],
  ["book", "Industry-Relevant Curriculum"],
];

export const features = [
  ["code", "Project-Based Learning"],
  ["people", "Industry Mentorship"],
  ["briefcase", "Internship Opportunities"],
  ["network", "Cross-Domain Learning"],
  ["layers", "Real-World Projects"],
  ["award", "Professional Certifications"],
  ["folder", "Portfolio Development"],
  ["code", "GitHub Profile Building"],
  ["book", "Resume Development"],
  ["people", "LinkedIn Optimization"],
  ["chat", "Mock Interviews"],
  ["compass", "Placement Assistance"],
  ["globe", "Remote Learning"],
  ["book", "Classroom Learning"],
  ["compass", "Career Guidance"],
  ["people", "Small Batch Training"],
];

export const journey = [
  "Enroll",
  "Foundation Learning",
  "Technology Training",
  "Hands-On Projects",
  "Internship Experience",
  "Certification",
  "Portfolio Building",
  "Resume Development",
  "Interview Preparation",
  "Career Guidance",
  "Placement Assistance",
];

export const internship = [
  {
    title: "Step into the industry",
    text: "Industry exposure and real projects bring your learning closer to professional practice.",
    tags: ["Industry Exposure", "Real Projects"],
  },
  {
    title: "Build together",
    text: "Collaborate with a team and understand how ideas move through engineering workflows.",
    tags: ["Team Collaboration", "Engineering Workflows"],
  },
  {
    title: "Learn from practitioners",
    text: "Develop your technical approach and professional habits with mentorship.",
    tags: ["Technical Mentorship", "Professional Development"],
  },
  {
    title: "Prepare for what’s next",
    text: "Turn your experience into a stronger portfolio and a clearer career direction.",
    tags: ["Career Readiness"],
  },
];

/* Student cards for the home page's testimonials section. Only list
   students who are happy to appear, with their permission.

   An entry marked `placeholder: true` shows on the dev server so the layout
   can be previewed, and is dropped from production builds. With no real
   entries the section doesn't render at all.

   `photo` fills the card: put the file in public/testimonials/ and give its
   path, e.g. "/testimonials/priya.jpg". Without one the card shows the
   student's initials. The mascot photos below are stand-ins until the
   students' own photos arrive, and the programs and batches are still to be
   confirmed. */
export const testimonials = [
  {
    name: "Yogesh",
    photo: "/mascot/secure.webp",
    program: "Cybersecurity",
    batch: "2025",
    placeholder: true,
  },
  {
    name: "Bairava Santhosh",
    photo: "/mascot/coding.webp",
    program: "Artificial Intelligence",
    batch: "2025",
    placeholder: true,
  },
  {
    name: "Bharath",
    photo: "/mascot/coffee.webp",
    program: "Web Engineering",
    batch: "2024",
    placeholder: true,
  },
  {
    name: "Dani",
    photo: "/mascot/hoodie.webp",
    program: "Networking",
    batch: "2024",
    placeholder: true,
  },
  {
    name: "Joel",
    photo: "/mascot/sign.webp",
    program: "Blockchain",
    batch: "2024",
    placeholder: true,
  },
];

export const benefits = [
  ["layers", "Hands-On Projects"],
  ["briefcase", "Internship Programs"],
  ["award", "Professional Certifications"],
  ["compass", "Career Guidance"],
  ["code", "GitHub Development"],
  ["folder", "Portfolio Building"],
  ["book", "Resume Building"],
  ["people", "LinkedIn Optimization"],
  ["chat", "Mock Interviews"],
  ["compass", "Placement Assistance"],
  ["people", "Community Access"],
  ["network", "Cross-Course Learning"],
];

export const faqs = [
  {
    question: "Do I need prior programming experience?",
    answer:
      "Your starting point depends on the program. Talk to a mentor about your current skills so they can recommend a suitable learning path and explain any prerequisites.",
  },
  {
    question: "Are internships included?",
    answer:
      "Internship opportunities are part of our learning focus. Availability, eligibility, selection requirements, and whether an internship is included should be confirmed for your chosen program before enrollment.",
  },
  {
    question: "Do you provide certificates?",
    answer:
      "Certification is part of the learning journey. The team will explain the certificate type, completion criteria, and any assessment requirements for your program.",
  },
  {
    question: "Can I attend remotely?",
    answer:
      "Classroom, remote, and hybrid learning modes are offered. Contact the team to confirm which modes and schedules are available for your preferred program.",
  },
  {
    question: "How long are the programs?",
    answer:
      "Duration varies by program, learning mode, and batch schedule. Request the current curriculum and timetable from a mentor for an accurate duration.",
  },
  {
    question: "Do you provide placement assistance?",
    answer:
      "Career support includes resume development, LinkedIn optimization, mock interviews, and placement assistance. Assistance is not a guarantee of employment; outcomes depend on skills, performance, eligibility, and employer requirements.",
  },
  {
    question: "Can college students join?",
    answer:
      "College students can enquire about suitable programs and internship opportunities. The team can help check prerequisites and identify a schedule that fits academic commitments.",
  },
  {
    question: "What projects will I build?",
    answer:
      "Projects depend on your learning track and level. Possible directions include an AI assistant, network dashboard, security toolkit, blockchain voting prototype, or e-commerce application. Confirm the current project plan with your mentor.",
  },
];


/* The same eleven stages, grouped into the three phases the program is
   actually taught in. Used on the program pages. */
export const journeyPhases = [
  {
    no: "Phase 01",
    phase: "Foundation",
    note: "Get set up, get fluent, get moving.",
    steps: journey.slice(0, 3),
  },
  {
    no: "Phase 02",
    phase: "Build",
    note: "Turn training into evidence of skill.",
    steps: journey.slice(3, 7),
  },
  {
    no: "Phase 03",
    phase: "Launch",
    note: "Prepare, apply, and get hired.",
    steps: journey.slice(7),
  },
];
