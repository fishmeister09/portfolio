import Link from "next/link";
import Portrait from "../Portrait";
import styles from "./ProjectLogo.module.css";

// A project's app icon, engraved in its accent colour. The source image is
// cropped square, so the tile has no rounded outline.
export const EngravedIcon = ({ slug, title, accent, size, rows }) => (
  <div className={styles.icon} style={{ width: size, height: size }}>
    <Portrait
      variant="logo"
      src={`/projects/${slug}.png`}
      alt={`${title} logo`}
      color={accent}
      rows={rows}
      levels={[0.1, 0.97]}
    />
  </div>
);

// A project's masthead on its own page, centred like a store logo.
const ProjectLogo = ({ slug, title, subtitle, accent }) => (
  <header className={styles.masthead}>
    <EngravedIcon
      slug={slug}
      title={title}
      accent={accent}
      size={88}
      rows={32}
    />
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.subtitle}>{subtitle}</p>
  </header>
);

// A project as a line item on the home receipt.
export const ProjectItem = ({ slug, project }) => (
  <Link href={`/project/${slug}`} className={styles.item}>
    <EngravedIcon
      slug={slug}
      title={project.title}
      accent={project.accent}
      size={52}
      rows={22}
    />
    <span className={styles.itemText}>
      <span className={styles.itemTitle}>{project.title}</span>
      <span className={styles.itemBody}>{project.miniDescription}</span>
    </span>
    <span className={styles.arrow} aria-hidden="true">
      →
    </span>
  </Link>
);

export default ProjectLogo;
