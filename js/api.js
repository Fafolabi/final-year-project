// API service for SIWES Electronic Workbook

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3001/api';
        this.token = localStorage.getItem('authToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // Get authentication headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication APIs
    async login(email, password, expectedRole) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, expectedRole })
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async demoLogin(role) {
        const response = await this.request('/auth/demo-login', {
            method: 'POST',
            body: JSON.stringify({ role })
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
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
        return await this.request('/auth/me');
    }

    // User APIs
    async getUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/users${queryString ? '?' + queryString : ''}`);
    }

    async getUserById(id) {
        return await this.request(`/users/${id}`);
    }

    async getUsersByRole(role) {
        return await this.request(`/users/by-role/${role}`);
    }

    async createUser(userData) {
        return await this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async updateUser(id, userData) {
        return await this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async deleteUser(id) {
        return await this.request(`/users/${id}`, {
            method: 'DELETE'
        });
    }

    // Log Entry APIs
    async getLogEntries(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/log-entries${queryString ? '?' + queryString : ''}`);
    }

    async getLogEntriesByStudent(studentId) {
        return await this.request(`/log-entries/student/${studentId}`);
    }

    async getLogEntry(id) {
        return await this.request(`/log-entries/${id}`);
    }

    async createLogEntry(logData) {
        return await this.request('/log-entries', {
            method: 'POST',
            body: JSON.stringify(logData)
        });
    }

    async updateLogEntry(id, logData) {
        return await this.request(`/log-entries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(logData)
        });
    }

    async deleteLogEntry(id) {
        return await this.request(`/log-entries/${id}`, {
            method: 'DELETE'
        });
    }

    // Weekly Report APIs
    async getWeeklyReports(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/weekly-reports${queryString ? '?' + queryString : ''}`);
    }

    async getWeeklyReportsByStudent(studentId) {
        return await this.request(`/weekly-reports/student/${studentId}`);
    }

    async getPendingReports() {
        return await this.request('/weekly-reports/pending');
    }

    async getWeeklyReport(id) {
        return await this.request(`/weekly-reports/${id}`);
    }

    async createWeeklyReport(reportData) {
        return await this.request('/weekly-reports', {
            method: 'POST',
            body: JSON.stringify(reportData)
        });
    }

    async updateWeeklyReport(id, reportData) {
        return await this.request(`/weekly-reports/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reportData)
        });
    }

    async reviewWeeklyReport(id, feedback) {
        return await this.request(`/weekly-reports/${id}/review`, {
            method: 'PUT',
            body: JSON.stringify({ supervisorFeedback: feedback })
        });
    }

    async addIndustrialComment(id, feedback) {
        return await this.request(`/weekly-reports/${id}/industrial-comment`, {
            method: 'PUT',
            body: JSON.stringify({ industrialSupervisorFeedback: feedback })
        });
    }

    async deleteWeeklyReport(id) {
        return await this.request(`/weekly-reports/${id}`, {
            method: 'DELETE'
        });
    }

    // Notification APIs
    async getNotifications(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/notifications${queryString ? '?' + queryString : ''}`);
    }

    async getUnreadNotificationCount() {
        return await this.request('/notifications/unread-count');
    }

    async markNotificationAsRead(id) {
        return await this.request(`/notifications/${id}/read`, {
            method: 'PUT'
        });
    }

    async markAllNotificationsAsRead() {
        return await this.request('/notifications/mark-all-read', {
            method: 'PUT'
        });
    }

    async deleteNotification(id) {
        return await this.request(`/notifications/${id}`, {
            method: 'DELETE'
        });
    }

    // File Upload APIs
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseURL}/uploads/single`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        return data;
    }

    async uploadMultipleFiles(files) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await fetch(`${this.baseURL}/uploads/multiple`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        return data;
    }

    async uploadProfileImage(file) {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${this.baseURL}/uploads/profile-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        return data;
    }
}

// Create global API service instance
const apiService = new ApiService();

// Export API service
window.apiService = apiService;
