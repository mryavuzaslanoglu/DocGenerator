import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/config';

interface AnalysisResult {
  summary: string;
  complexity: string;
  suggestions: string[];
  documentation: string;
}

export class CodeAnalysisService {
  static async analyzeCode(code: string, language: string): Promise<AnalysisResult> {
    try {
      const response = await apiClient.post<{ analysis: AnalysisResult }>(
        API_ENDPOINTS.codeAnalysis.analyze,
        { code, language }
      );
      return response.analysis;
    } catch (error) {
      throw new Error('Kod analizi sırasında bir hata oluştu');
    }
  }
}