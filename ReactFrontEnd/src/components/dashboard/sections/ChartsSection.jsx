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
  
  // State for filters and tabs
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [attendanceTab, setAttendanceTab] = useState('student');
  const [classFilter, setClassFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [yearRangeFilter, setYearRangeFilter] = useState({
    start: '2020',
    end: '2023'
  });

  // Mock data for additional charts
  const mockMonthlyTrend = [
    { month: t('months.jan'), performance: 72 },
    { month: t('months.feb'), performance: 75 },
    { month: t('months.mar'), performance: 78 },
    { month: t('months.apr'), performance: 74 },
    { month: t('months.may'), performance: 80 },
    { month: t('months.jun'), performance: 82 },
    { month: t('months.jul'), performance: 84 },
    { month: t('months.aug'), performance: 80 },
    { month: t('months.sep'), performance: 83 },
    { month: t('months.oct'), performance: 85 },
    { month: t('months.nov'), performance: 87 },
    { month: t('months.dec'), performance: 89 }
  ];

  const mockSuccessFailure = [
    { year: '2020', success: 75, failure: 25 },
    { year: '2021', success: 78, failure: 22 },
    { year: '2022', success: 82, failure: 18 },
    { year: '2023', success: 85, failure: 15 }
  ];

  const mockAttendanceExtended = [
    { day: t('days.monday'), [t('attendance.present')]: 120, [t('attendance.absent')]: 10, [t('attendance.late')]: 5, [t('attendance.urgent')]: 2 },
    { day: t('days.tuesday'), [t('attendance.present')]: 115, [t('attendance.absent')]: 15, [t('attendance.late')]: 3, [t('attendance.urgent')]: 1 },
    { day: t('days.wednesday'), [t('attendance.present')]: 118, [t('attendance.absent')]: 12, [t('attendance.late')]: 4, [t('attendance.urgent')]: 0 },
    { day: t('days.thursday'), [t('attendance.present')]: 122, [t('attendance.absent')]: 8, [t('attendance.late')]: 2, [t('attendance.urgent')]: 3 },
    { day: t('days.friday'), [t('attendance.present')]: 116, [t('attendance.absent')]: 14, [t('attendance.late')]: 6, [t('attendance.urgent')]: 2 }
  ];

  const mockPerformanceExtended = [
    { performance: t('performance.excellent'), students: 20 },
    { performance: t('performance.veryGood'), students: 25 },
    { performance: t('performance.good'), students: 30 },
    { performance: t('performance.average'), students: 15 },
    { performance: t('performance.poor'), students: 10 }
  ];

  const mockSubjects = [
    t('subjects.mathematics'),
    t('subjects.physics'),
    t('subjects.chemistry'),
    t('subjects.biology'),
    t('subjects.english'),
    t('subjects.french'),
    t('subjects.history'),
    t('subjects.geography'),
    t('subjects.computerScience')
  ];

  const mockClasses = [
    'Class I',
    'Class II',
    'Class III',
    'Class IV',
    'Class V'
  ];

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
            <Tab label={t('charts.attendance')} value="attendance" />
            <Tab label={t('charts.performance')} value="performance" />
            <Tab label={t('charts.successFailure')} value="success" />
            <Tab label={t('charts.topSubjects')} value="subjects" />
            <Tab label={t('charts.monthlyTrend')} value="trend" />
          </Tabs>
        </Box>

        {/* Gender Distribution Chart */}
        {activeTab === 'gender' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {t('charts.studentGenderDistribution')}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="class-filter-label" sx={{ color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'text.primary' }}>
                  {t('common.class')}
                </InputLabel>
                <Select
                  labelId="class-filter-label"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  label={t('common.class')}
                  sx={{
                    color: isDarkMode ? '#e0e0e0' : 'text.primary',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(224, 224, 224, 0.3)' : 'inherit'
                    },
                  }}
                >
                  <MenuItem value="all">{t('common.allClasses')}</MenuItem>
                  {mockClasses.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  {mockGenderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDarkMode} />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Attendance Chart */}
        {activeTab === 'attendance' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {t('charts.attendance')}
              </Typography>
              <Tabs
                value={attendanceTab}
                onChange={(e, val) => setAttendanceTab(val)}
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
                <Tab label={t('common.student')} value="student" />
                <Tab label={t('common.teacher')} value="teacher" />
              </Tabs>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockAttendanceExtended}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(224, 224, 224, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                <XAxis dataKey="day" tick={{ fill: isDarkMode ? '#e0e0e0' : 'inherit' }} />
                <YAxis tick={{ fill: isDarkMode ? '#e0e0e0' : 'inherit' }} />
                <Tooltip content={<CustomTooltip isDark={isDarkMode} />} />
                <Legend />
                <Bar dataKey={t('attendance.present')} fill={ATTENDANCE_COLORS[0]} />
                <Bar dataKey={t('attendance.absent')} fill={ATTENDANCE_COLORS[1]} />
                <Bar dataKey={t('attendance.late')} fill={ATTENDANCE_COLORS[2]} />
                <Bar dataKey={t('attendance.urgent')} fill={ATTENDANCE_COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Performance Chart */}
        {activeTab === 'performance' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {t('charts.performanceBySubject')}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="subject-filter-label" sx={{ color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'text.primary' }}>
                  {t('common.subject')}
                </InputLabel>
                <Select
                  labelId="subject-filter-label"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  label={t('common.subject')}
                  sx={{
                    color: isDarkMode ? '#e0e0e0' : 'text.primary',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(224, 224, 224, 0.3)' : 'inherit'
                    },
                  }}
                >
                  <MenuItem value="all">{t('common.allSubjects')}</MenuItem>
                  {mockSubjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockPerformanceExtended}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="students"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockPerformanceExtended.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PERFORMANCE_COLORS[index % PERFORMANCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDarkMode} />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Success & Failure Chart */}
        {activeTab === 'success' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {t('charts.successFailureRate')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="year-start-label" sx={{ color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'text.primary' }}>
                    {t('common.from')}
                  </InputLabel>
                  <Select
                    labelId="year-start-label"
                    value={yearRangeFilter.start}
                    onChange={(e) => setYearRangeFilter({...yearRangeFilter, start: e.target.value})}
                    label={t('common.from')}
                    sx={{
                      color: isDarkMode ? '#e0e0e0' : 'text.primary',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? 'rgba(224, 224, 224, 0.3)' : 'inherit'
                      },
                    }}
                  >
                    {mockSuccessFailure.map((item) => (
                      <MenuItem 
                        key={`start-${item.year}`} 
                        value={item.year}
                        disabled={parseInt(item.year) > parseInt(yearRangeFilter.end)}
                      >
                        {item.year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="body1">-</Typography>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="year-end-label" sx={{ color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'text.primary' }}>
                    {t('common.to')}
                  </InputLabel>
                  <Select
                    labelId="year-end-label"
                    value={yearRangeFilter.end}
                    onChange={(e) => setYearRangeFilter({...yearRangeFilter, end: e.target.value})}
                    label={t('common.to')}
                    sx={{
                      color: isDarkMode ? '#e0e0e0' : 'text.primary',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? 'rgba(224, 224, 224, 0.3)' : 'inherit'
                      },
                    }}
                  >
                    {mockSuccessFailure.map((item) => (
                      <MenuItem 
                        key={`end-${item.year}`} 
                        value={item.year}
                        disabled={parseInt(item.year) < parseInt(yearRangeFilter.start)}
                      >
                        {item.year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockSuccessFailure.filter(item => 
                  parseInt(item.year) >= parseInt(yearRangeFilter.start) && 
                  parseInt(item.year) <= parseInt(yearRangeFilter.end)
                )}
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(224, 224, 224, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                <XAxis dataKey="year" tick={{ fill: isDarkMode ? '#e0e0e0' : 'inherit' }} />
                <YAxis 
                  tick={{ fill: isDarkMode ? '#e0e0e0' : 'inherit' }} 
                  label={{ 
                    value: t('common.percentage'), 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: isDarkMode ? '#e0e0e0' : 'inherit' } 
                  }}
                />
                <Tooltip content={<CustomTooltip isDark={isDarkMode} />} />
                <Legend />
                <Bar dataKey="success" name={t('common.success')} fill="#4caf50" />
                <Bar dataKey="failure" name={t('common.failure')} fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Top Subjects Chart */}
        {activeTab === 'subjects' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {t('charts.topPerformingSubjects')}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="class-filter-label" sx={{ color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'text.primary' }}>
                  {t('common.class')}
                </InputLabel>
                <Select
                  labelId="class-filter-label"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  label={t('common.class')}
                  sx={{
                    color: isDarkMode ? '#e0e0e0' : 'text.primary',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(224, 224, 224, 0.3)' : 'inherit'
                    },
                  }}
                >
                  <MenuItem value="all">{t('common.allClasses')}</MenuItem>
                  {mockClasses.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockTopSubjectsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(224, 224, 224, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                <XAxis type="number" tick={{ fill: isDarkMode ? '#e0e0e0' : 'inherit' }} />
                <YAxis 
                  dataKey="subject" 
                  type="category" 
                  tick={{ fill: isDarkMode ? '#e0e0e0' : 'inherit' }}
                  width={80} 
                />
                <Tooltip content={<CustomTooltip isDark={isDarkMode} />} />
                <Legend />
                <Bar dataKey="percentage" name={t('common.percentage')} fill="#8884d8">
                  {mockTopSubjectsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Monthly Trend Chart */}
        {activeTab === 'trend' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {t('charts.monthlyPerformanceTrend')}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="class-filter-trend-label" sx={{ color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'text.primary' }}>
                  {t('common.class')}
                </InputLabel>
                <Select
                  labelId="class-filter-trend-label"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  label={t('common.class')}
                  sx={{
                    color: isDarkMode ? '#e0e0e0' : 'text.primary',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(224, 224, 224, 0.3)' : 'inherit'
                    },
                  }}
                >
                  {mockClasses.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={mockMonthlyTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(224, 224, 224, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#e0e0e0' : 'inherit' }} />
                <YAxis 
                  tick={{ fill: isDarkMode ? '#e0e0e0' : 'inherit' }} 
                  domain={[0, 100]}
                  label={{ 
                    value: t('charts.performancePercentage'), 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: isDarkMode ? '#e0e0e0' : 'inherit' } 
                  }} 
                />
                <Tooltip content={<CustomTooltip isDark={isDarkMode} />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="performance"
                  name={t('common.performance')}
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default ChartsSection;
