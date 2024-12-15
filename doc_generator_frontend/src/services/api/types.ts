export interface APIError {
  message: string;
  status: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  sections: string[];
}

export interface AnalysisResult {
  summary: string;
  complexity: string;
  suggestions: string[];
  documentation: string;
}

export interface WorkflowDiagram {
  diagram: string;
} 