import { useState, useEffect } from 'react';
import { DocumentationService } from '@/services/documentationService';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { Description, Assignment, AutoAwesome } from '@mui/icons-material';

const steps = ['Şablon Seçimi', 'İçerik Girişi', 'AI Öneriler'];

const DocumentationPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sections: [] as string[],
    content: {} as Record<string, string>
  });

  const { showToast, ToastComponent } = useToast();
  
  const { 
    execute: getTemplates,
    data: templates,
    loading: templatesLoading,
    error: templatesError 
  } = useApi(DocumentationService.getTemplates);

  const {
    execute: generateSection,
    loading: generatingContent,
    error: generationError
  } = useApi(DocumentationService.generateSection);

  useEffect(() => {
    getTemplates();
  }, []);

  const handleTemplateSelect = async (templateId: string) => {
    try {
      setSelectedTemplate(templateId);
      const sections = await DocumentationService.getTemplateSections(templateId);
      setFormData(prev => ({
        ...prev,
        sections,
        content: sections.reduce((acc: any, section: string) => {
          acc[section] = '';
          return acc;
        }, {})
      }));
      handleNext();
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleContentChange = (section: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: value
      }
    }));
  };

  const handleGenerateAI = async () => {
    try {
      const result = await generateSection(selectedTemplate, formData);
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          ...(result as Record<string, string>)
        }
      }));
      handleNext();
      showToast('İçerik başarıyla oluşturuldu', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {templatesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : templates?.map((template) => (
              <Grid item xs={12} md={4} key={template.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    }
                  }}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {template.id === 'technical' ? <Description fontSize="large" color="primary" /> :
                       template.id === 'user_guide' ? <Assignment fontSize="large" color="primary" /> :
                       <AutoAwesome fontSize="large" color="primary" />}
                    </Box>
                    <Typography variant="h6" align="center" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography color="text.secondary" align="center">
                      {template.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="Başlık"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Açıklama"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
            />
            {formData.sections.map((section) => (
              <TextField
                key={section}
                fullWidth
                label={section}
                multiline
                rows={4}
                value={formData.content[section] || ''}
                onChange={(e) => handleContentChange(section, e.target.value)}
                margin="normal"
              />
            ))}
          </Box>
        );

      case 2:
        return (
          <Box>
            {generatingContent ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              Object.entries(formData.content).map(([section, content]) => (
                <Box key={section} sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>{section}</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => handleContentChange(section, e.target.value)}
                  />
                </Box>
              ))
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {(templatesError || generationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {templatesError || generationError}
        </Alert>
      )}

      <Box sx={{ mt: 4, mb: 4 }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Geri
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleGenerateAI : handleNext}
          disabled={generatingContent}
        >
          {activeStep === steps.length - 1 ? 'Oluştur' : 'İleri'}
        </Button>
      </Box>

      <ToastComponent />
    </Box>
  );
};

export default DocumentationPage;