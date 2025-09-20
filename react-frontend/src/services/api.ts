// Simple API service without axios dependency
const API_BASE_URL = 'http://127.0.0.1:8000/api'

class ApiService {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // Ignore JSON parsing errors
        }
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error: Unable to connect to server')
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name: string, email: string, password: string, phone?: string) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        password_confirmation: password,
        phone 
      }),
    })
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    })
  }

  async getUser() {
    return this.request('/user')
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/change-password', {
      method: 'POST',
      body: JSON.stringify({ 
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword
      }),
    })
  }

  // Products endpoints
  async getProducts(page = 1, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
    })
    return this.request(`/products?${params}`)
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: number, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Orders endpoints
  async getOrders() {
    return this.request('/orders')
  }

  async getMyOrders() {
    return this.request('/orders/my-orders')
  }

  async createOrder(orderData: { product_id: number; notes?: string }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  // Public services

  async convertCurrency(amount: number, from: string, to: string) {
    const params = new URLSearchParams({
      amount: amount.toString(),
      from,
      to,
    })
    return this.request(`/currency/convert?${params}`)
  }

  async getProductsWithCurrency(from = 'RSD', to = 'EUR') {
    const params = new URLSearchParams({ from, to })
    return this.request(`/products/converted?${params}`)
  }

  // Generic methods
  async get(endpoint: string) {
    return this.request(endpoint)
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()
