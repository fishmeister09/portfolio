/* eslint-disable react/prop-types */
import styles from './SectionHeader.module.css';

const SectionHeader = ({ title }) => {
  return (
    <>
      <p className={styles.sectionTitle}>{title}</p>
      <div className={styles.divider}>
        ——————————————————————————————————————
      </div>
    </>
  );
};

export default SectionHeader;
