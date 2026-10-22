import styles from "./Printer.module.css";

// A plain matte block: top surface seen from slightly above, the paper slot
// near the top of the front face, and a single status light that glows amber
// while printing and green once it's done.
const Printer = ({ printing }) => (
  <div className={styles.printer} data-printer>
    <div className={styles.top} aria-hidden="true" />
    <div className={styles.front}>
      <div className={styles.slot} aria-hidden="true" />
      <span
        className={`${styles.led} ${printing ? styles.busy : ""}`}
        aria-hidden="true"
      />
      <span className={styles.status} aria-live="polite">
        {printing ? "Printing your receipt" : "Receipt printed"}
      </span>
    </div>
  </div>
);

export default Printer;
