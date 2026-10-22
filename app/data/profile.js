// Everything the receipt prints, in one place.

const profile = {
  name: "Arjun Sethi",
  role: "Software Engineer",
  location: "New Delhi, India",
  tagline: "Transforming ideas into functional software · Enjoys hiking in nature",
  about:
    "I love crafting digital experiences that just work: seamless functionality, elegant design, and a relentless drive to get past the hard problems.",
  email: "arjunsethi33@gmail.com",
};

const timeline = [
  {
    span: "12/2025–present",
    title: "Software Engineer",
    company: "QDC",
    companySite: "https://www.quickdrycleaning.com",
    summary:
      "Building a multi-tenant dry-cleaning platform: Azure → AWS migration, the PostgreSQL data layer, a CDC reporting pipeline, and AI voice agents for the POS and phone.",
  },
  {
    span: "09/2023–11/2025",
    title: "Full Stack Developer",
    company: "Neusort",
    companySite: "https://www.neusort.com",
    summary:
      "Led the architecture of a distributed interview platform for enterprise clients: real-time video, an AI coding interviewer, payments, and CI/CD on Azure.",
  },
  {
    span: "03/2023–08/2023",
    title: "Software Developer Intern",
    company: "Hyrr",
    summary:
      "Built a gamified React Native assessment app with 10 cognitive games for candidate evaluation.",
  },
];

const education = {
  degree: "Bachelor of Technology",
  field: "Electronics and Communication Engineering",
  school: "Rajiv Gandhi Govt. Engg. College",
  location: "Himachal Pradesh, IN",
  span: "2019–2023",
};

const skills = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "SQL", "HTML", "CSS"] },
  { group: "Frontend", items: ["React", "React Native", "Next.js", "Tailwind"] },
  {
    group: "Backend",
    items: ["Node.js", "NestJS", "Express.js", "Prisma", "REST", "WebSockets", "Temporal", "Redis", "RabbitMQ"],
  },
  { group: "Data", items: ["PostgreSQL", "Kafka", "Debezium (CDC)", "NoSQL", "Database Design"] },
  {
    group: "Infra",
    items: ["AWS (EKS, RDS, S3, KMS)", "Azure", "Kubernetes", "Helm", "Docker", "Jenkins", "CI/CD", "Firebase", "Linux", "Git"],
  },
  { group: "AI", items: ["LLM Agents", "Voice (LiveKit, Twilio, ElevenLabs)"] },
  { group: "Practices", items: ["Microservices", "Distributed Systems", "OOP", "Full-Stack"] },
  { group: "Spoken", items: ["English", "Hindi"] },
];

const contact = [
  { label: "Mail", value: "arjunsethi33@gmail.com", href: "mailto:arjunsethi33@gmail.com" },
  { label: "GitHub", value: "@fishmeister09", href: "https://github.com/fishmeister09" },
  { label: "LinkedIn", value: "@arjunsethi33", href: "https://www.linkedin.com/in/arjunsethi33/" },
];

const quote = {
  text: "Think of how stupid the average person is, and realize half of them are stupider than that.",
  author: "George Carlin",
  href: "https://www.youtube.com/watch?v=AKN1Q5SjbeI",
};

export { profile, timeline, education, skills, contact, quote };
