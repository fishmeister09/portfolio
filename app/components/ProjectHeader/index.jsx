// import React from 'react';
import styles from './ProjectHeader.module.css';
import HeaderSubtitle from '../HeaderSubtitle';
// import { useLocation } from 'react-router-dom';
const ProjectHeader = ({ title, subtitle }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <HeaderSubtitle>{subtitle}</HeaderSubtitle>
    </div>
  );
};
export default ProjectHeader;
