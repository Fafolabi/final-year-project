// Page components for SIWES Electronic Workbook

// Home page
function renderHomePage() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="container">
            <div style="min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="max-width: 48rem; text-align: center;">
                    <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">
                        SIWES Electronic Workbook
                    </h1>
                    <p style="font-size: 1.25rem; color: #64748b; margin-bottom: 2rem;">
                        A comprehensive platform for documenting and tracking your industrial training experience.
                        Manage daily logs, submit weekly reports, and get feedback from supervisors.
                    </p>
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 4rem;">
                        <a href="#/login" class="btn btn-primary btn-lg">Get Started</a>
                        <button class="btn btn-outline btn-lg" disabled>Learn More</button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${components.createCard({
                            content: `
                                <div style="text-align: center; padding-top: 1.5rem;">
                                    <div style="background-color: rgba(37, 99, 235, 0.1); border-radius: 50%; padding: 0.75rem; width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.5rem; width: 1.5rem; color: #2563eb;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 0.5rem;">Daily Logs</h3>
                                    <p style="color: #64748b; text-align: center;">
                                        Keep track of your daily activities and tasks with easy-to-use log entries and attachments.
                                    </p>
                                </div>
                            `
                        })}

                        ${components.createCard({
                            content: `
                                <div style="text-align: center; padding-top: 1.5rem;">
                                    <div style="background-color: rgba(37, 99, 235, 0.1); border-radius: 50%; padding: 0.75rem; width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.5rem; width: 1.5rem; color: #2563eb;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 0.5rem;">Weekly Reports</h3>
                                    <p style="color: #64748b; text-align: center;">
                                        Submit comprehensive weekly reports to document your progress and learning experiences.
                                    </p>
                                </div>
                            `
                        })}

                        ${components.createCard({
                            content: `
                                <div style="text-align: center; padding-top: 1.5rem;">
                                    <div style="background-color: rgba(37, 99, 235, 0.1); border-radius: 50%; padding: 0.75rem; width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.5rem; width: 1.5rem; color: #2563eb;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 0.5rem;">Supervisor Feedback</h3>
                                    <p style="color: #64748b; text-align: center;">
                                        Receive timely feedback and guidance from your supervisors to enhance your learning.
                                    </p>
                                </div>
                            `
                        })}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Role Selection page
function renderLoginPage() {
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
        <div class="container">
            <div style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
                ${components.createCard({
                    title: 'SIWES Electronic Workbook',
                    description: 'Select your role to continue to login',
                    className: 'login-card',
                    content: `
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <p style="color: #64748b; margin-bottom: 1.5rem;">
                                Please select your role to access the appropriate login page:
                            </p>
                            <div class="space-y-4">
                                <button class="btn btn-primary" style="width: 100%; margin-bottom: 0.75rem; padding: 1rem;" onclick="router.navigate('/login/student')">
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Student Login
                                    </div>
                                </button>
                                <button class="btn btn-outline" style="width: 100%; margin-bottom: 0.75rem; padding: 1rem;" onclick="router.navigate('/login/institution-supervisor')">
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Institution-based Supervisor Login
                                    </div>
                                </button>
                                <button class="btn btn-outline" style="width: 100%; margin-bottom: 0.75rem; padding: 1rem;" onclick="router.navigate('/login/industrial-based-supervisor')">
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                                        </svg>
                                        Industrial-based Supervisor Login
                                    </div>
                                </button>
                                <button class="btn btn-outline" style="width: 100%; padding: 1rem;" onclick="router.navigate('/login/admin')">
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Administrator Login
                                    </div>
                                </button>
                            </div>
                        </div>
                    `
                })}
            </div>
        </div>

        <style>
            .login-card {
                width: 100%;
                max-width: 32rem;
            }
        </style>
    `;
}

// Student Login page
function renderStudentLoginPage() {
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
        <div class="container">
            <div style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
                ${components.createCard({
                    title: 'Student Login',
                    description: 'Enter your credentials to access your SIWES workbook',
                    className: 'login-card',
                    content: `
                        <div style="background-color: #f0f9ff; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1rem; border-left: 4px solid #0ea5e9;">
                            <p style="font-size: 0.875rem; color: #0c4a6e; margin: 0;">
                                <strong>Demo Credentials:</strong><br>
                                Email: john.doe@example.com<br>
                                Password: student123
                            </p>
                        </div>

                        <form id="student-login-form">
                            ${components.createFormInput({
                                type: 'email',
                                name: 'email',
                                label: 'Email Address',
                                placeholder: 'Enter your email address',
                                required: true
                            })}

                            ${components.createFormInput({
                                type: 'password',
                                name: 'password',
                                label: 'Password',
                                placeholder: 'Enter your password',
                                required: true
                            })}

                            <div style="margin-top: 1.5rem;">
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    Login as Student
                                </button>
                            </div>

                            <div style="text-align: center; margin-top: 1rem;">
                                <a href="#/login" style="color: #64748b; text-decoration: none; font-size: 0.875rem;">
                                    ← Back to role selection
                                </a>
                            </div>
                        </form>
                    `
                })}
            </div>
        </div>

        <style>
            .login-card {
                width: 100%;
                max-width: 28rem;
            }
        </style>
    `;

    // Handle form submission
    document.getElementById('student-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();

        if (auth.loginWithCredentials(email, password, 'student')) {
            utils.showToast('Login Successful', 'Welcome back!', 'success');
            router.navigate('/dashboard');
        } else {
            utils.showToast('Login Failed', 'Invalid email or password', 'error');
        }
    });
}

// Institution-based Supervisor Login page
function renderInstitutionSupervisorLoginPage() {
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
        <div class="container">
            <div style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
                ${components.createCard({
                    title: 'Institution-based Supervisor Login',
                    description: 'Enter your credentials to access the supervision portal',
                    className: 'login-card',
                    content: `
                        <div style="background-color: #f0f9ff; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1rem; border-left: 4px solid #0ea5e9;">
                            <p style="font-size: 0.875rem; color: #0c4a6e; margin: 0;">
                                <strong>Demo Credentials:</strong><br>
                                Email: jane.smith@example.com<br>
                                Password: academic123
                            </p>
                        </div>

                        <form id="academic-supervisor-login-form">
                            ${components.createFormInput({
                                type: 'email',
                                name: 'email',
                                label: 'Email Address',
                                placeholder: 'Enter your email address',
                                required: true
                            })}

                            ${components.createFormInput({
                                type: 'password',
                                name: 'password',
                                label: 'Password',
                                placeholder: 'Enter your password',
                                required: true
                            })}

                            <div style="margin-top: 1.5rem;">
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    Login as Institution-based Supervisor
                                </button>
                            </div>

                            <div style="text-align: center; margin-top: 1rem;">
                                <a href="#/login" style="color: #64748b; text-decoration: none; font-size: 0.875rem;">
                                    ← Back to role selection
                                </a>
                            </div>
                        </form>
                    `
                })}
            </div>
        </div>

        <style>
            .login-card {
                width: 100%;
                max-width: 28rem;
            }
        </style>
    `;

    // Handle form submission
    document.getElementById('academic-supervisor-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();

        if (auth.loginWithCredentials(email, password, 'institution_supervisor')) {
            utils.showToast('Login Successful', 'Welcome back!', 'success');
            router.navigate('/dashboard');
        } else {
            utils.showToast('Login Failed', 'Invalid email or password', 'error');
        }
    });
}

// Industrial-based Supervisor Login page
function renderIndustrialBasedSupervisorLoginPage() {
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
        <div class="container">
            <div style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
                ${components.createCard({
                    title: 'Industrial-based Supervisor Login',
                    description: 'Enter your credentials to access the workplace supervision portal',
                    className: 'login-card',
                    content: `
                        <div style="background-color: #f0f9ff; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1rem; border-left: 4px solid #0ea5e9;">
                            <p style="font-size: 0.875rem; color: #0c4a6e; margin: 0;">
                                <strong>Demo Credentials:</strong><br>
                                Email: robert.johnson@techsolutions.com<br>
                                Password: industrial123
                            </p>
                        </div>

                        <form id="industrial-supervisor-login-form">
                            ${components.createFormInput({
                                type: 'email',
                                name: 'email',
                                label: 'Email Address',
                                placeholder: 'Enter your email address',
                                required: true
                            })}

                            ${components.createFormInput({
                                type: 'password',
                                name: 'password',
                                label: 'Password',
                                placeholder: 'Enter your password',
                                required: true
                            })}

                            <div style="margin-top: 1.5rem;">
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    Login as Industrial-based Supervisor
                                </button>
                            </div>

                            <div style="text-align: center; margin-top: 1rem;">
                                <a href="#/login" style="color: #64748b; text-decoration: none; font-size: 0.875rem;">
                                    ← Back to role selection
                                </a>
                            </div>
                        </form>
                    `
                })}
            </div>
        </div>

        <style>
            .login-card {
                width: 100%;
                max-width: 28rem;
            }
        </style>
    `;

    // Handle form submission
    document.getElementById('industrial-supervisor-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();

        if (auth.loginWithCredentials(email, password, 'industrial_based_supervisor')) {
            utils.showToast('Login Successful', 'Welcome back!', 'success');
            router.navigate('/dashboard');
        } else {
            utils.showToast('Login Failed', 'Invalid email or password', 'error');
        }
    });
}

// Admin Login page
function renderAdminLoginPage() {
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
        <div class="container">
            <div style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
                ${components.createCard({
                    title: 'Administrator Login',
                    description: 'Enter your credentials to access the admin panel',
                    className: 'login-card',
                    content: `
                        <div style="background-color: #f0f9ff; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1rem; border-left: 4px solid #0ea5e9;">
                            <p style="font-size: 0.875rem; color: #0c4a6e; margin: 0;">
                                <strong>Demo Credentials:</strong><br>
                                Email: admin@example.com<br>
                                Password: admin123
                            </p>
                        </div>

                        <form id="admin-login-form">
                            ${components.createFormInput({
                                type: 'email',
                                name: 'email',
                                label: 'Email Address',
                                placeholder: 'Enter your email address',
                                required: true
                            })}

                            ${components.createFormInput({
                                type: 'password',
                                name: 'password',
                                label: 'Password',
                                placeholder: 'Enter your password',
                                required: true
                            })}

                            <div style="margin-top: 1.5rem;">
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    Login as Administrator
                                </button>
                            </div>

                            <div style="text-align: center; margin-top: 1rem;">
                                <a href="#/login" style="color: #64748b; text-decoration: none; font-size: 0.875rem;">
                                    ← Back to role selection
                                </a>
                            </div>
                        </form>
                    `
                })}
            </div>
        </div>

        <style>
            .login-card {
                width: 100%;
                max-width: 28rem;
            }
        </style>
    `;

    // Handle form submission
    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();

        if (auth.loginWithCredentials(email, password, 'admin')) {
            utils.showToast('Login Successful', 'Welcome back!', 'success');
            router.navigate('/dashboard');
        } else {
            utils.showToast('Login Failed', 'Invalid email or password', 'error');
        }
    });
}

// Dashboard page
function renderDashboardPage() {
    if (!auth.requireAuth()) return;
    
    const user = auth.getCurrentUser();
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="container space-y-6">
            <div>
                <h1 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem;">Dashboard</h1>
                <p style="color: #64748b;">
                    Welcome back, ${utils.escapeHtml(user.name)}!
                    ${user.role === 'student' ? 'Manage your SIWES documentation here.' :
                      user.role === 'institution_supervisor' ? 'Review student progress and provide academic feedback.' :
                      user.role === 'industrial_based_supervisor' ? 'Monitor student workplace performance and provide industrial guidance.' :
                      user.role === 'admin' ? 'Manage the SIWES system and users.' :
                      'Manage your SIWES documentation here.'}
                </p>
            </div>
            
            <div id="dashboard-content">
                ${components.createLoadingSpinner({ size: 'lg' })}
            </div>
        </div>
    `;
    
    // Load role-specific dashboard
    setTimeout(() => {
        const dashboardContent = document.getElementById('dashboard-content');
        
        if (user.role === 'student') {
            dashboardContent.innerHTML = renderStudentDashboard(user.id);
        } else if (user.role === 'institution_supervisor' || user.role === 'industrial_based_supervisor') {
            dashboardContent.innerHTML = renderSupervisorDashboard(user.id);
        } else if (user.role === 'admin') {
            dashboardContent.innerHTML = renderAdminDashboard(user.id);
        }
    }, 100);
}

// Profile page
function renderProfilePage() {
    if (!auth.requireAuth()) return;
    
    const user = auth.getCurrentUser();
    const studentProfile = user.role === 'student' ? dataManager.getStudentProfile(user.id) : null;
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="container space-y-6">
            <h1 style="font-size: 1.875rem; font-weight: bold;">Profile</h1>
            
            ${components.createCard({
                title: 'Personal Information',
                description: 'Your account details',
                content: `
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                            ${components.createAvatar({ 
                                src: user.profileImage, 
                                name: user.name, 
                                size: 'xl' 
                            })}
                            <button class="btn btn-outline btn-sm" disabled>Change Avatar</button>
                        </div>
                        
                        <div style="flex: 1;">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Full Name</p>
                                    <p style="font-weight: 500;">${utils.escapeHtml(user.name)}</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Email</p>
                                    <p style="font-weight: 500;">${utils.escapeHtml(user.email)}</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Role</p>
                                    <p style="font-weight: 500; text-transform: capitalize;">${utils.escapeHtml(user.role)}</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Member Since</p>
                                    <p style="font-weight: 500;">${utils.formatDate(new Date())}</p>
                                </div>
                            </div>
                            
                            <div style="padding-top: 1rem;">
                                <button class="btn btn-primary" disabled>Edit Profile</button>
                            </div>
                        </div>
                    </div>
                `
            })}
            
            ${studentProfile ? `
                ${components.createCard({
                    title: 'SIWES Information',
                    description: 'Details about your industrial training',
                    content: `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Matric Number</p>
                                <p style="font-weight: 500;">${utils.escapeHtml(studentProfile.matricNumber)}</p>
                            </div>
                            <div>
                                <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Department</p>
                                <p style="font-weight: 500;">${utils.escapeHtml(studentProfile.department)}</p>
                            </div>
                            <div>
                                <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Level</p>
                                <p style="font-weight: 500;">${utils.escapeHtml(studentProfile.level)}</p>
                            </div>
                            <div>
                                <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Company</p>
                                <p style="font-weight: 500;">${utils.escapeHtml(studentProfile.company)}</p>
                            </div>
                            <div>
                                <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Duration</p>
                                <p style="font-weight: 500;">
                                    ${utils.formatDate(studentProfile.startDate)} - ${utils.formatDate(studentProfile.endDate)}
                                </p>
                            </div>
                        </div>
                    `
                })}
            ` : ''}
            
            ${components.createCard({
                title: 'Account Settings',
                description: 'Manage your account preferences',
                content: `
                    <div class="space-y-4">
                        <div>
                            <h3 style="font-weight: 500;">Password</h3>
                            <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                                Change your account password
                            </p>
                            <button class="btn btn-outline" disabled>Change Password</button>
                        </div>
                        
                        <div>
                            <h3 style="font-weight: 500;">Notifications</h3>
                            <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                                Manage email notifications and alerts
                            </p>
                            <button class="btn btn-outline" disabled>Notification Settings</button>
                        </div>
                    </div>
                `
            })}
        </div>
    `;
}

// Student Dashboard
function renderStudentDashboard(userId) {
    const logEntries = dataManager.getLogEntriesByStudent(userId);
    const weeklyReports = dataManager.getWeeklyReportsByStudent(userId);
    const notifications = dataManager.getNotificationsByUser(userId);
    const studentProfile = dataManager.getStudentProfile(userId);

    const recentLogs = logEntries.filter(log => {
        const logDate = new Date(log.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return logDate >= weekAgo;
    });

    return components.createTabs({
        tabs: [
            {
                label: 'Overview',
                content: `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="margin-bottom: 1.5rem;">
                        ${components.createStatsCard({
                            title: 'Daily Logs',
                            value: logEntries.length.toString(),
                            description: `+${recentLogs.length} this week`
                        })}

                        ${components.createStatsCard({
                            title: 'Weekly Reports',
                            value: weeklyReports.length.toString(),
                            description: `${weeklyReports.filter(r => r.status === 'submitted').length} submitted`
                        })}

                        ${components.createStatsCard({
                            title: 'Notifications',
                            value: notifications.filter(n => !n.isRead).length.toString(),
                            description: 'unread messages'
                        })}
                    </div>

                    ${studentProfile ? components.createCard({
                        title: 'Placement Information',
                        description: 'Details about your SIWES placement',
                        content: `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Department</p>
                                    <p>${utils.escapeHtml(studentProfile.department)}</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Level</p>
                                    <p>${utils.escapeHtml(studentProfile.level)}</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Company</p>
                                    <p>${utils.escapeHtml(studentProfile.company)}</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Duration</p>
                                    <p>${utils.formatDate(studentProfile.startDate)} - ${utils.formatDate(studentProfile.endDate)}</p>
                                </div>
                            </div>
                        `
                    }) : ''}
                `
            },
            {
                label: 'Daily Logs',
                content: `
                    <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="showAddLogForm()">Add Detailed Log</button>
                        <button class="btn btn-outline" onclick="showQuickLogForm()">Quick Update</button>
                        <button class="btn btn-outline" onclick="showWeeklySummaryForm()">Weekly Summary</button>
                    </div>

                    ${logEntries.length > 0 ? `
                        <div class="space-y-4">
                            ${logEntries.map(log => {
                                const isWeeklySummary = log.type === 'weekly_summary';
                                const isQuickUpdate = log.type === 'quick';
                                
                                return components.createCard({
                                    content: `
                                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                                            <div>
                                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                                    <h4 style="font-weight: 600;">
                                                        ${utils.formatDate(log.date)}
                                                    </h4>
                                                    ${isWeeklySummary ? components.createBadge({ text: 'Weekly Summary', variant: 'secondary' }) : ''}
                                                    ${isQuickUpdate ? components.createBadge({ text: 'Quick Update', variant: 'outline' }) : ''}
                                                </div>
                                                <p style="font-size: 0.875rem; color: #64748b;">
                                                    Created: ${utils.formatDate(log.createdAt)}
                                                    ${log.updatedAt && log.updatedAt !== log.createdAt ? 
                                                        ` • Updated: ${utils.formatDate(log.updatedAt)}` : ''}
                                                </p>
                                            </div>
                                            <div style="display: flex; gap: 0.5rem;">
                                                <button class="btn btn-outline btn-sm" onclick="showEditLogForm('${log.id}')" title="Edit">
                                                    ✏️
                                                </button>
                                                <button class="btn btn-outline btn-sm" onclick="deleteLogEntry('${log.id}')" title="Delete" style="color: #dc2626; border-color: #dc2626;">
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                        <div style="margin-bottom: 0.75rem; max-height: ${isWeeklySummary ? '12rem' : '6rem'}; overflow-y: auto;">
                                            ${isWeeklySummary ? utils.markdownToHtml(log.content) : utils.escapeHtml(log.content)}
                                        </div>
                                        ${log.attachments && log.attachments.length > 0 ? `
                                            <div>
                                                <p style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem;">Attachments:</p>
                                                ${log.attachments.map(attachment => `
                                                    <span class="badge badge-secondary" style="margin-right: 0.5rem;">
                                                        ${utils.escapeHtml(attachment)}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                    `
                                });
                            }).join('')}
                        </div>
                    ` : components.createEmptyState({
                        title: 'No Daily Logs',
                        description: 'Start documenting your daily activities. Choose from detailed logs, quick updates, or weekly summaries.',
                        actionText: 'Add First Log',
                        actionHref: '#'
                    })}
                `
            },
            {
                label: 'Weekly Reports',
                content: `
                    <div style="margin-bottom: 1rem;">
                        <button class="btn btn-primary" onclick="showAddReportForm()">Add New Report</button>
                    </div>

                    ${weeklyReports.length > 0 ? `
                        <div class="space-y-6">
                            ${weeklyReports.map(report => components.createCard({
                                content: `
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                                        <div>
                                            <h4 style="font-weight: 600; font-size: 1.125rem;">Week ${report.weekNumber}</h4>
                                            <p style="font-size: 0.875rem; color: #64748b;">
                                                ${utils.formatDate(report.startDate, 'MMM d')} - ${utils.formatDate(report.endDate, 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                        ${components.createBadge({
                                            text: report.status.charAt(0).toUpperCase() + report.status.slice(1),
                                            variant: report.status === 'draft' ? 'outline' :
                                                    report.status === 'submitted' ? 'secondary' : 'default'
                                        })}
                                    </div>
                                    <div style="margin-bottom: 0.75rem;">
                                        ${utils.markdownToHtml(report.content)}
                                    </div>
                                    ${report.supervisorFeedback ? `
                                        <div style="background-color: #f8fafc; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #2563eb; margin-bottom: 0.75rem;">
                                            <p style="font-weight: 500; margin-bottom: 0.5rem;">Institution-based Supervisor Feedback:</p>
                                            <p style="color: #374151;">${utils.escapeHtml(report.supervisorFeedback)}</p>
                                        </div>
                                    ` : ''}
                                    ${report.industrialSupervisorFeedback ? `
                                        <div style="background-color: #f0fdf4; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #16a34a;">
                                            <p style="font-weight: 500; margin-bottom: 0.5rem;">Industrial-based Supervisor Comments (Weekly Check-in):</p>
                                            <p style="color: #374151;">${utils.escapeHtml(report.industrialSupervisorFeedback)}</p>
                                        </div>
                                    ` : ''}
                                `
                            })).join('')}
                        </div>
                    ` : components.createEmptyState({
                        title: 'No Weekly Reports',
                        description: 'Submit your first weekly report to track your progress.',
                        actionText: 'Add First Report',
                        actionHref: '#'
                    })}
                `
            }
        ]
    });
}

// Supervisor Dashboard
function renderSupervisorDashboard(userId) {
    const user = auth.getCurrentUser();
    const supervisedStudents = dataManager.getStudentsBySupervisor(userId);
    const pendingReports = dataManager.getPendingReports(userId);
    const isInstitutionSupervisor = user.role === 'institution_supervisor';
    const isIndustrialBasedSupervisor = user.role === 'industrial_based_supervisor';

    return components.createTabs({
        tabs: [
            {
                label: 'Overview',
                content: `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="margin-bottom: 1.5rem;">
                        ${components.createStatsCard({
                            title: 'Supervised Students',
                            value: supervisedStudents.length.toString()
                        })}

                        ${components.createStatsCard({
                            title: 'Pending Reviews',
                            value: pendingReports.length.toString()
                        })}

                        ${components.createStatsCard({
                            title: 'Upcoming Visits',
                            value: '0'
                        })}
                    </div>

                    ${components.createCard({
                        title: 'Pending Reviews',
                        description: 'Reports awaiting your feedback',
                        content: pendingReports.length > 0 ? `
                            <div class="space-y-4">
                                ${pendingReports.map(report => {
                                    const student = dataManager.getUserById(report.studentId);
                                    const studentProfile = dataManager.getStudentProfiles().find(p => p.userId === report.studentId);
                                    return components.createCard({
                                        content: `
                                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                                                <div>
                                                    <h4 style="font-weight: 600;">Week ${report.weekNumber} - ${student ? student.name : 'Unknown Student'}</h4>
                                                    <p style="font-size: 0.875rem; color: #64748b;">
                                                        ${utils.formatDate(report.startDate, 'MMM d')} - ${utils.formatDate(report.endDate, 'MMM d, yyyy')}
                                                    </p>
                                                    ${studentProfile?.matricNumber ? `<p style="font-size: 0.75rem; color: #059669; font-weight: 500;">Matric: ${utils.escapeHtml(studentProfile.matricNumber)}</p>` : ''}
                                                </div>
                                                ${isInstitutionSupervisor ? `
                                                    <button class="btn btn-primary btn-sm" onclick="reviewReport('${report.id}')" title="Institution-based Supervisor Feedback">
                                                        Institution Review
                                                    </button>
                                                ` : ''}
                                                ${isIndustrialBasedSupervisor ? `
                                                    <button class="btn btn-outline btn-sm" onclick="addIndustrialBasedSupervisorComment('${report.id}')" title="Industrial-based Supervisor Comments">
                                                        Industrial Comments
                                                    </button>
                                                ` : ''}
                                            </div>
                                            <div style="max-height: 6rem; overflow: hidden;">
                                                ${utils.markdownToHtml(report.content)}
                                            </div>
                                        `
                                    });
                                }).join('')}
                            </div>
                        ` : components.createEmptyState({
                            title: 'No Pending Reviews',
                            description: 'All reports have been reviewed.'
                        })
                    })}
                `
            },
            {
                label: 'Students',
                content: supervisedStudents.length > 0 ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${supervisedStudents.map(student => components.createCard({
                            content: `
                                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                    ${components.createAvatar({
                                        src: student.studentImage,
                                        name: student.studentName,
                                        size: 'md'
                                    })}
                                    <div>
                                        <h3 style="font-weight: 500;">${utils.escapeHtml(student.studentName)}</h3>
                                        <p style="font-size: 0.875rem; color: #64748b;">${utils.escapeHtml(student.studentEmail)}</p>
                                        ${student.matricNumber ? `<p style="font-size: 0.75rem; color: #059669; font-weight: 500;">Matric: ${utils.escapeHtml(student.matricNumber)}</p>` : ''}
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <p style="font-size: 0.875rem; color: #64748b;">Department</p>
                                        <p>${utils.escapeHtml(student.department)}</p>
                                    </div>
                                    <div>
                                        <p style="font-size: 0.875rem; color: #64748b;">Company</p>
                                        <p>${utils.escapeHtml(student.company)}</p>
                                    </div>
                                </div>
                            `
                        })).join('')}
                    </div>
                ` : components.createEmptyState({
                    title: 'No Students Assigned',
                    description: 'You are not currently supervising any students.'
                })
            }
        ]
    });
}

// Admin Dashboard
function renderAdminDashboard(userId) {
    const users = dataManager.getUsers();
    const studentsCount = users.filter(user => user.role === 'student').length;
    const institutionSupervisorsCount = users.filter(user => user.role === 'institution_supervisor').length;
    const industrialBasedSupervisorsCount = users.filter(user => user.role === 'industrial_based_supervisor').length;
    const supervisorsCount = institutionSupervisorsCount + industrialBasedSupervisorsCount;

    return components.createTabs({
        tabs: [
            {
                label: 'Overview',
                content: `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="margin-bottom: 1.5rem;">
                        ${components.createStatsCard({
                            title: 'Total Students',
                            value: studentsCount.toString()
                        })}

                        ${components.createStatsCard({
                            title: 'Total Supervisors',
                            value: supervisorsCount.toString()
                        })}

                        ${components.createStatsCard({
                            title: 'Active Placements',
                            value: dataManager.getStudentProfiles().length.toString()
                        })}
                    </div>

                    ${components.createCard({
                        title: 'System Status',
                        description: 'Current system and activity overview',
                        content: `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Current Academic Year</p>
                                    <p>2024/2025</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">SIWES Period</p>
                                    <p>May - August 2024</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">Last System Update</p>
                                    <p>${utils.formatDate(new Date())}</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b;">System Version</p>
                                    <p>v1.0.0</p>
                                </div>
                            </div>
                        `
                    })}

                    ${components.createCard({
                        title: 'Quick Actions',
                        description: 'Common administrative tasks',
                        content: `
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button class="btn btn-outline" style="height: 6rem; display: flex; flex-direction: column; align-items: center; justify-content: center;" onclick="router.navigate('/admin/users')">
                                    <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.5rem; width: 1.5rem; margin-bottom: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add New User
                                </button>
                                <button class="btn btn-outline" style="height: 6rem; display: flex; flex-direction: column; align-items: center; justify-content: center;" onclick="router.navigate('/admin/reports')">
                                    <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.5rem; width: 1.5rem; margin-bottom: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Generate Reports
                                </button>
                                <button class="btn btn-outline" style="height: 6rem; display: flex; flex-direction: column; align-items: center; justify-content: center;" onclick="router.navigate('/admin/settings')">
                                    <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.5rem; width: 1.5rem; margin-bottom: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    System Settings
                                </button>
                            </div>
                        `
                    })}
                `
            },
            {
                label: 'Users',
                content: `
                    <div class="space-y-4">
                        ${users.map(user => components.createCard({
                            content: `
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        ${components.createAvatar({
                                            src: user.profileImage,
                                            name: user.name,
                                            size: 'md'
                                        })}
                                        <div>
                                            <h3 style="font-weight: 500;">${utils.escapeHtml(user.name)}</h3>
                                            <p style="font-size: 0.875rem; color: #64748b;">${utils.escapeHtml(user.email)}</p>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        ${components.createBadge({
                                            text: user.role === 'institution_supervisor' ? 'Institution-based Supervisor' :
                                                  user.role === 'industrial_based_supervisor' ? 'Industrial-based Supervisor' :
                                                  user.role.charAt(0).toUpperCase() + user.role.slice(1),
                                            variant: user.role === 'admin' ? 'default' :
                                                    (user.role === 'institution_supervisor' || user.role === 'industrial_based_supervisor') ? 'secondary' : 'outline'
                                        })}
                                    </div>
                                </div>
                            `
                        })).join('')}
                    </div>
                `
            }
        ]
    });
}

// User Management page
function renderUserManagementPage() {
    if (!auth.requireRole('admin')) return;
    
    const users = dataManager.getUsers();
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="container space-y-6">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1 style="font-size: 1.875rem; font-weight: bold;">User Management</h1>
                <button class="btn btn-primary" onclick="showAddUserForm()">Add New User</button>
            </div>
            
            <div class="space-y-4">
                ${users.map(user => components.createCard({
                    content: `
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                ${components.createAvatar({
                                    src: user.profileImage,
                                    name: user.name,
                                    size: 'md'
                                })}
                                <div>
                                    <h3 style="font-weight: 500;">${utils.escapeHtml(user.name)}</h3>
                                    <p style="font-size: 0.875rem; color: #64748b;">${utils.escapeHtml(user.email)}</p>
                                    ${user.role === 'student' ? (() => {
                                        const studentProfile = dataManager.getStudentProfiles().find(p => p.userId === user.id);
                                        if (!studentProfile) return '';

                                        let profileInfo = studentProfile.matricNumber ? `<p style="font-size: 0.75rem; color: #059669; font-weight: 500;">Matric: ${utils.escapeHtml(studentProfile.matricNumber)}</p>` : '';

                                        // Show supervisor assignments
                                        const academicSupervisor = studentProfile.academicSupervisorId ? dataManager.getUserById(studentProfile.academicSupervisorId) : null;
                                        const industrialSupervisor = studentProfile.industrialSupervisorId ? dataManager.getUserById(studentProfile.industrialSupervisorId) : null;

                                        if (academicSupervisor) {
                                            profileInfo += `<p style="font-size: 0.75rem; color: #3b82f6;">Academic: ${utils.escapeHtml(academicSupervisor.name)}</p>`;
                                        }
                                        if (industrialSupervisor) {
                                            profileInfo += `<p style="font-size: 0.75rem; color: #8b5cf6;">Industrial: ${utils.escapeHtml(industrialSupervisor.name)}</p>`;
                                        }

                                        return profileInfo;
                                    })() : ''}
                                    ${user.role === 'institution_supervisor' && user.academicDepartment ? `
                                        <p style="font-size: 0.75rem; color: #64748b;">${utils.escapeHtml(user.academicDepartment)}</p>
                                    ` : ''}
                                    ${user.role === 'industrial_based_supervisor' && user.company ? `
                                        <p style="font-size: 0.75rem; color: #64748b;">${utils.escapeHtml(user.company)}</p>
                                    ` : ''}
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                ${components.createBadge({
                                    text: user.role === 'institution_supervisor' ? 'Institution-based Supervisor' :
                                          user.role === 'industrial_based_supervisor' ? 'Industrial-based Supervisor' :
                                          user.role.charAt(0).toUpperCase() + user.role.slice(1),
                                    variant: user.role === 'admin' ? 'default' :
                                            (user.role === 'institution_supervisor' || user.role === 'industrial_based_supervisor') ? 'secondary' : 'outline'
                                })}
                                ${user.role === 'student' ? `
                                    <button class="btn btn-secondary btn-sm" onclick="showAssignSupervisorsForm('${user.id}')" style="margin-right: 0.5rem;">Assign Supervisors</button>
                                ` : ''}
                                ${user.role !== 'admin' ? `
                                    <button class="btn btn-outline btn-sm" onclick="deleteUser('${user.id}')">Delete</button>
                                ` : ''}
                            </div>
                        </div>
                    `
                })).join('')}
            </div>
        </div>
    `;
}

// Reports page
function renderReportsPage() {
    if (!auth.requireRole('admin')) return;
    
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="container space-y-6">
            <h1 style="font-size: 1.875rem; font-weight: bold;">System Reports</h1>
            
            ${components.createCard({
                title: 'Export Reports',
                description: 'Generate and download system reports',
                content: `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button class="btn btn-outline" onclick="exportUserReport()">
                            Export Users Report
                        </button>
                        <button class="btn btn-outline" onclick="exportLogEntries()">
                            Export Daily Logs
                        </button>
                        <button class="btn btn-outline" onclick="exportWeeklyReports()">
                            Export Weekly Reports
                        </button>
                        <button class="btn btn-outline" onclick="exportFullSystemReport()">
                            Export Full System Report
                        </button>
                    </div>
                `
            })}
        </div>
    `;
}

// System Settings page
function renderSystemSettingsPage() {
    if (!auth.requireRole('admin')) return;
    
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="container space-y-6">
            <h1 style="font-size: 1.875rem; font-weight: bold;">System Settings</h1>
            
            ${components.createCard({
                title: 'System Information',
                content: `
                    <form id="system-info-form">
                        ${components.createFormInput({
                            name: 'systemName',
                            label: 'System Name',
                            value: 'SIWES Electronic Workbook',
                            required: true
                        })}
                        
                        ${components.createFormInput({
                            name: 'academicYear',
                            label: 'Academic Year',
                            value: '2024/2025',
                            required: true
                        })}
                        
                        <button type="submit" class="btn btn-primary">Save Settings</button>
                    </form>
                `
            })}
            
            ${components.createCard({
                title: 'Data Management',
                content: `
                    <div class="space-y-4">
                        <div>
                            <h3 style="font-weight: 500;">Export Data</h3>
                            <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                                Download all system data as JSON
                            </p>
                            <button class="btn btn-outline" onclick="app.exportData()">Export All Data</button>
                        </div>
                        
                        <div>
                            <h3 style="font-weight: 500;">Reset Demo Data</h3>
                            <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                                Reset system to default demo data
                            </p>
                            <button class="btn btn-outline" onclick="resetDemoData()">Reset Demo Data</button>
                        </div>
                        
                        <div>
                            <h3 style="font-weight: 500; color: #dc2626;">Clear All Data</h3>
                            <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                                Permanently delete all system data
                            </p>
                            <button class="btn btn-outline" style="color: #dc2626; border-color: #dc2626;" onclick="clearAllSystemData()">Clear All Data</button>
                        </div>
                    </div>
                `
            })}
        </div>
    `;
    
    // Setup form handlers
    setupSystemSettingsHandlers();
}

// Export pages
window.pages = {
    renderHomePage,
    renderLoginPage,
    renderStudentLoginPage,
    renderInstitutionSupervisorLoginPage,
    renderIndustrialBasedSupervisorLoginPage,
    renderAdminLoginPage,
    renderDashboardPage,
    renderProfilePage,
    renderUserManagementPage,
    renderReportsPage,
    renderSystemSettingsPage
};
