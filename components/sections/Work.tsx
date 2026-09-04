import ItchCard from "@/components/ItchCard";
import SectionHeader from "@/components/SectionHeader";
import { projects } from "@/lib/content";

export default function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHeader
          titleId="work-title"
          eyebrow="Work"
          title="Every one of these started as a complaint"
          lede="Ordered by what they took, not by when they happened."
        />

        <div className="work">
          {projects.map((project) => (
            <ItchCard project={project} key={project.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
