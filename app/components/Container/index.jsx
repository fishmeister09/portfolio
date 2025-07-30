'use client';
import SectionTitle from '../SectionTitle';
import Description from '../Description';
import styles from './Container.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Container = ({
  title,
  description,
  titleWidth,
  descriptionWidth,
  descriptionStyle,
  customDescription,
  hoverEffect = true,
  navigateTo = '',
}) => {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(navigateTo);
  };

  return (
    <motion.div
      // onClick={() => router.push(navigateTo)}
      whileHover={
        hoverEffect && {
          color: '#FFFFFF',
          backgroundColor: '#242728',
          transition: { duration: 0.5 },
        }
      }
    >
      <Link
        href={navigateTo}
        className={styles.container}
        prefetch={false}
        style={{ cursor: hoverEffect ? 'pointer' : 'default' }}
      >
        <div style={{ width: titleWidth }} onMouseEnter={handleMouseEnter}>
          <SectionTitle>{title}</SectionTitle>
        </div>
        <div style={{ width: descriptionWidth }}>
          {customDescription ? (
            customDescription
          ) : (
            <Description style={descriptionStyle}>{description}</Description>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
export default Container;
