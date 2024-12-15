'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountTree,
} from '@mui/icons-material';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  lastRun?: string;
}

const WorkflowsPage = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'API Dokümantasyonu',
      description: 'REST API endpoints için otomatik dokümantasyon oluşturma',
      status: 'active',
      lastRun: '2024-01-15',
    },
    {
      id: '2',
      name: 'Kod Analizi Raporu',
      description: 'Haftalık kod kalitesi ve analiz raporu oluşturma',
      status: 'active',
      lastRun: '2024-01-14',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleOpenDialog = (workflow?: Workflow) => {
    if (workflow) {
      setEditingWorkflow(workflow);
      setFormData({
        name: workflow.name,
        description: workflow.description,
      });
    } else {
      setEditingWorkflow(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWorkflow(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleSave = () => {
    if (editingWorkflow) {
      setWorkflows(workflows.map(w =>
        w.id === editingWorkflow.id
          ? { ...w, ...formData }
          : w
      ));
    } else {
      const newWorkflow: Workflow = {
        id: Date.now().toString(),
        ...formData,
        status: 'inactive',
      };
      setWorkflows([...workflows, newWorkflow]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setWorkflows(workflows.map(w =>
      w.id === id
        ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' }
        : w
    ));
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">
          İş Akışları
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni İş Akışı
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} md={6} key={workflow.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    {workflow.name}
                  </Typography>
                  <Chip
                    label={workflow.status === 'active' ? 'Aktif' : 'Pasif'}
                    color={workflow.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography color="text.secondary" paragraph>
                  {workflow.description}
                </Typography>
                {workflow.lastRun && (
                  <Typography variant="body2" color="text.secondary">
                    Son Çalıştırma: {workflow.lastRun}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleToggleStatus(workflow.id)}
                >
                  {workflow.status === 'active' ? 'Devre Dışı Bırak' : 'Etkinleştir'}
                </Button>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(workflow)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(workflow.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingWorkflow ? 'İş Akışını Düzenle' : 'Yeni İş Akışı'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="İş Akışı Adı"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Açıklama"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSave} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowsPage; 