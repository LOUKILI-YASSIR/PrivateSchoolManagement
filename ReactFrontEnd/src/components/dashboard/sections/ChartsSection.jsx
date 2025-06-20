import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Tabs, 
  Tab, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper, 
  useTheme,
  Collapse
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { useTranslation } from 'react-i18next';

// Colors for charts
const COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1'];
const GENDER_COLORS = ['#4e79a7', '#e15759'];
const ATTENDANCE_COLORS = ['#59a14f', '#e15759', '#f28e2c', '#76b7b2'];
const PERFORMANCE_COLORS = ['#4e79a7', '#59a14f', '#76b7b2', '#f28e2c', '#e15759'];

const ChartsSection = ({ 
  isDarkMode, 
  activeTab, 
  setActiveTab, 
  mockAttendanceData, 
  mockGenderData, 
  mockPerformanceData, 
  mockTopSubjectsData,
  mockSuccessFailureData,
  mockPerformanceTrendData,
  mockClassSizeData,
  selectedClass,
  setSelectedClass,
  isMobile,
  expanded = true
}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  // Handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label, isDark }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 1,
            bgcolor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            color: isDark ? '#e0e0e0' : 'inherit',
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={`tooltip-${index}`} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Collapse in={expanded} timeout="auto">
      <Box sx={{ width: '100%' }}>
        {/* Tab navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              '& .MuiTab-root': {
                color: isDarkMode ? 'rgba(224, 224, 224, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-selected': {
                  color: isDarkMode ? '#e0e0e0' : theme.palette.primary.main,
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: isDarkMode ? '#e0e0e0' : theme.palette.primary.main,
              }
            }}
          >
            <Tab label={t('charts.genderDistribution')} value="gender" />
          </Tabs>
        </Box>

        {/* Gender Distribution Chart */}
        {activeTab === 'gender' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {t('charts.studentGenderDistribution')}
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockGenderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockGenderData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDarkMode} />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default ChartsSection;
