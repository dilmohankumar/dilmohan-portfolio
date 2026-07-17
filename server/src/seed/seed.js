import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/Admin.js";
import { SiteContent } from "../models/SiteContent.js";
import { Project } from "../models/Project.js";
import { Experience } from "../models/Experience.js";
import { Education } from "../models/Education.js";
import { Section } from "../models/Section.js";

const SITE_CONTENT = {
  key: "main",
  name: "Dilmohan Kumar",
  heroGreeting: "👋 Hello, World",
  roles: ["Full Stack Developer", "MERN Stack Developer", "Web3 Enthusiast"],
  bio:
    "Full Stack Developer with 7 months of experience in MERN Stack development, specializing in building " +
    "responsive and scalable web applications using React.js, Node.js, Express.js, and MongoDB. Experienced in " +
    "developing RESTful APIs, implementing authentication and authorization, and working with database-driven " +
    "applications. Familiar with Web3 technologies, including smart contract integration, crypto wallet " +
    "connectivity, Ethers.js, and Next.js. Strong problem-solving skills with a passion for building efficient, " +
    "user-focused, and production-ready applications.",
  avatarEmoji: "👨‍💻",
  avatarLabel: "MERN STACK",
  avatarLocation: "Chandigarh, India",
  accentColor: "#00c896",
  logoText: "DK.",
  navLinks: [
    { label: "About", target: "about" },
    { label: "Projects", target: "projects" },
    { label: "Skills", target: "skills" },
    { label: "Contact", target: "contact" },
  ],
  stats: [
    { value: "7mo", label: "Experience" },
    { value: "4+", label: "Projects" },
    { value: "3", label: "Certs" },
  ],
  skills: [
    "JavaScript", "TypeScript", "React.js", "Next.js", "Redux Toolkit (RTK)", "Tailwind CSS",
    "Material UI", "Responsive Web Design", "HTML5", "CSS3", "Node.js", "Express.js", "REST APIs",
    "MongoDB", "Redis", "AWS (EC2)", "Docker", "Git", "GitHub", "API Design",
    "Performance Optimization", "Authentication & Authorization", "State Management", "Ethers.js", "Web3 Integration",
  ],
  certifications: [
    "JavaScript Programming with React, Node.js & MongoDB Specialization – Full-Stack JavaScript Development",
    "Web Development with Node.js – Backend Development, REST APIs & Server-Side Programming",
    "Frontend Development with React.js – Modern UI Development, State Management & Component Architecture",
  ],
  contact: {
    email: "kdilmohan101@gmail.com",
    phone: "+91 9218600126",
    github: "https://github.com/dilmohankumar",
    linkedin: "https://linkedin.com/in/kdilmohan",
  },
};

const PROJECTS = [
  {
    name: "Whois Data Center Web Platform",
    desc:
      "Developed a domain intelligence platform using Next.js, Redux Toolkit, and REST APIs to provide " +
      "real-time domain availability, pricing, ownership, and expiration insights with advanced search and " +
      "filtering capabilities.",
    tech: ["Next.js", "Redux Toolkit", "REST APIs"],
    emoji: "🌐",
  },
  {
    name: "Whois Data Center Application",
    desc:
      "Built a full-stack MERN application with Redux Toolkit and REST APIs for processing, analyzing, and " +
      "managing domain data through a scalable and responsive user dashboard.",
    tech: ["MongoDB", "Express", "React", "Node.js", "Redux Toolkit"],
    emoji: "⚡",
  },
  {
    name: "Blockchain Contract Verification Platform",
    desc:
      "Developed a blockchain-based contract verification system enabling secure document uploads, digital " +
      "signature validation, immutable record storage, and contract authenticity verification.",
    tech: ["Blockchain", "Node.js", "Express"],
    emoji: "🔗",
  },
  {
    name: "Web3 Wallet Extension",
    desc:
      "Engineered a browser-based crypto wallet extension supporting account creation, token transfers, " +
      "transaction history, NFT minting, dApp connectivity, and smart contract interactions.",
    tech: ["Ethers.js", "Web3", "JavaScript"],
    emoji: "👛",
  },
];

const EXPERIENCE = [
  {
    company: "AllHeart Web",
    role: "Full Stack Developer",
    duration: "Nov 2025 - Present",
    icon: "💼",
    achievements: [
      "Developed a domain intelligence platform that processed real-time domain data, enabling users to analyze " +
        "domain availability, pricing, ownership, expiration details, and market insights. Built a subscription-based " +
        "dashboard with advanced search, filtering, and data visualization features.",
      "Contributed to a blockchain-powered contract verification platform, implementing secure document uploads, " +
        "digital signature validation, contract authenticity checks, audit tracking, and immutable record storage " +
        "to enhance trust and compliance.",
      "Engineered a Web3 browser wallet extension supporting account creation, token transfers, transaction " +
        "history, portfolio tracking, NFT minting and management, and secure wallet operations. Integrated smart " +
        "contract interactions and decentralized application (dApp) connectivity to enable seamless blockchain " +
        "transactions and asset management.",
    ],
  },
];

const EDUCATION = [
  {
    school: "Chandigarh University, Gharuan, Punjab",
    degree: "B.Tech, Computer Science and Engineering",
    duration: "Aug 2021 - Jul 2025",
  },
  {
    school: "Shivalik Science Senior Secondary School, Kharuni (Himachal Pradesh)",
    degree: "Higher Secondary (Class XII)",
    duration: "Apr 2020 - Mar 2021",
  },
  {
    school: "Shivalik Science Senior Secondary School, Kharuni (Himachal Pradesh)",
    degree: "Matriculation (Class X)",
    duration: "Apr 2018 - Mar 2019",
  },
];

// Layout-only records — order/title/visibility for each built-in homepage block.
// Hero's title is intentionally blank; it isn't rendered publicly, it just gives
// the admin's drag-and-drop list something to label that row with.
const SECTIONS = [
  { type: "hero", title: "", order: 0 },
  { type: "experience", title: "Experience", order: 1 },
  { type: "projects", title: "Projects", order: 2 },
  { type: "skills", title: "Skills", order: 3 },
  { type: "education", title: "Education", order: 4 },
  { type: "certifications", title: "Certifications", order: 5 },
  { type: "contact", title: "Contact", order: 6 },
];

async function seedAdmin() {
  const existing = await Admin.countDocuments();
  if (existing > 0) {
    console.log("Admin already exists, skipping.");
    return;
  }
  const { ADMIN_EMAIL, ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env before seeding");
  }
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, Number(BCRYPT_SALT_ROUNDS) || 12);
  await Admin.create({ email: ADMIN_EMAIL.toLowerCase(), passwordHash });
  console.log(`Admin account created for ${ADMIN_EMAIL}`);
}

async function seedSiteContent() {
  await SiteContent.findOneAndUpdate({ key: "main" }, SITE_CONTENT, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  console.log("SiteContent seeded/updated.");
}

async function seedCollection(Model, docs, label) {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`${label} already has ${count} document(s), skipping.`);
    return;
  }
  await Model.insertMany(docs);
  console.log(`${label} seeded with ${docs.length} document(s).`);
}

// Unlike seedCollection's all-or-nothing check, this restores only whichever built-in
// section types are currently missing — so if an admin deletes e.g. just "skills" from
// Page Layout, re-running seed brings that one back without touching or duplicating
// any of the others (custom sections are untouched either way; they aren't in SECTIONS).
async function seedBuiltInSections() {
  const existingTypes = new Set((await Section.find({ type: { $ne: "custom" } }).select("type")).map((s) => s.type));
  const missing = SECTIONS.filter((s) => !existingTypes.has(s.type));
  if (missing.length === 0) {
    console.log("Sections: all built-in sections already exist, skipping.");
    return;
  }
  // Append after whatever currently has the highest order, rather than trusting SECTIONS'
  // hardcoded 0-6 values — those would collide with existing sections' orders after any
  // admin reordering, since reorder always renumbers everything sequentially.
  const last = await Section.findOne().sort({ order: -1 });
  let nextOrder = last ? last.order + 1 : 0;
  const toInsert = missing.map((s) => ({ ...s, order: nextOrder++ }));
  await Section.insertMany(toInsert);
  console.log(`Sections: restored ${missing.length} missing built-in section(s): ${missing.map((s) => s.type).join(", ")}.`);
}

async function run() {
  await connectDB();
  await seedAdmin();
  await seedSiteContent();
  await seedCollection(Project, PROJECTS, "Projects");
  await seedCollection(Experience, EXPERIENCE, "Experience");
  await seedCollection(Education, EDUCATION, "Education");
  await seedBuiltInSections();
  await mongoose.disconnect();
  console.log("Seed complete.");
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
