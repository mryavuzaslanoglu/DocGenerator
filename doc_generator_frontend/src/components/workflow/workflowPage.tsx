// components/workflow/WorkflowPage.tsx
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
  Chip,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AccountTree,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/useToast';
import { useApi } from '@/hooks/useApi';

// Mermaid'i client-side only olarak import ediyoruz
const Mermaid = dynamic(() => import('react-mermaid2'), { ssr: false });

interface DiagramResponse {
  diagram: string;
}

interface Step {
  id: string;
  description: string;
}

interface Participant {
  id: string;
  name: string;
  role: string;
}

// Add this interface for the diagram request payload
interface DiagramRequest {
  workflow_name: string;
  description: string;
  steps: string[];
  participants: string[];
}

const WorkflowPage = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [mermaidDiagram, setMermaidDiagram] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast, ToastComponent } = useToast();
  const {
    execute: generateDiagram,
    loading: diagramLoading,
    error: diagramError,
    data: diagramData
  } = useApi<DiagramResponse>(async (data) => {
    const response = await fetch('/api/advanced/workflow-diagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  });

  const handleAddStep = () => {
    setSteps([...steps, { id: Date.now().toString(), description: '' }]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleStepChange = (id: string, value: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, description: value } : step
    ));
  };

  const handleAddParticipant = () => {
    setParticipants([...participants, { id: Date.now().toString(), name: '', role: '' }]);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleParticipantChange = (id: string, field: 'name' | 'role', value: string) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleGenerateDiagram = async () => {
    if (!workflowName || steps.length === 0) {
      showToast('Lütfen iş akışı adı ve en az bir adım ekleyin', 'error');
      return;
    }

    try {
      const payload: DiagramRequest = {
        workflow_name: workflowName,
        description,
        steps: steps.map(s => s.description),
        participants: participants.map(p => `${p.name} (${p.role})`),
      };
      
      const result = await generateDiagram(payload);
      if (result?.diagram) {
        setMermaidDiagram(result.diagram);
        showToast('Diyagram başarıyla oluşturuldu', 'success');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };
 

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                İş Akışı Bilgileri
              </Typography>
              
              <TextField
                fullWidth
                label="İş Akışı Adı"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Açıklama"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                margin="normal"
              />

              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  İş Akışı Adımları
                </Typography>
                {steps.map((step, index) => (
                  <Box key={step.id} sx={{ display: 'flex', mb: 2, gap: 1 }}>
                    <Chip label={`${index + 1}`} color="primary" />
                    <TextField
                      fullWidth
                      value={step.description}
                      onChange={(e) => handleStepChange(step.id, e.target.value)}
                      placeholder="Adım açıklaması..."
                    />
                    <IconButton onClick={() => handleRemoveStep(step.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddStep}
                  variant="outlined"
                  size="small"
                >
                  Adım Ekle
                </Button>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Katılımcılar
                </Typography>
                {participants.map((participant) => (
                  <Paper key={participant.id} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="İsim"
                          value={participant.name}
                          onChange={(e) => handleParticipantChange(participant.id, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Rol"
                          value={participant.role}
                          onChange={(e) => handleParticipantChange(participant.id, 'role', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton 
                          onClick={() => handleRemoveParticipant(participant.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddParticipant}
                  variant="outlined"
                  size="small"
                >
                  Katılımcı Ekle
                </Button>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateDiagram}
                  disabled={loading}
                  startIcon={<AccountTree />}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Diyagram Oluştur'}
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Diyagram Önizleme
                </Typography>
                <Box>
                  <IconButton onClick={handleGenerateDiagram} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                  <IconButton>
                    <SaveIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {mermaidDiagram ? (
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                  <Mermaid chart={mermaidDiagram} />
                </Box>
              ) : (
                <Box sx={{ 
                  height: 400, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 1
                }}>
                  <Typography color="text.secondary">
                    Diyagram oluşturmak için formu doldurun ve "Diyagram Oluştur" düğmesine tıklayın
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkflowPage;

