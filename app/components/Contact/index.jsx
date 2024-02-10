import styles from './Contact.module.css';
import Padding from '../Padding';

const Contact = ({ children }) => {
  return (
    <>
      <div className={styles.divider}>
        ======================================
      </div>
      <Padding value={'3%'} />
      <div
        className={styles.text}
        onClick={() => window.open('mailto:arjunsethi33@gmail.com')}
      >
        {children}
      </div>
      <Padding value={'3%'} />

      <div className={styles.divider}>
        ======================================
      </div>
    </>
  );
};

export default Contact;
