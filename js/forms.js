// Form components for SIWES Electronic Workbook

// Daily Log Form
function showAddLogForm() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'student') return;
    
    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 32rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">Add Daily Log</h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                
                <form id="daily-log-form">
                    ${components.createFormInput({
                        type: 'date',
                        name: 'date',
                        label: 'Date',
                        value: utils.formatDate(new Date(), 'yyyy-MM-dd'),
                        required: true
                    })}
                    
                    ${components.createFormTextarea({
                        name: 'content',
                        label: 'Daily Activities',
                        placeholder: 'Describe what you did today, tasks completed, skills learned, etc.',
                        rows: 6,
                        required: true
                    })}
                    
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-outline" onclick="utils.hideModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Log</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    utils.showModal(formContent);
    
    // Handle form submission
    document.getElementById('daily-log-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const logEntry = {
            studentId: user.id,
            date: new Date(formData.get('date')),
            content: formData.get('content').trim()
        };
        
        if (!logEntry.content) {
            utils.showToast('Error', 'Please enter your daily activities', 'error');
            return;
        }
        
        const newLog = dataManager.addLogEntry(logEntry);
        utils.showToast('Success', 'Daily log added successfully', 'success');
        utils.hideModal();
        
        // Refresh dashboard
        router.handleRouteChange();
    });
}

// Edit Daily Log Form
function showEditLogForm(logId) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'student') return;
    
    const log = dataManager.getLogEntries().find(l => l.id === logId);
    if (!log || log.studentId !== user.id) {
        utils.showToast('Error', 'Log entry not found or access denied', 'error');
        return;
    }
    
    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 32rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">Edit Daily Log</h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                
                <form id="edit-log-form">
                    ${components.createFormInput({
                        type: 'date',
                        name: 'date',
                        label: 'Date',
                        value: utils.formatDate(log.date, 'yyyy-MM-dd'),
                        required: true
                    })}
                    
                    ${components.createFormTextarea({
                        name: 'content',
                        label: 'Daily Activities',
                        placeholder: 'Describe what you did today, tasks completed, skills learned, etc.',
                        value: log.content,
                        rows: 6,
                        required: true
                    })}
                    
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-outline" onclick="utils.hideModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Log</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    utils.showModal(formContent);
    
    document.getElementById('edit-log-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updates = {
            date: new Date(formData.get('date')),
            content: formData.get('content').trim()
        };
        
        if (!updates.content) {
            utils.showToast('Error', 'Please enter your daily activities', 'error');
            return;
        }
        
        const updatedLog = dataManager.updateLogEntry(logId, updates);
        if (updatedLog) {
            utils.showToast('Success', 'Daily log updated successfully', 'success');
            utils.hideModal();
            router.handleRouteChange();
        } else {
            utils.showToast('Error', 'Failed to update log entry', 'error');
        }
    });
}

// Quick Daily Log Form
function showQuickLogForm() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'student') return;
    
    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 28rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">Quick Daily Update</h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                
                <form id="quick-log-form">
                    ${components.createFormTextarea({
                        name: 'content',
                        label: 'What did you accomplish today?',
                        placeholder: 'Brief summary of today\'s activities...',
                        rows: 3,
                        required: true
                    })}
                    
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                        <button type="button" class="btn btn-outline" onclick="utils.hideModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Update</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    utils.showModal(formContent);
    
    document.getElementById('quick-log-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const logEntry = {
            studentId: user.id,
            date: new Date(),
            content: formData.get('content').trim(),
            type: 'quick'
        };
        
        if (!logEntry.content) {
            utils.showToast('Error', 'Please enter your activities', 'error');
            return;
        }
        
        const newLog = dataManager.addLogEntry(logEntry);
        utils.showToast('Success', 'Quick update saved successfully', 'success');
        utils.hideModal();
        router.handleRouteChange();
    });
}

// Weekly Summary Form
function showWeeklySummaryForm() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'student') return;
    
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 40rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">Weekly Summary Log</h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                
                <form id="weekly-summary-form">
                    ${components.createFormTextarea({
                        name: 'keyAccomplishments',
                        label: 'Key Accomplishments',
                        placeholder: 'What were your main achievements this week?',
                        rows: 3,
                        required: true
                    })}
                    
                    ${components.createFormTextarea({
                        name: 'skillsLearned',
                        label: 'Skills Learned',
                        placeholder: 'What new skills or knowledge did you acquire?',
                        rows: 3
                    })}
                    
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-outline" onclick="utils.hideModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Weekly Summary</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    utils.showModal(formContent);
    
    document.getElementById('weekly-summary-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const content = `# Weekly Summary

## Key Accomplishments
${formData.get('keyAccomplishments').trim()}

${formData.get('skillsLearned').trim() ? `## Skills Learned
${formData.get('skillsLearned').trim()}` : ''}`;
        
        const logEntry = {
            studentId: user.id,
            date: new Date(),
            content: content,
            type: 'weekly_summary'
        };
        
        if (!formData.get('keyAccomplishments').trim()) {
            utils.showToast('Error', 'Please enter your key accomplishments', 'error');
            return;
        }
        
        const newLog = dataManager.addLogEntry(logEntry);
        utils.showToast('Success', 'Weekly summary saved successfully', 'success');
        utils.hideModal();
        router.handleRouteChange();
    });
}

// Delete Log Entry
function deleteLogEntry(logId) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'student') return;
    
    const log = dataManager.getLogEntries().find(l => l.id === logId);
    if (!log || log.studentId !== user.id) {
        utils.showToast('Error', 'Log entry not found or access denied', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this log entry? This action cannot be undone.')) {
        const success = dataManager.deleteLogEntry(logId);
        if (success) {
            utils.showToast('Success', 'Log entry deleted successfully', 'success');
            router.handleRouteChange();
        } else {
            utils.showToast('Error', 'Failed to delete log entry', 'error');
        }
    }
}

// Weekly Report Form
function showAddReportForm() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'student') return;
    
    const existingReports = dataManager.getWeeklyReportsByStudent(user.id);
    const nextWeekNumber = existingReports.length > 0 ? 
        Math.max(...existingReports.map(r => r.weekNumber)) + 1 : 1;
    
    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 48rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">Add Weekly Report</h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                
                <form id="weekly-report-form">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="margin-bottom: 1rem;">
                        ${components.createFormInput({
                            type: 'number',
                            name: 'weekNumber',
                            label: 'Week Number',
                            value: nextWeekNumber.toString(),
                            required: true
                        })}
                        
                        ${components.createFormInput({
                            type: 'date',
                            name: 'startDate',
                            label: 'Start Date',
                            required: true
                        })}
                        
                        ${components.createFormInput({
                            type: 'date',
                            name: 'endDate',
                            label: 'End Date',
                            required: true
                        })}
                    </div>
                    
                    ${components.createFormTextarea({
                        name: 'content',
                        label: 'Weekly Report Content',
                        placeholder: `# Week ${nextWeekNumber} Report

## Activities
- List your main activities this week

## Skills Acquired
- What new skills did you learn?

## Challenges
- What challenges did you face?

## Goals for Next Week
- What do you plan to accomplish next week?`,
                        rows: 12,
                        required: true
                    })}
                    
                    ${components.createFormSelect({
                        name: 'status',
                        label: 'Status',
                        options: [
                            { value: 'draft', label: 'Save as Draft' },
                            { value: 'submitted', label: 'Submit for Review' }
                        ],
                        value: 'submitted',
                        required: true
                    })}
                    
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-outline" onclick="utils.hideModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Report</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    utils.showModal(formContent);
    
    // Handle form submission
    document.getElementById('weekly-report-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const report = {
            studentId: user.id,
            weekNumber: parseInt(formData.get('weekNumber')),
            startDate: new Date(formData.get('startDate')),
            endDate: new Date(formData.get('endDate')),
            content: formData.get('content').trim(),
            status: formData.get('status')
        };
        
        if (!report.content) {
            utils.showToast('Error', 'Please enter report content', 'error');
            return;
        }
        
        if (report.startDate >= report.endDate) {
            utils.showToast('Error', 'End date must be after start date', 'error');
            return;
        }
        
        const newReport = dataManager.addWeeklyReport(report);
        utils.showToast('Success', 
            report.status === 'submitted' ? 'Weekly report submitted successfully' : 'Weekly report saved as draft', 
            'success'
        );
        utils.hideModal();
        
        // Refresh dashboard
        router.handleRouteChange();
    });
}

// Academic Supervisor Feedback Form
function reviewReport(reportId) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'academic_supervisor') return;
    
    const report = dataManager.getWeeklyReports().find(r => r.id === reportId);
    if (!report) return;
    
    const student = dataManager.getUserById(report.studentId);
    
    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 48rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">
                        Review Report - Week ${report.weekNumber}
                    </h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <p style="color: #64748b; margin-bottom: 0.5rem;">
                        <strong>Student:</strong> ${student ? student.name : 'Unknown'}
                    </p>
                    <p style="color: #64748b; margin-bottom: 1rem;">
                        <strong>Period:</strong> ${utils.formatDate(report.startDate)} - ${utils.formatDate(report.endDate)}
                    </p>
                    
                    <div style="background-color: #f8fafc; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1rem; max-height: 20rem; overflow-y: auto;">
                        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Report Content:</h3>
                        <div>${utils.markdownToHtml(report.content)}</div>
                    </div>
                </div>
                
                <form id="feedback-form">
                    ${components.createFormTextarea({
                        name: 'feedback',
                        label: 'Supervisor Feedback',
                        placeholder: 'Provide constructive feedback on the student\'s progress, achievements, and areas for improvement...',
                        rows: 6,
                        required: true
                    })}
                    
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-outline" onclick="utils.hideModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit Feedback</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    utils.showModal(formContent);
    
    // Handle form submission
    document.getElementById('feedback-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const feedback = formData.get('feedback').trim();
        
        if (!feedback) {
            utils.showToast('Error', 'Please provide feedback', 'error');
            return;
        }
        
        const updatedReport = dataManager.updateWeeklyReport(reportId, {
            supervisorFeedback: feedback,
            status: 'reviewed'
        });
        
        if (updatedReport) {
            utils.showToast('Success', 'Feedback submitted successfully', 'success');
            utils.hideModal();
            
            // Refresh dashboard
            router.handleRouteChange();
        } else {
            utils.showToast('Error', 'Failed to submit feedback', 'error');
        }
    });
}

// Add User Form
function showAddUserForm() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') return;
    
    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 32rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">Add New User</h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                
                <form id="add-user-form">
                    ${components.createFormInput({
                        name: 'name',
                        label: 'Full Name',
                        placeholder: 'Enter full name',
                        required: true
                    })}
                    
                    ${components.createFormInput({
                        type: 'email',
                        name: 'email',
                        label: 'Email Address',
                        placeholder: 'Enter email address',
                        required: true
                    })}
                    
                    ${components.createFormSelect({
                        name: 'role',
                        label: 'Role',
                        options: [
                            { value: 'student', label: 'Student' },
                            { value: 'academic_supervisor', label: 'Academic Supervisor' },
                            { value: 'industrial_supervisor', label: 'Industrial Supervisor' },
                            { value: 'admin', label: 'Administrator' }
                        ],
                        value: 'student',
                        required: true
                    })}
                    
                    <!-- Student Fields -->
                    <div id="student-fields" style="display: block;">
                        ${components.createFormInput({
                            name: 'matricNumber',
                            label: 'Matric Number',
                            placeholder: 'Enter matric number',
                            required: true
                        })}
                        
                        ${components.createFormInput({
                            name: 'department',
                            label: 'Department',
                            placeholder: 'Enter department',
                            value: 'Computer Science'
                        })}
                        
                        ${components.createFormSelect({
                            name: 'level',
                            label: 'Level',
                            options: [
                                { value: '100', label: '100 Level' },
                                { value: '200', label: '200 Level' },
                                { value: '300', label: '300 Level' },
                                { value: '400', label: '400 Level' },
                                { value: '500', label: '500 Level' }
                            ],
                            value: '300'
                        })}
                    </div>
                    
                    <!-- Academic Supervisor Fields -->
                    <div id="academic-supervisor-fields" style="display: none;">
                        ${components.createFormInput({
                            name: 'academicDepartment',
                            label: 'Academic Department',
                            placeholder: 'Enter academic department',
                            required: true
                        })}
                        
                        ${components.createFormInput({
                            name: 'academicTitle',
                            label: 'Academic Title',
                            placeholder: 'Enter academic title (e.g., Professor, Dr.)',
                            required: true
                        })}
                        
                        ${components.createFormInput({
                            name: 'specialization',
                            label: 'Specialization',
                            placeholder: 'Enter area of specialization'
                        })}
                    </div>
                    
                    <!-- Industrial Supervisor Fields -->
                    <div id="industrial-supervisor-fields" style="display: none;">
                        ${components.createFormInput({
                            name: 'company',
                            label: 'Company',
                            placeholder: 'Enter company name',
                            required: true
                        })}
                        
                        ${components.createFormInput({
                            name: 'jobTitle',
                            label: 'Job Title',
                            placeholder: 'Enter job title',
                            required: true
                        })}
                        
                        ${components.createFormInput({
                            name: 'workDepartment',
                            label: 'Work Department',
                            placeholder: 'Enter work department'
                        })}
                    </div>
                    
                    <div style="margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Add User</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    utils.showModal(formContent);

    // Wait for DOM to be ready, then get form elements
    setTimeout(() => {
        const roleSelect = document.querySelector('select[name="role"]');
        const studentFields = document.getElementById('student-fields');
        const academicSupervisorFields = document.getElementById('academic-supervisor-fields');
        const industrialSupervisorFields = document.getElementById('industrial-supervisor-fields');

    // Function to show/hide fields based on role
    const updateFieldsVisibility = (role) => {
        if (studentFields) {
            studentFields.style.display = role === 'student' ? 'block' : 'none';
            // Disable/enable required validation for hidden fields
            const studentInputs = studentFields.querySelectorAll('input[required], select[required]');
            studentInputs.forEach(input => {
                input.disabled = role !== 'student';
            });
        }
        if (academicSupervisorFields) {
            academicSupervisorFields.style.display = role === 'academic_supervisor' ? 'block' : 'none';
            // Disable/enable required validation for hidden fields
            const academicInputs = academicSupervisorFields.querySelectorAll('input[required], select[required]');
            academicInputs.forEach(input => {
                input.disabled = role !== 'academic_supervisor';
            });
        }
        if (industrialSupervisorFields) {
            industrialSupervisorFields.style.display = role === 'industrial_supervisor' ? 'block' : 'none';
            // Disable/enable required validation for hidden fields
            const industrialInputs = industrialSupervisorFields.querySelectorAll('input[required], select[required]');
            industrialInputs.forEach(input => {
                input.disabled = role !== 'industrial_supervisor';
            });
        }
    };

    // Show initial fields based on default role (student)
    if (roleSelect) {
        updateFieldsVisibility(roleSelect.value);

        roleSelect.addEventListener('change', (e) => {
            updateFieldsVisibility(e.target.value);
        });
    }
    
    // Handle form submission
    document.getElementById('add-user-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name') ? formData.get('name').trim() : '',
            email: formData.get('email') ? formData.get('email').trim() : '',
            role: formData.get('role'),
            password: 'password123', // Default password
            profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.get('name') || 'User')}&background=2563eb&color=fff`
        };



        // Validation
        if (!userData.name || !userData.email) {
            utils.showToast('Error', 'Please fill in all required fields', 'error');
            return;
        }

        // Check if email already exists
        if (dataManager.getUserByEmail(userData.email)) {
            utils.showToast('Error', 'A user with this email already exists', 'error');
            return;
        }
        
        // Add role-specific data and validation
        if (userData.role === 'academic_supervisor') {
            const academicDepartment = formData.get('academicDepartment');
            const academicTitle = formData.get('academicTitle');
            const specialization = formData.get('specialization');



            if (!academicDepartment || !academicDepartment.trim() || !academicTitle || !academicTitle.trim()) {
                utils.showToast('Error', 'Please fill in all required fields for Academic Supervisor', 'error');
                return;
            }

            userData.academicDepartment = academicDepartment.trim();
            userData.academicTitle = academicTitle.trim();
            userData.specialization = specialization ? specialization.trim() : '';

        } else if (userData.role === 'industrial_supervisor') {
            const company = formData.get('company');
            const jobTitle = formData.get('jobTitle');
            const workDepartment = formData.get('workDepartment');



            if (!company || !company.trim() || !jobTitle || !jobTitle.trim()) {
                utils.showToast('Error', 'Please fill in all required fields for Industrial Supervisor', 'error');
                return;
            }

            userData.company = company.trim();
            userData.jobTitle = jobTitle.trim();
            userData.workDepartment = workDepartment ? workDepartment.trim() : '';
        }
        
        const newUser = dataManager.addUser(userData);

        // Variables for supervisor assignment tracking
        let academicSupervisorId = null;
        let industrialSupervisorId = null;

        // If student, create profile
        if (userData.role === 'student') {
            const matricNumber = formData.get('matricNumber');

            if (!matricNumber || !matricNumber.trim()) {
                utils.showToast('Error', 'Matric number is required for students', 'error');
                return;
            }

            // Check if matric number already exists
            const existingProfiles = dataManager.getStudentProfiles();
            if (existingProfiles.some(profile => profile.matricNumber === matricNumber.trim())) {
                utils.showToast('Error', 'A student with this matric number already exists', 'error');
                return;
            }

            // Get available supervisors
            const academicSupervisors = dataManager.getUsersByRole('academic_supervisor');
            const industrialSupervisors = dataManager.getUsersByRole('industrial_supervisor');

            // Assign supervisors using round-robin distribution for better load balancing
            if (academicSupervisors.length > 0) {
                const existingProfiles = dataManager.getStudentProfiles();
                const academicAssignmentCount = existingProfiles.filter(p => p.academicSupervisorId).length;
                const academicIndex = academicAssignmentCount % academicSupervisors.length;
                academicSupervisorId = academicSupervisors[academicIndex].id;
            }

            if (industrialSupervisors.length > 0) {
                const existingProfiles = dataManager.getStudentProfiles();
                const industrialAssignmentCount = existingProfiles.filter(p => p.industrialSupervisorId).length;
                const industrialIndex = industrialAssignmentCount % industrialSupervisors.length;
                industrialSupervisorId = industrialSupervisors[industrialIndex].id;
            }

            const profileData = {
                userId: newUser.id,
                matricNumber: matricNumber.trim(),
                department: formData.get('department') || 'Computer Science',
                level: formData.get('level') || '300',
                academicSupervisorId: academicSupervisorId,
                industrialSupervisorId: industrialSupervisorId,
                company: industrialSupervisorId ?
                    dataManager.getUserById(industrialSupervisorId).company || 'Company TBD' :
                    'No Company Assigned',
                startDate: new Date(),
                endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) // 4 months
            };
            dataManager.addStudentProfile(profileData);

            // Show supervisor assignment info
            if (academicSupervisorId || industrialSupervisorId) {
                const assignmentInfo = [];
                if (academicSupervisorId) {
                    const academicSupervisor = dataManager.getUserById(academicSupervisorId);
                    assignmentInfo.push(`Academic Supervisor: ${academicSupervisor.name}`);
                }
                if (industrialSupervisorId) {
                    const industrialSupervisor = dataManager.getUserById(industrialSupervisorId);
                    assignmentInfo.push(`Industrial Supervisor: ${industrialSupervisor.name}`);
                }
                utils.showToast('Student Created',
                    `Student created and assigned to: ${assignmentInfo.join(', ')}`,
                    'success'
                );
            }
        }

        // Show success message only if not already shown for student with supervisor assignment
        if (userData.role !== 'student' || (!academicSupervisorId && !industrialSupervisorId)) {
            utils.showToast('Success', 'User created successfully', 'success');
        }
        utils.hideModal();
        router.handleRouteChange(); // Refresh page
    });
    }, 100); // Close setTimeout
}

// Industrial Supervisor Comment Form
function addIndustrialSupervisorComment(reportId) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'industrial_supervisor') return;

    const report = dataManager.getWeeklyReports().find(r => r.id === reportId);
    if (!report) return;

    const student = dataManager.getUserById(report.studentId);

    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 32rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">Industrial Supervisor Comments</h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>

                <div style="background-color: #f8fafc; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                    <p style="font-weight: 500; margin-bottom: 0.5rem;">Student: ${utils.escapeHtml(student?.name || 'Unknown')}</p>
                    <p style="color: #64748b; font-size: 0.875rem;">Week ${report.weekNumber} Report (${utils.formatDate(report.startDate)} - ${utils.formatDate(report.endDate)})</p>
                </div>

                <form id="industrial-comment-form">
                    ${components.createFormTextarea({
                        name: 'industrialComment',
                        label: 'Weekly Check-in Comments',
                        placeholder: 'Provide comments on the student\'s workplace performance, attendance, practical skills development, and overall progress during this week...',
                        rows: 6,
                        required: true,
                        value: report.industrialSupervisorFeedback || ''
                    })}

                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-outline" onclick="utils.hideModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Comments</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    utils.showModal(formContent);

    // Handle form submission
    document.getElementById('industrial-comment-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const industrialComment = formData.get('industrialComment').trim();

        if (!industrialComment) {
            utils.showToast('Error', 'Please provide your comments', 'error');
            return;
        }

        const updatedReport = dataManager.updateWeeklyReport(reportId, {
            industrialSupervisorFeedback: industrialComment,
            industrialSupervisorId: user.id,
            industrialCommentDate: new Date()
        });

        if (updatedReport) {
            utils.showToast('Success', 'Industrial supervisor comments saved successfully', 'success');
            utils.hideModal();

            // Refresh dashboard
            router.handleRouteChange();
        } else {
            utils.showToast('Error', 'Failed to save comments', 'error');
        }
    });
}

// Export functions
function exportUserReport() {
    const users = dataManager.getUsers();
    const csvData = [
        ['Name', 'Email', 'Role', 'Created Date'],
        ...users.map(user => [
            user.name,
            user.email,
            user.role,
            utils.formatDate(new Date())
        ])
    ];
    
    downloadCSV(csvData, 'users-report');
}

function exportLogEntries() {
    const logs = dataManager.getLogEntries();
    const csvData = [
        ['Student', 'Date', 'Content', 'Created'],
        ...logs.map(log => {
            const student = dataManager.getUserById(log.studentId);
            return [
                student ? student.name : 'Unknown',
                utils.formatDate(log.date),
                log.content.substring(0, 100) + '...',
                utils.formatDate(log.createdAt)
            ];
        })
    ];
    
    downloadCSV(csvData, 'daily-logs-report');
}

function exportWeeklyReports() {
    const reports = dataManager.getWeeklyReports();
    const csvData = [
        ['Student', 'Week', 'Start Date', 'End Date', 'Status', 'Submitted'],
        ...reports.map(report => {
            const student = dataManager.getUserById(report.studentId);
            return [
                student ? student.name : 'Unknown',
                report.weekNumber,
                utils.formatDate(report.startDate),
                utils.formatDate(report.endDate),
                report.status,
                utils.formatDate(report.createdAt)
            ];
        })
    ];
    
    downloadCSV(csvData, 'weekly-reports');
}

function exportFullSystemReport() {
    app.exportData();
}

// Helper function to download CSV
function downloadCSV(data, filename) {
    const csv = data.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${utils.formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    utils.showToast('Export Complete', `${filename} exported successfully`, 'success');
}

// System settings handlers
function setupSystemSettingsHandlers() {
    // System info form
    const systemInfoForm = document.getElementById('system-info-form');
    if (systemInfoForm) {
        systemInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            utils.showToast('Success', 'System settings saved successfully', 'success');
        });
    }
    
    // User defaults form
    const userDefaultsForm = document.getElementById('user-defaults-form');
    if (userDefaultsForm) {
        userDefaultsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            utils.showToast('Success', 'User defaults saved successfully', 'success');
        });
    }
}

// Data management functions
function resetDemoData() {
    if (confirm('Are you sure you want to reset all data to demo defaults? This cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
}

function clearAllSystemData() {
    if (confirm('Are you sure you want to clear ALL system data? This cannot be undone.')) {
        app.clearAllData();
    }
}

// User management functions
function editUser(userId) {
    utils.showToast('Info', 'User editing functionality coming soon', 'info');
}

function deleteUser(userId) {
    const user = dataManager.getUserById(userId);
    if (!user) return;
    
    if (user.role === 'admin') {
        utils.showToast('Error', 'Cannot delete admin users', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
        if (dataManager.deleteUser(userId)) {
            utils.showToast('Success', 'User deleted successfully', 'success');
            router.handleRouteChange(); // Refresh page
        } else {
            utils.showToast('Error', 'Failed to delete user', 'error');
        }
    }
}

// Assign Supervisors Form
function showAssignSupervisorsForm(studentId) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') return;

    const student = dataManager.getUserById(studentId);
    const studentProfile = dataManager.getStudentProfile(studentId);

    if (!student || !studentProfile) {
        utils.showToast('Error', 'Student not found', 'error');
        return;
    }

    const academicSupervisors = dataManager.getUsersByRole('academic_supervisor');
    const industrialSupervisors = dataManager.getUsersByRole('industrial_supervisor');

    const formContent = `
        <div class="modal">
            <div style="padding: 1.5rem; max-width: 32rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600;">Assign Supervisors</h2>
                    <button type="button" onclick="utils.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>

                <div style="margin-bottom: 1rem; padding: 1rem; background-color: #f8fafc; border-radius: 0.375rem;">
                    <p style="font-weight: 500; margin-bottom: 0.5rem;">Student: ${utils.escapeHtml(student.name)}</p>
                    <p style="color: #64748b; font-size: 0.875rem;">Matric: ${utils.escapeHtml(studentProfile.matricNumber)}</p>
                </div>

                <form id="assign-supervisors-form">
                    ${components.createFormSelect({
                        name: 'academicSupervisorId',
                        label: 'Academic Supervisor',
                        options: [
                            { value: '', label: 'Select Academic Supervisor' },
                            ...academicSupervisors.map(supervisor => ({
                                value: supervisor.id,
                                label: `${supervisor.name} (${supervisor.academicDepartment})`
                            }))
                        ],
                        value: studentProfile.academicSupervisorId || '',
                        required: false
                    })}

                    ${components.createFormSelect({
                        name: 'industrialSupervisorId',
                        label: 'Industrial Supervisor',
                        options: [
                            { value: '', label: 'Select Industrial Supervisor' },
                            ...industrialSupervisors.map(supervisor => ({
                                value: supervisor.id,
                                label: `${supervisor.name} (${supervisor.company})`
                            }))
                        ],
                        value: studentProfile.industrialSupervisorId || '',
                        required: false
                    })}

                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-outline" onclick="utils.hideModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Assignments</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    utils.showModal(formContent);

    // Handle form submission
    document.getElementById('assign-supervisors-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const academicSupervisorId = formData.get('academicSupervisorId') || null;
        const industrialSupervisorId = formData.get('industrialSupervisorId') || null;

        // Update student profile
        const profiles = dataManager.getStudentProfiles();
        const profileIndex = profiles.findIndex(p => p.userId === studentId);

        if (profileIndex !== -1) {
            profiles[profileIndex].academicSupervisorId = academicSupervisorId;
            profiles[profileIndex].industrialSupervisorId = industrialSupervisorId;

            // Update company if industrial supervisor is assigned
            if (industrialSupervisorId) {
                const industrialSupervisor = dataManager.getUserById(industrialSupervisorId);
                profiles[profileIndex].company = industrialSupervisor?.company || 'Company TBD';
            } else {
                profiles[profileIndex].company = 'No Company Assigned';
            }

            utils.storage.set('studentProfiles', profiles);

            const assignmentInfo = [];
            if (academicSupervisorId) {
                const academicSupervisor = dataManager.getUserById(academicSupervisorId);
                assignmentInfo.push(`Academic: ${academicSupervisor.name}`);
            }
            if (industrialSupervisorId) {
                const industrialSupervisor = dataManager.getUserById(industrialSupervisorId);
                assignmentInfo.push(`Industrial: ${industrialSupervisor.name}`);
            }

            utils.showToast('Success',
                assignmentInfo.length > 0 ?
                    `Supervisors assigned: ${assignmentInfo.join(', ')}` :
                    'Supervisor assignments cleared',
                'success'
            );
            utils.hideModal();
            router.handleRouteChange();
        } else {
            utils.showToast('Error', 'Failed to update supervisor assignments', 'error');
        }
    });
}

// Export functions to global scope immediately after definition
window.showAddLogForm = showAddLogForm;
window.showEditLogForm = showEditLogForm;
window.showQuickLogForm = showQuickLogForm;
window.showWeeklySummaryForm = showWeeklySummaryForm;
window.deleteLogEntry = deleteLogEntry;
window.showAddReportForm = showAddReportForm;
window.reviewReport = reviewReport;
window.showAddUserForm = showAddUserForm;
window.exportUserReport = exportUserReport;
window.exportLogEntries = exportLogEntries;
window.exportWeeklyReports = exportWeeklyReports;
window.exportFullSystemReport = exportFullSystemReport;
window.setupSystemSettingsHandlers = setupSystemSettingsHandlers;
window.resetDemoData = resetDemoData;
window.clearAllSystemData = clearAllSystemData;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.addIndustrialSupervisorComment = addIndustrialSupervisorComment;
window.showAssignSupervisorsForm = showAssignSupervisorsForm;


