import styles from './HeaderSubtitle.module.css';
const HeaderSubtitle = ({ children }) => {
  return <p className={styles.subtitle}>{children}</p>;
};

export default HeaderSubtitle;
