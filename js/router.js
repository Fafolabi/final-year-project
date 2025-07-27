// Client-side router for SIWES Electronic Workbook

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }
    
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
        
        // Setup navigation links
        this.setupNavigationLinks();
    }
    
    addRoute(path, handler, requireAuth = false, requiredRole = null) {
        this.routes[path] = {
            handler,
            requireAuth,
            requiredRole
        };
    }
    
    navigate(path) {
        window.location.hash = path;
    }
    
    handleRouteChange() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes[hash];
        
        if (!route) {
            // Route not found, show 404
            this.showNotFound();
            return;
        }
        
        // Check authentication requirements
        if (route.requireAuth && !auth.isAuthenticated()) {
            this.navigate('/login');
            return;
        }
        
        // Check role requirements
        if (route.requiredRole && !auth.hasRole(route.requiredRole)) {
            utils.showToast('Access Denied', 'You do not have permission to access this page.', 'error');
            this.navigate('/dashboard');
            return;
        }
        
        // Execute route handler
        this.currentRoute = hash;
        route.handler();
        
        // Update active navigation links
        this.updateActiveLinks();
    }
    
    setupNavigationLinks() {
        // Handle all navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigate(href.slice(1));
            }
        });
    }
    
    updateActiveLinks() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current route link
        const currentLink = document.querySelector(`a[href="#${this.currentRoute}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }
    
    showNotFound() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container">
                <div class="text-center" style="min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <h1 style="font-size: 4rem; font-weight: bold; color: #2563eb; margin-bottom: 1rem;">404</h1>
                    <h2 style="font-size: 1.5rem; font-weight: 500; margin-bottom: 1.5rem;">Page Not Found</h2>
                    <p style="color: #64748b; margin-bottom: 2rem;">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                    <a href="#/" class="btn btn-primary">Return to Home</a>
                </div>
            </div>
        `;
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    goBack() {
        window.history.back();
    }
    
    goForward() {
        window.history.forward();
    }
}

// Create global router instance
const router = new Router();

// Define routes
router.addRoute('/', () => {
    // Home page - redirect to dashboard if authenticated
    if (auth.isAuthenticated()) {
        router.navigate('/dashboard');
    } else {
        window.pages.renderHomePage();
    }
});

router.addRoute('/login', () => {
    // Role selection page - redirect to dashboard if already authenticated
    if (auth.isAuthenticated()) {
        router.navigate('/dashboard');
    } else {
        window.pages.renderLoginPage();
    }
});

router.addRoute('/login/student', () => {
    // Student login page - redirect to dashboard if already authenticated
    if (auth.isAuthenticated()) {
        router.navigate('/dashboard');
    } else {
        window.pages.renderStudentLoginPage();
    }
});

router.addRoute('/login/institution-supervisor', () => {
    // Institution-based supervisor login page - redirect to dashboard if already authenticated
    if (auth.isAuthenticated()) {
        router.navigate('/dashboard');
    } else {
        window.pages.renderInstitutionSupervisorLoginPage();
    }
});

router.addRoute('/login/industrial-based-supervisor', () => {
    // Industrial-based supervisor login page - redirect to dashboard if already authenticated
    if (auth.isAuthenticated()) {
        router.navigate('/dashboard');
    } else {
        window.pages.renderIndustrialBasedSupervisorLoginPage();
    }
});

router.addRoute('/login/admin', () => {
    // Admin login page - redirect to dashboard if already authenticated
    if (auth.isAuthenticated()) {
        router.navigate('/dashboard');
    } else {
        window.pages.renderAdminLoginPage();
    }
});

router.addRoute('/dashboard', () => {
    window.pages.renderDashboardPage();
}, true); // Requires authentication

router.addRoute('/profile', () => {
    window.pages.renderProfilePage();
}, true); // Requires authentication

router.addRoute('/admin/users', () => {
    window.pages.renderUserManagementPage();
}, true, 'admin'); // Requires admin role

router.addRoute('/admin/reports', () => {
    window.pages.renderReportsPage();
}, true, 'admin'); // Requires admin role

router.addRoute('/admin/settings', () => {
    window.pages.renderSystemSettingsPage();
}, true, 'admin'); // Requires admin role

// Export router
window.router = router;
