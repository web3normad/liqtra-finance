import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem('auth_token') 
          : null;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with error
          console.error('API Error:', error.response.data);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          // Request made but no response
          console.error('Network Error:', error.message);
          return Promise.reject({ error: 'Network error. Please check your connection.' });
        } else {
          // Something else happened
          console.error('Error:', error.message);
          return Promise.reject({ error: error.message });
        }
      }
    );
  }

  // User endpoints
  async connectWallet(address: string, signature?: string) {
    return this.client.post('/api/users/connect', { 
      wallet_address: address,
      signature 
    });
  }

  async getUserProfile(address: string) {
    return this.client.get(`/api/users/${address}`);
  }

  async updateRiskLevel(address: string, riskLevel: 'conservative' | 'balanced' | 'aggressive') {
    return this.client.put(`/api/users/${address}/risk`, { risk_level: riskLevel });
  }

  // Portfolio endpoints
  async getPortfolio(address: string) {
    return this.client.get(`/api/portfolio/${address}`);
  }

  async getPortfolioHistory(address: string, days: number = 30) {
    return this.client.get(`/api/portfolio/${address}/history`, { 
      params: { days } 
    });
  }

  // Transaction endpoints
  async getBalance(address: string) {
    return this.client.get(`/api/transactions/${address}/balance`);
  }

  async getContracts() {
    return this.client.get('/api/transactions/contracts');
  }

  async buildApprove(address: string, amount: string) {
    return this.client.post('/api/transactions/approve', { 
      address, 
      amount 
    });
  }

  async buildDeposit(address: string, amount: string) {
    return this.client.post('/api/transactions/deposit', { 
      address, 
      amount 
    });
  }

  async buildWithdraw(address: string, amount: string) {
    return this.client.post('/api/transactions/withdraw', { 
      address, 
      amount 
    });
  }

  // Actions/History endpoints
  async getActions(address: string, limit: number = 20) {
    return this.client.get(`/api/actions/${address}`, { 
      params: { limit } 
    });
  }

  async getPendingActions(address: string) {
    return this.client.get(`/api/actions/${address}/pending`);
  }
}

export const apiClient = new APIClient();
