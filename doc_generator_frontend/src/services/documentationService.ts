import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';
import { Template } from './api/types';

export class DocumentationService {
  static async getTemplates(): Promise<Template[]> {
    return apiClient.get<Template[]>(API_ENDPOINTS.documentation.templates);
  }

  static async getTemplateSections(templateId: string): Promise<string[]> {
    return apiClient.get<string[]>(API_ENDPOINTS.documentation.templateSections(templateId));
  }

  static async generateSection(templateType: string, section: string, context: object) {
    return apiClient.post(API_ENDPOINTS.documentation.generateSection, {
      template_type: templateType,
      section,
      context,
    });
  }
} 