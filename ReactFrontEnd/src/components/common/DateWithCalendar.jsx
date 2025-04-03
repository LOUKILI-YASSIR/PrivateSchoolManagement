import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Popover } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/de';
import 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useTranslation } from 'react-i18next';

dayjs.extend(localizedFormat);

const themeColors = {
  light: {
    background: "#f8f9fa",
    text: "#333",
    border: "rgba(0, 0, 0, 0.08)",
    shadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    hoverBackground: "#e9ecef",
    arrow: "#333",
  },
  dark: {
    background: "rgba(30, 41, 59, 0.8)",
    text: "#e0e0e0",
    border: "rgba(255, 255, 255, 0.1)",
    shadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    hoverBackground: "rgba(55, 65, 81, 0.9)",
    arrow: "#e0e0e0",
  },
};

export default function DateWithCalendar() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);

  const supportedLanguages = ["en", "es", "de", "fr"];
  const currentLang = supportedLanguages.includes(i18n.language)
    ? i18n.language
    : "en";

  dayjs.locale(currentLang);

  const formattedDate = dayjs().format("dddd D MMMM YYYY");

  const handleClick = useCallback((event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  }, [anchorEl]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Enter" || event.key === " ") {
      handleClick(event);
    }
  }, [handleClick]);

  const dateContainerStyles = useMemo(() => ({
    position: "relative",
    marginLeft: "8px",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    backgroundColor: isDarkMode ? themeColors.dark.background : themeColors.light.background,
    color: isDarkMode ? themeColors.dark.text : themeColors.light.text,
    border: isDarkMode ? `1px solid ${themeColors.dark.border}` : `1px solid ${themeColors.light.border}`,
    boxShadow: isDarkMode ? themeColors.dark.shadow : themeColors.light.shadow,
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    outline: "none",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "inherit",
      opacity: 0,
      transition: "opacity 0.3s",
      pointerEvents: "none",
    },
    "&:hover::before": {
      opacity: 1,
    },
    "&:hover": {
      backgroundColor: isDarkMode ? themeColors.dark.hoverBackground : themeColors.light.hoverBackground,
      transform: "translateY(-2px)",
      boxShadow: isDarkMode ? "0 4px 8px rgba(0, 0, 0, 0.3)" : "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    "&::after": anchorEl
      ? {
          content: '""',
          position: "absolute",
          bottom: -2,
          left: "50%",
          transform: "translateX(-50%)",
          width: "8px",
          height: "8px",
          backgroundColor: isDarkMode ? themeColors.dark.arrow : themeColors.light.arrow,
          borderRadius: "50%",
        }
      : {},
    "&:focus": {
      outline: "none",
    },
    "&:focus-visible": {
      boxShadow: `0 0 0 2px ${isDarkMode ? themeColors.dark.arrow : themeColors.light.arrow}`,
    },
  }), [isDarkMode, anchorEl]);

  const popoverStyles = useMemo(() => ({
    backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.95)" : "#ffffff",
    color: isDarkMode ? "#e0e0e0" : "inherit",
    border: isDarkMode
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    boxShadow: isDarkMode
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "8px",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: -8,
      left: 20,
      width: 16,
      height: 16,
      transform: "rotate(45deg)",
      backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.95)" : "#ffffff",
      borderLeft: isDarkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)",
      borderTop: isDarkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)",
      zIndex: 0,
    },
  }), [isDarkMode]);

  return (
    <div className="relative inline-block">
      <Box
        sx={dateContainerStyles}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <span className="text-lg pl-4 pr-2">{formattedDate}</span>
        <FontAwesomeIcon className="pr-2 text-xl" icon={faCalendarDays} />
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableRestoreFocus
        PaperProps={{ sx: popoverStyles }}
      >
<DateCalendar
  value={dayjs()}
  sx={{
    width: '100%',
    height: '300px',
    backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.95)" : "#ffffff",
    // Override day header labels via CSS selectors:
    "& .MuiDayCalendar-weekDayLabel": {
      backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.95)" : "#ffffff",
      color: isDarkMode ? "#e0e0e0" : "#666666",
    }
  }}
  slotProps={{
    day: {
      sx: {
        backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.95)" : "#ffffff",
        color: isDarkMode ? "#e0e0e0" : "inherit",
        '&.Mui-selected': {
          backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
          color: '#fff',
        },
      },
    },
    calendarHeader: {
      sx: {
        backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.95)" : "#ffffff",
        color: isDarkMode ? "#e0e0e0" : "inherit",
      },
    },
    toolbar: {
      sx: {
        backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.95)" : "#ffffff",
        color: isDarkMode ? "#e0e0e0" : "inherit",
        '& .MuiButtonBase-root': {
          color: isDarkMode ? "#e0e0e0" : "inherit",
        },
      },
    },
    switchViewButton: {
      sx: {
        color: isDarkMode ? "#e0e0e0" : "inherit",
      },
    },
    previousIconButton: {
      sx: {
        color: isDarkMode ? "#e0e0e0" : "inherit",
      },
    },
    nextIconButton: {
      sx: {
        color: isDarkMode ? "#e0e0e0" : "inherit",
      },
    },
  }}
/>

      </Popover>
    </div>
  );
}