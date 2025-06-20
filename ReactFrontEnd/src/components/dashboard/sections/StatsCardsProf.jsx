import React from 'react';
import { Card } from "react-bootstrap";
import { Grid, Box } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountUp from 'react-countup';

import { 
  faUsers, 
  faChalkboardTeacher, 
  faBookOpen,
  faUserTie,
  faSquarePollVertical ,
  faPeopleRoof
} from "@fortawesome/free-solid-svg-icons";
import styles from '../Dashboard.module.css';

const CARDS_CONFIG = (students,groups)=>[
  {
    id: 'students',
    title: 'Total Étudiants',
    key: 'totalStudents',
    icon: faUsers,
    variant: 'yellow',
    active: students,
    description: 'Nombre total d\'étudiants inscrits'
  },
  {
    id: 'g',
    title: 'Total Groups',
    key: 'totalGroups',
    icon: faPeopleRoof,
    variant: 'blue',
    active: groups,
    description: 'Nombre total de groups'
  },
];

const StatCard = ({ index, title, count, icon, variant, active, inactive, description, isDarkMode }) => {
  return (
    <Card 
      className={`${styles.cartDashBoard} ${styles[`cartDashBoard-${variant}`]} ${isDarkMode ? styles.darkmode : ''} w-[730px] ${index>0 ? "ml-[365px]" : ""}`}
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
            <h2 className={`${styles.countValue} ${isDarkMode ? styles.darkText : ''}`}>
              <CountUp start={0} end={count || active} duration={1.5} separator="," />
            </h2>
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

const StatsCardsProf = ({ stats, isDarkMode }) => {
  const { totalStudents = 0, totalGroups = 0 } = stats || {};

  const counts = {
    totalStudents,
    totalGroups,
  };
  return (
    <Box sx={{ mb: 4 }} >
      <Grid container spacing={4} style={{marginLeft:"-50px",display:"flex"}}>
        {CARDS_CONFIG(
            totalStudents,
            totalGroups,
        ).map((config,index) => (
          <Grid item xs={12} sm={6} md={3} key={config.id}>
            <Box sx={{ height: '100%', p: 1  }}>
              <StatCard
                index={index}
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

export default StatsCardsProf; 