import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material';
import { Code, AutoFixHigh, BugReport, Speed } from '@mui/icons-material';

interface AnalysisResult {
  summary: string;
  complexity: string;
  suggestions: string[];
  documentation: string;
}

const languages = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
];

const CodeAnalysisPage = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Lütfen analiz edilecek kodu girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/docs/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();
      setResult(data.analysis);
    } catch (err) {
      setError('Kod analizi sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const ResultSection = ({ title, icon, content }: { title: string; icon: React.ReactNode; content: string | string[] }) => (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
      </Box>
      {Array.isArray(content) ? (
        <ul>
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <Typography>{content}</Typography>
      )}
    </Paper>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Kod Girişi
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Programlama Dili</InputLabel>
                <Select
                  value={language}
                  label="Programlama Dili"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Analiz edilecek kodu buraya yapıştırın..."
                variant="outlined"
                sx={{ mb: 2, fontFamily: 'monospace' }}
              />
              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={loading}
                startIcon={<Code />}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Analiz Et'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analiz Sonuçları
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {result && (
                <Box>
                  <ResultSection
                    title="Genel Bakış"
                    icon={<AutoFixHigh color="primary" />}
                    content={result.summary}
                  />
                  <ResultSection
                    title="Karmaşıklık Analizi"
                    icon={<Speed color="primary" />}
                    content={result.complexity}
                  />
                  <ResultSection
                    title="İyileştirme Önerileri"
                    icon={<BugReport color="primary" />}
                    content={result.suggestions}
                  />
                  <ResultSection
                    title="Dokümantasyon Önerisi"
                    icon={<Code color="primary" />}
                    content={result.documentation}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CodeAnalysisPage;