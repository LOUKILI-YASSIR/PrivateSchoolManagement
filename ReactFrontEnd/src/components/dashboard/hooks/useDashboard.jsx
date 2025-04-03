import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

// Mock data for testing
const mockDashboardData = {
  totalStudents: 3643,
  totalTeachers: 254,
  totalClasses: 48,
  totalRevenue: 1250000,
  attendanceData: [
    { day: 'Lundi', Present: 120, Absent: 10, Late: 5 },
    { day: 'Mardi', Present: 115, Absent: 15, Late: 3 },
    { day: 'Mercredi', Present: 118, Absent: 12, Late: 4 },
    { day: 'Jeudi', Present: 122, Absent: 8, Late: 2 },
    { day: 'Vendredi', Present: 116, Absent: 14, Late: 6 }
  ],
  genderData: [
    { name: 'Garçons', value: 60 },
    { name: 'Filles', value: 40 }
  ],
  performanceData: [
    { performance: 'Excellent', students: 45 },
    { performance: 'Moyen', students: 30 },
    { performance: 'Faible', students: 25 }
  ],
  topSubjectsData: [
    { subject: 'Mathématiques', percentage: 85 },
    { subject: 'Physique', percentage: 75 },
    { subject: 'Chimie', percentage: 70 },
    { subject: 'Biologie', percentage: 65 },
    { subject: 'Anglais', percentage: 80 }
  ],
  recentActivities: [
    { id: 1, activity: 'Ajout d\'un nouvel étudiant', timestamp: '2023-03-15T10:30:00Z' },
    { id: 2, activity: 'Mise à jour du calendrier des examens', timestamp: '2023-03-14T14:45:00Z' },
    { id: 3, activity: 'Modification des horaires de cours', timestamp: '2023-03-13T09:15:00Z' }
  ]
};

export const useDashboard = () => {
  const { t: Language } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setData(mockDashboardData);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    data: data || mockDashboardData,
    isLoading,
    error,
    Language,
    errorDetails: error ? {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    } : null
  };
}; 