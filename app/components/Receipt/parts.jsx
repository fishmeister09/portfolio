import Link from "next/link";
import styles from "./parts.module.css";

// Internal routes use next/link; everything else opens like a normal link.
const Target = ({ href, className, children }) => {
  if (!href) return <div className={className}>{children}</div>;
  if (href.startsWith("/"))
    return (
      <Link href={href} className={`${className} ${styles.interactive}`}>
        {children}
      </Link>
    );
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={`${className} ${styles.interactive}`}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

export const Section = ({ title, id, children }) => (
  <section className={styles.section} id={id}>
    {title && <h2 className={styles.sectionTitle}>{title}</h2>}
    {children}
  </section>
);

export const Row = ({ label, value, href }) => (
  <Target href={href} className={styles.row}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </Target>
);

export const Item = ({ label, meta, href, children }) => (
  <Target href={href} className={styles.item}>
    <span className={styles.itemHead}>
      <span>{label}</span>
      {meta && <span className={styles.meta}>{meta}</span>}
    </span>
    {children && <span className={styles.itemBody}>{children}</span>}
  </Target>
);

export const Text = ({ children }) => <p className={styles.text}>{children}</p>;

// A heading line with free-form content under it, for entries too long to
// be a single clickable row.
export const Entry = ({ label, meta, sub, children }) => (
  <div className={styles.entry}>
    <span className={styles.itemHead}>
      <span>{label}</span>
      {meta && <span className={styles.meta}>{meta}</span>}
    </span>
    {sub && <span className={styles.itemBody}>{sub}</span>}
    {children}
  </div>
);

export const Quote = ({ quote, author, href }) => (
  <Target href={href} className={styles.item}>
    <span className={styles.quote}>“{quote}”</span>
    <span className={styles.author}>― {author}</span>
  </Target>
);

export const Columns = ({ items }) => (
  <ul className={styles.columns}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

// A boxed call to action between double rules, like a receipt's promo line.
export const Callout = ({ href, children }) => (
  <div className={styles.callout}>
    <a href={href} className={styles.calloutLink}>
      {children}
    </a>
  </div>
);
