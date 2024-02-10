import styles from './SectionTitle.module.css';

const SectionTitle = ({ children }) => (
  <h3 className={styles.sectionTitle}>{children}</h3>
);
export default SectionTitle;
