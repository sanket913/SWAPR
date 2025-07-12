const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData: any) {
    console.log('Registering user with data:', userData);
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    console.log('Registration response:', response);
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUsers(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateProfile(userData: any) {
    console.log('Updating profile with data:', userData);
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Admin user endpoints
  async getAdminUsers(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/admin/all?${queryString}`);
  }

  async updateAdminUser(id: string, userData: any) {
    return this.request(`/users/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteAdminUser(id: string) {
    return this.request(`/users/admin/${id}`, {
      method: 'DELETE',
    });
  }

  // Swap endpoints
  async getSwaps(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/swaps?${queryString}`);
  }

  async createSwap(swapData: any) {
    return this.request('/swaps', {
      method: 'POST',
      body: JSON.stringify(swapData),
    });
  }

  async updateSwap(id: string, updates: any) {
    return this.request(`/swaps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSwap(id: string) {
    return this.request(`/swaps/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin swap endpoints
  async getAdminSwaps(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/swaps/admin/all?${queryString}`);
  }

  // Review endpoints
  async getUserReviews(userId: string, params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/user/${userId}?${queryString}`);
  }

  async createReview(reviewData: any) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getGivenReviews(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/given?${queryString}`);
  }

  // Notification endpoints
  async getNotifications(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications?${queryString}`);
  }

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin notification endpoints
  async sendAnnouncement(announcementData: any) {
    return this.request('/notifications/admin/announcement', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }
}

export const apiService = new ApiService();
