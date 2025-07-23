// Authentication system for SIWES Electronic Workbook

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoading = true;
        this.init();
    }
    
    init() {
        // Check for existing user session
        const savedUser = utils.storage.get('currentUser');
        if (savedUser) {
            // Verify user still exists in the system
            const user = dataManager.getUserById(savedUser.id);
            if (user) {
                this.currentUser = user;
            } else {
                // User no longer exists, clear session
                utils.storage.remove('currentUser');
            }
        }
        this.isLoading = false;
        this.updateUI();
        utils.eventBus.emit('authStateChanged', this.currentUser);
    }
    
    login(email, role = null) {
        let user = null;

        if (role) {
            // Demo login by role
            user = dataManager.getUsersByRole(role)[0];
        } else {
            // Login by email
            user = dataManager.getUserByEmail(email);
        }

        if (user) {
            this.currentUser = user;
            utils.storage.set('currentUser', user);
            this.updateUI();
            utils.eventBus.emit('authStateChanged', this.currentUser);
            utils.eventBus.emit('loginSuccess', user);
            return true;
        }

        utils.eventBus.emit('loginError', 'Invalid credentials');
        return false;
    }

    loginWithCredentials(email, password, expectedRole) {
        // Find user by email
        const user = dataManager.getUserByEmail(email);

        if (!user) {
            utils.eventBus.emit('loginError', 'User not found');
            return false;
        }

        // Verify password (for demo purposes, check against stored password)
        // In a real system, you would verify the password hash here
        if (!password || password.length < 1) {
            utils.eventBus.emit('loginError', 'Password is required');
            return false;
        }

        if (user.password && user.password !== password) {
            utils.eventBus.emit('loginError', 'Invalid password');
            return false;
        }

        // Verify the user has the expected role
        if (user.role !== expectedRole) {
            utils.eventBus.emit('loginError', `This account is not registered as a ${expectedRole.replace('_', ' ')}`);
            return false;
        }

        // Login successful
        this.currentUser = user;
        utils.storage.set('currentUser', user);
        this.updateUI();
        utils.eventBus.emit('authStateChanged', this.currentUser);
        utils.eventBus.emit('loginSuccess', user);
        return true;
    }
    
    logout() {
        this.currentUser = null;
        utils.storage.remove('currentUser');
        this.updateUI();
        utils.eventBus.emit('authStateChanged', null);
        utils.eventBus.emit('logoutSuccess');
        
        // Redirect to home page
        window.router.navigate('/');
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }
    
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.router.navigate('/login');
            return false;
        }
        return true;
    }
    
    requireRole(role) {
        if (!this.isAuthenticated()) {
            router.navigate('/login');
            return false;
        }
        
        if (this.currentUser.role !== role) {
            utils.showToast('Access Denied', 'You do not have permission to access this page.', 'error');
            router.navigate('/dashboard');
            return false;
        }
        
        return true;
    }
    
    updateUI() {
        const navUser = document.getElementById('nav-user');
        const navAuth = document.getElementById('nav-auth');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        
        if (this.currentUser) {
            // Show user menu
            navUser.classList.add('show');
            navAuth.style.display = 'none';
            
            // Update user info
            if (userAvatar) {
                userAvatar.src = this.currentUser.profileImage || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.name)}&background=2563eb&color=fff`;
                userAvatar.alt = this.currentUser.name;
            }
            
            if (userName) {
                userName.textContent = this.currentUser.name;
            }
        } else {
            // Show login button
            navUser.classList.remove('show');
            navAuth.style.display = 'block';
        }
    }
    
    setupEventListeners() {
        // User dropdown toggle
        const userButton = document.getElementById('user-button');
        const dropdownMenu = document.getElementById('dropdown-menu');
        
        if (userButton && dropdownMenu) {
            userButton.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
            });
            
            // Prevent dropdown from closing when clicking inside
            dropdownMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Setup event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    authManager.setupEventListeners();
});

// Export auth manager
window.authManager = authManager;

// Auth utility functions
window.auth = {
    login: (email, role) => authManager.login(email, role),
    loginWithCredentials: (email, password, expectedRole) => authManager.loginWithCredentials(email, password, expectedRole),
    logout: () => authManager.logout(),
    getCurrentUser: () => authManager.getCurrentUser(),
    isAuthenticated: () => authManager.isAuthenticated(),
    hasRole: (role) => authManager.hasRole(role),
    requireAuth: () => authManager.requireAuth(),
    requireRole: (role) => authManager.requireRole(role)
};
