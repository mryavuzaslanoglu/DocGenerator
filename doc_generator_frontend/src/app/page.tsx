'use client';

import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Layout from '@/components/layout/Layout';
import { lightTheme, darkTheme } from '@/styles/theme';
import HomePage from '../components/home/HomePage';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
        <HomePage />
      </Layout>
    </ThemeProvider>
  );
}
