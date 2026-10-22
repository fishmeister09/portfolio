import styles from "./Barcode.module.css";

// Deterministic bar widths derived from the text, so the barcode is stable
// across renders and differs per page.
const bars = (text) => {
  let seed = 0;
  for (const ch of text) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) >>> 0;
  const out = [];
  let x = 0;
  while (x < 200) {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
    const width = 1 + ((seed >>> 16) % 3);
    const gap = 1 + ((seed >>> 20) % 3);
    out.push({ x, width });
    x += width + gap;
  }
  return out;
};

const Barcode = ({ value }) => (
  <div className={styles.container}>
    <svg
      className={styles.bars}
      viewBox="0 0 200 48"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bars(value).map(({ x, width }) => (
        <rect key={x} x={x} y={0} width={width} height={48} fill="currentColor" />
      ))}
    </svg>
    <p className={styles.value}>{value}</p>
  </div>
);

export default Barcode;
