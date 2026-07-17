import HeroSection from "./HeroSection";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import EducationSection from "./EducationSection";
import CertificationsSection from "./CertificationsSection";
import ContactSection from "./ContactSection";
import CustomSection from "./CustomSection";

export const SECTION_RENDERERS = {
  hero: HeroSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  education: EducationSection,
  certifications: CertificationsSection,
  contact: ContactSection,
  custom: CustomSection,
};
