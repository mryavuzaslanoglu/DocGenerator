import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from './config';
import { APIError } from './types';

interface ErrorResponse {
  message: string;
  status?: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError<ErrorResponse>) => {
        const apiError: APIError = {
          message: error.response?.data?.message || 'Bir hata oluştu',
          status: error.response?.status || 500,
        };
        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, params?: object): Promise<T> {
    try {
      return await this.client.get(url, { params });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: object): Promise<T> {
    try {
      return await this.client.post(url, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): APIError {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        message: err.response?.data?.message || 'API isteği başarısız oldu',
        status: err.response?.status || 500,
      };
    }
    return {
      message: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu',
      status: 500,
    };
  }
}

export const apiClient = new ApiClient(); 