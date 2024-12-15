import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';
import { WorkflowDiagram } from './api/types';

export class WorkflowService {
  static async generateDiagram(workflowData: {
    workflow_name: string;
    description: string;
    steps: string[];
    participants: string[];
  }): Promise<WorkflowDiagram> {
    return apiClient.post<WorkflowDiagram>(
      API_ENDPOINTS.workflow.generate,
      workflowData
    );
  }
} 