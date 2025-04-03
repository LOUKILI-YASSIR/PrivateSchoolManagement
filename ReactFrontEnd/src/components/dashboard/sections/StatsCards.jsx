import React from 'react';
import { Card } from "react-bootstrap";
import { Grid, Box } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, 
  faChalkboardTeacher, 
  faBookOpen,
  faUserTie,
  faSquarePollVertical 
} from "@fortawesome/free-solid-svg-icons";
import styles from '../Dashboard.module.css';

const CARDS_CONFIG = [
  {
    id: 'students',
    title: 'Total Étudiants',
    key: 'totalStudents',
    icon: faUsers,
    variant: 'yellow',
    active: 3643,
    inactive: 11,
    description: 'Nombre total d\'étudiants inscrits'
  },
  {
    id: 'teachers',
    title: 'Total Enseignants',
    key: 'totalTeachers',
    icon: faChalkboardTeacher,
    variant: 'green',
    active: 254,
    inactive: 30,
    description: 'Nombre total d\'enseignants actifs'
  },
  {
    id: 'staff',
    title: 'Total Personnel',
    key: 'totalStaff',
    icon: faUserTie,
    variant: 'blue',
    active: 161,
    inactive: 2,
    description: 'Nombre total de membres du personnel'
  },
  {
    id: 'subjects',
    title: 'Total Matières',
    key: 'totalSubjects',
    icon: faBookOpen,
    variant: 'red',
    active: 81,
    inactive: 1,
    description: 'Nombre total de matières enseignées'
  }
];

const StatCard = ({ title, count, icon, variant, active, inactive, description, isDarkMode }) => {
  return (
    <Card 
      className={`${styles.cartDashBoard} ${styles[`cartDashBoard-${variant}`]} ${isDarkMode ? styles.darkmode : ''}`}
    >
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <FontAwesomeIcon 
            icon={icon} 
            className={`${styles.cardIcon} ${styles[`cartDashBoard-${variant}-Active`]}`}
          />
          <h3 className={`${styles.cardTitle} ${isDarkMode ? styles.darkText : ''}`}>{title}</h3>
        </div>
        <div className={styles.cardCount}>
          <h2 className={`${styles.countValue} ${isDarkMode ? styles.darkText : ''}`}>{count || active}</h2>
        </div>
        <hr className={`${styles.divider} ${isDarkMode ? styles.darkDivider : ''}`} />
        <div className={styles.cardDescription}>
          <FontAwesomeIcon
            icon={faSquarePollVertical}
            className={`${styles.descriptionIcon} ${isDarkMode ? styles.darkIcon : ''}`}
          />
          <span className={`${styles.descriptionText} ${isDarkMode ? styles.darkText : ''}`}>{description}</span>
        </div>
      </div>
    </Card>
  );
};

const StatsCards = ({ stats, isDarkMode }) => {
  // Use mock data values if no props provided
  const totalStudents = stats?.total_students || 3643;
  const totalTeachers = stats?.total_teachers || 254;
  const totalStaff = stats?.total_staff || 161;
  const totalSubjects = stats?.total_subjects || 81;

  const counts = {
    totalStudents,
    totalTeachers,
    totalStaff,
    totalSubjects
  };

  return (
    <Box sx={{ mb: 4 }} >
      <Grid container spacing={4} style={{marginLeft:"-50px"}}>
        {CARDS_CONFIG.map((config) => (
          <Grid item xs={12} sm={6} md={3} key={config.id}>
            <Box sx={{ height: '100%', p: 1 }}>
              <StatCard
                title={config.title}
                count={counts[config.key]}
                icon={config.icon}
                variant={config.variant}
                active={config.active}
                inactive={config.inactive}
                description={config.description}
                isDarkMode={isDarkMode}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatsCards; 