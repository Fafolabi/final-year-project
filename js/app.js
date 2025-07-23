// Main application initialization for SIWES Electronic Workbook

class SIWESApp {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        console.log('SIWES Electronic Workbook - Starting Application');
        
        // Initialize current year in footer
        this.initializeFooter();
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
        
        // Setup authentication event listeners
        this.setupAuthEventListeners();
        
        // Setup data event listeners
        this.setupDataEventListeners();
        
        // Initialize router (this will trigger the initial route)
        console.log('Application initialized successfully');
    }
    
    initializeFooter() {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }
    
    setupGlobalEventListeners() {
        // Handle escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modalContainer = document.getElementById('modal-container');
                if (modalContainer && modalContainer.classList.contains('show')) {
                    utils.hideModal();
                }
            }
        });
        
        // Handle form submissions globally
        document.addEventListener('submit', (e) => {
            // Prevent default form submission for forms with data-prevent-default
            if (e.target.hasAttribute('data-prevent-default')) {
                e.preventDefault();
            }
        });
        
        // Handle clicks on disabled elements
        document.addEventListener('click', (e) => {
            if (e.target.disabled || e.target.hasAttribute('disabled')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
    
    setupAuthEventListeners() {
        // Listen for authentication state changes
        utils.eventBus.on('authStateChanged', (user) => {
            console.log('Auth state changed:', user ? `Logged in as ${user.name}` : 'Logged out');
            
            // Update navigation UI
            authManager.updateUI();
            
            // Redirect if needed
            const currentRoute = router.getCurrentRoute();
            if (!user && currentRoute && ['/dashboard', '/profile'].includes(currentRoute)) {
                router.navigate('/login');
            } else if (user && currentRoute === '/login') {
                router.navigate('/dashboard');
            }
        });
        
        // Listen for login success
        utils.eventBus.on('loginSuccess', (user) => {
            console.log('Login successful:', user.name);
        });
        
        // Listen for logout success
        utils.eventBus.on('logoutSuccess', () => {
            console.log('Logout successful');
            utils.showToast('Logged Out', 'You have been successfully logged out', 'success');
        });
        
        // Listen for login errors
        utils.eventBus.on('loginError', (error) => {
            console.error('Login error:', error);
            utils.showToast('Login Failed', error, 'error');
        });
    }
    
    setupDataEventListeners() {
        // Listen for data changes to update UI
        utils.eventBus.on('logEntryAdded', (entry) => {
            console.log('New log entry added:', entry.id);
        });
        
        utils.eventBus.on('weeklyReportAdded', (report) => {
            console.log('New weekly report added:', report.id);
        });
        
        utils.eventBus.on('weeklyReportUpdated', (report) => {
            console.log('Weekly report updated:', report.id);
        });
        
        utils.eventBus.on('notificationAdded', (notification) => {
            console.log('New notification:', notification.title);
            
            // Show toast for new notifications
            if (notification.userId === auth.getCurrentUser()?.id) {
                utils.showToast(notification.title, notification.message, 'success');
            }
        });
    }
    
    // Utility methods for the app
    showLoadingState(element) {
        if (element) {
            element.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; padding: 2rem;">
                    ${components.createLoadingSpinner({ size: 'lg' })}
                    <span style="margin-left: 0.5rem;">Loading...</span>
                </div>
            `;
        }
    }
    
    showErrorState(element, message = 'An error occurred') {
        if (element) {
            element.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #ef4444;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
                    <p>${utils.escapeHtml(message)}</p>
                    <button class="btn btn-outline btn-sm" onclick="location.reload()" style="margin-top: 1rem;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
    
    // Debug methods
    getAppState() {
        return {
            currentUser: auth.getCurrentUser(),
            currentRoute: router.getCurrentRoute(),
            users: dataManager.getUsers(),
            logEntries: dataManager.getLogEntries(),
            weeklyReports: dataManager.getWeeklyReports(),
            notifications: dataManager.getNotifications()
        };
    }
    
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    }
    
    exportData() {
        const data = {
            users: dataManager.getUsers(),
            studentProfiles: dataManager.getStudentProfiles(),
            logEntries: dataManager.getLogEntries(),
            weeklyReports: dataManager.getWeeklyReports(),
            notifications: dataManager.getNotifications(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `siwes-data-${utils.formatDate(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        utils.showToast('Export Complete', 'Data exported successfully', 'success');
    }
}

// Initialize the application
const app = new SIWESApp();

// Export app instance for debugging
window.app = app;

// Add some global utility functions for debugging
window.debug = {
    getAppState: () => app.getAppState(),
    clearAllData: () => app.clearAllData(),
    exportData: () => app.exportData(),
    showToast: (title, message, type) => utils.showToast(title, message, type),
    navigate: (path) => router.navigate(path),
    getCurrentUser: () => auth.getCurrentUser(),
    login: (role) => auth.login('demo@example.com', role),
    logout: () => auth.logout()
};

console.log('SIWES Electronic Workbook loaded. Use window.debug for debugging utilities.');
