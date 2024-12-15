'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Code, Analytics, BugReport } from '@mui/icons-material';

const CodeAnalysisPage = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Kod analizi sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const analysisCards = [
    {
      title: 'Kod Kalitesi',
      icon: <Code fontSize="large" color="primary" />,
      content: analysis?.quality || 'Henüz analiz yapılmadı',
    },
    {
      title: 'Performans Analizi',
      icon: <Analytics fontSize="large" color="primary" />,
      content: analysis?.performance || 'Henüz analiz yapılmadı',
    },
    {
      title: 'Potansiyel Hatalar',
      icon: <BugReport fontSize="large" color="primary" />,
      content: analysis?.bugs || 'Henüz analiz yapılmadı',
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Kod Analizi
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={10}
          label="Kodu buraya yapıştırın"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={analyzeCode}
          disabled={!code || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Analiz Et'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {analysisCards.map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  {card.title}
                </Typography>
                <Typography color="text.secondary" align="center">
                  {card.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CodeAnalysisPage; 