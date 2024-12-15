export const API_BASE_URL = 'http://localhost:8000'; 

export const API_ENDPOINTS = {
  documentation: {
    templates: '/api/advanced/templates',
    generateSection: '/api/advanced/generate-section',
    templateSections: (templateId: string) => `/api/advanced/templates/${templateId}/sections`,
  },
  codeAnalysis: {
    analyze: '/api/docs/analyze-code',
  },
  workflow: {
    generate: '/api/advanced/workflow-diagram',
  },
}; 