import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";
import { homeTranslations } from "@/i18n/translations/home";
import { projectsTranslations } from "@/i18n/translations/projects";
import project1 from "@/assets/project-1.webp";
import project2 from "@/assets/project-2.webp";
import project3 from "@/assets/project-3.webp";

const allProjects = [
  { title: "The Residences at Brickell", location: "Brickell, Miami", price: "$450,000", image: project1, tagKey: "precon" as const, category: "Miami", beds: "1-3", sqft: "750-1,800" },
  { title: "Ocean Bay Tower", location: "Miami Beach", price: "$680,000", image: project2, tagKey: "waterfront" as const, category: "Miami", beds: "2-4", sqft: "1,200-2,500" },
  { title: "Palm Villas Orlando", location: "Orlando, FL", price: "$320,000", image: project3, tagKey: "investment" as const, category: "Orlando", beds: "3-5", sqft: "1,500-3,000" },
  { title: "Skyline Residences", location: "Downtown Miami", price: "$520,000", image: project1, tagKey: "precon" as const, category: "Miami", beds: "1-3", sqft: "850-2,000" },
  { title: "Marina Point", location: "Aventura, Miami", price: "$750,000", image: project2, tagKey: "waterfront" as const, category: "Miami", beds: "2-4", sqft: "1,400-2,800" },
  { title: "Lake Nona Estates", location: "Orlando, FL", price: "$400,000", image: project3, tagKey: "investment" as const, category: "Orlando", beds: "3-4", sqft: "1,800-2,500" },
];

const ProjectsPage = () => {
  const t = useT();
  const p = projectsTranslations;
  const tags = homeTranslations.projectTags;
  const prefix = homeTranslations.projectPricePrefix;

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(p.label)}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t(p.title)}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t(p.subtitle)}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project, i) => (
              <AnimatedSection as="div" key={project.title} delay={i * 100} className="group border border-border rounded-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={600} />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 tracking-wider uppercase">
                    {t(tags[project.tagKey])}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl mb-1">{project.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3"><MapPin size={14} /> {project.location}</div>
                  <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                    <span>{project.beds} {t(p.beds)}</span>
                    <span>{project.sqft} sqft</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-primary font-semibold text-lg">{t(prefix)} {project.price}</p>
                    <Button size="sm" variant="outline" asChild><Link to="/contacto">{t(p.info)}</Link></Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
