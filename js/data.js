// Data management system for SIWES Electronic Workbook
// Updated to use API service instead of localStorage

// Initialize data with default values (for fallback only)
function initializeData() {
    const today = new Date();
    const subDays = (date, days) => new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    const addDays = (date, days) => new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));

    // Default users
    const defaultUsers = [
        {
            id: 'user-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'student123', // Demo password
            role: 'student',
            profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        {
            id: 'user-2',
            name: 'Dr. Jane Smith',
            email: 'jane.smith@example.com',
            password: 'institution123', // Demo password
            role: 'institution_supervisor',
            profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        {
            id: 'user-3',
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123', // Demo password
            role: 'admin',
            profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
        {
            id: 'user-4',
            name: 'Mr. Robert Johnson',
            email: 'robert.johnson@techsolutions.com',
            password: 'industrial123', // Demo password
            role: 'industrial_based_supervisor',
            profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
    ];

    // Default student profiles
    const defaultStudentProfiles = [
        {
            id: 'profile-1',
            userId: 'user-1',
            matricNumber: 'MAT12345',
            department: 'Computer Science',
            level: '300',
            company: 'Tech Solutions Ltd',
            institutionSupervisorId: 'user-2',
            industrialBasedSupervisorId: 'user-4',
            startDate: subDays(today, 30),
            endDate: addDays(today, 60),
        },
    ];

    // Default log entries
    const defaultLogEntries = [
        {
            id: 'log-1',
            studentId: 'user-1',
            date: subDays(today, 2),
            content: 'Attended orientation and was introduced to the company structure.',
            createdAt: subDays(today, 2),
            updatedAt: subDays(today, 2),
        },
        {
            id: 'log-2',
            studentId: 'user-1',
            date: subDays(today, 1),
            content: 'Participated in a team meeting and was assigned to a project.',
            attachments: ['meeting-notes.pdf'],
            createdAt: subDays(today, 1),
            updatedAt: subDays(today, 1),
        },
        {
            id: 'log-3',
            studentId: 'user-1',
            date: today,
            content: 'Started working on the frontend of the project using React.',
            createdAt: today,
            updatedAt: today,
        },
    ];

    // Default weekly reports
    const defaultWeeklyReports = [
        {
            id: 'report-1',
            studentId: 'user-1',
            weekNumber: 1,
            startDate: subDays(today, 7),
            endDate: today,
            content: `# Week 1 Report

## Activities
- Company orientation
- Team introduction
- Project assignment

## Skills Acquired
- Understanding of company workflow
- Basic project management tools

## Challenges
- Getting familiar with the codebase

## Goals for Next Week
- Start contributing to the project
- Complete assigned tasks`,
            status: 'reviewed',
            supervisorFeedback: 'Good start! Keep up the enthusiasm and don\'t hesitate to ask questions.',
            industrialSupervisorFeedback: 'Student showed excellent punctuality and eagerness to learn. Participated well in team meetings and asked relevant questions during orientation. Looking forward to seeing progress in the coming weeks.',
            industrialSupervisorId: 'user-4',
            industrialCommentDate: subDays(today, 4),
            createdAt: subDays(today, 6),
            updatedAt: subDays(today, 5),
        },
    ];

    // Default notifications
    const defaultNotifications = [
        {
            id: 'notif-1',
            userId: 'user-1',
            title: 'Weekly Report Due',
            message: 'Your weekly report for Week 2 is due in 2 days.',
            isRead: false,
            createdAt: subDays(today, 1),
        },
        {
            id: 'notif-2',
            userId: 'user-1',
            title: 'Supervisor Comment',
            message: 'Your supervisor has left a comment on your Week 1 report.',
            isRead: true,
            createdAt: subDays(today, 2),
        },
    ];

    // Initialize localStorage with default data if not exists
    if (!utils.storage.get('users')) {
        utils.storage.set('users', defaultUsers);
    }
    if (!utils.storage.get('studentProfiles')) {
        utils.storage.set('studentProfiles', defaultStudentProfiles);
    }
    if (!utils.storage.get('logEntries')) {
        utils.storage.set('logEntries', defaultLogEntries);
    }
    if (!utils.storage.get('weeklyReports')) {
        utils.storage.set('weeklyReports', defaultWeeklyReports);
    }
    if (!utils.storage.get('notifications')) {
        utils.storage.set('notifications', defaultNotifications);
    }
}

// Data access functions - Hybrid approach with API and localStorage fallback
const dataManager = {
    // Check if API is available
    isApiAvailable: async () => {
        try {
            const response = await fetch('http://localhost:3001/health');
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    // Users
    getUsers: () => {
        // For now, use localStorage until backend is fully integrated
        return utils.storage.get('users') || [];
    },

    getUserById: (id) => {
        const users = dataManager.getUsers();
        return users.find(user => user.id === id) || null;
    },

    getUserByEmail: (email) => {
        const users = dataManager.getUsers();
        return users.find(user => user.email === email) || null;
    },

    getUsersByRole: (role) => {
        const users = dataManager.getUsers();
        return users.filter(user => user.role === role);
    },
    
    addUser: (userData) => {
        const users = dataManager.getUsers();
        const newUser = {
            ...userData,
            id: utils.generateId(),
            createdAt: new Date()
        };
        users.push(newUser);
        utils.storage.set('users', users);
        utils.eventBus.emit('userAdded', newUser);
        return newUser;
    },

    deleteUser: (userId) => {
        const users = dataManager.getUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        if (filteredUsers.length < users.length) {
            utils.storage.set('users', filteredUsers);
            utils.eventBus.emit('userDeleted', userId);
            return true;
        }
        return false;
    },
    
    // Student Profiles
    getStudentProfiles: () => utils.storage.get('studentProfiles') || [],
    
    getStudentProfile: (userId) => {
        const profiles = dataManager.getStudentProfiles();
        return profiles.find(profile => profile.userId === userId) || null;
    },
    
    getStudentsBySupervisor: (supervisorId) => {
        const profiles = dataManager.getStudentProfiles();
        const users = dataManager.getUsers();

        return profiles
            .filter(profile =>
                profile.institutionSupervisorId === supervisorId ||
                profile.industrialBasedSupervisorId === supervisorId ||
                profile.supervisorId === supervisorId // Backward compatibility
            )
            .map(profile => {
                const student = users.find(user => user.id === profile.userId);
                return {
                    ...profile,
                    studentName: student?.name || 'Unknown Student',
                    studentEmail: student?.email || 'No email',
                    studentImage: student?.profileImage || ''
                };
            });
    },

    getStudentsByInstitutionSupervisor: (supervisorId) => {
        const profiles = dataManager.getStudentProfiles();
        const users = dataManager.getUsers();

        return profiles
            .filter(profile =>
                profile.institutionSupervisorId === supervisorId ||
                profile.supervisorId === supervisorId // Backward compatibility
            )
            .map(profile => {
                const student = users.find(user => user.id === profile.userId);
                return {
                    ...profile,
                    studentName: student?.name || 'Unknown Student',
                    studentEmail: student?.email || 'No email',
                    studentImage: student?.profileImage || ''
                };
            });
    },

    getStudentsByIndustrialSupervisor: (supervisorId) => {
        const profiles = dataManager.getStudentProfiles();
        const users = dataManager.getUsers();

        return profiles
            .filter(profile => profile.industrialSupervisorId === supervisorId)
            .map(profile => {
                const student = users.find(user => user.id === profile.userId);
                return {
                    ...profile,
                    studentName: student?.name || 'Unknown Student',
                    studentEmail: student?.email || 'No email',
                    studentImage: student?.profileImage || ''
                };
            });
    },

    addStudentProfile: (profileData) => {
        const profiles = dataManager.getStudentProfiles();
        const newProfile = {
            ...profileData,
            id: utils.generateId(),
            createdAt: new Date()
        };
        profiles.push(newProfile);
        utils.storage.set('studentProfiles', profiles);
        return newProfile;
    },
    
    // Log Entries
    getLogEntries: () => utils.storage.get('logEntries') || [],

    getLogEntriesByStudent: (studentId) => {
        const entries = dataManager.getLogEntries();
        return entries.filter(entry => entry.studentId === studentId)
                     .sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    addLogEntry: (entry) => {
        const entries = dataManager.getLogEntries();
        const newEntry = {
            ...entry,
            id: utils.generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        entries.push(newEntry);
        utils.storage.set('logEntries', entries);
        utils.eventBus.emit('logEntryAdded', newEntry);
        return newEntry;
    },

    updateLogEntry: (entryId, updates) => {
        const entries = dataManager.getLogEntries();
        const index = entries.findIndex(entry => entry.id === entryId);
        if (index !== -1) {
            entries[index] = {
                ...entries[index],
                ...updates,
                updatedAt: new Date(),
            };
            utils.storage.set('logEntries', entries);
            utils.eventBus.emit('logEntryUpdated', entries[index]);
            return entries[index];
        }
        return null;
    },

    deleteLogEntry: (entryId) => {
        const entries = dataManager.getLogEntries();
        const filteredEntries = entries.filter(entry => entry.id !== entryId);
        utils.storage.set('logEntries', filteredEntries);
        utils.eventBus.emit('logEntryDeleted', entryId);
        return true;
    },
    
    // Weekly Reports
    getWeeklyReports: () => utils.storage.get('weeklyReports') || [],
    
    getWeeklyReportsByStudent: (studentId) => {
        const reports = dataManager.getWeeklyReports();
        return reports.filter(report => report.studentId === studentId)
                     .sort((a, b) => b.weekNumber - a.weekNumber);
    },
    
    getPendingReports: (supervisorId) => {
        const reports = dataManager.getWeeklyReports();
        const students = dataManager.getStudentsBySupervisor(supervisorId);
        const studentIds = students.map(s => s.userId);

        return reports.filter(report =>
            studentIds.includes(report.studentId) &&
            report.status === 'submitted'
        );
    },

    getReportsForIndustrialSupervisor: (supervisorId) => {
        const reports = dataManager.getWeeklyReports();
        const students = dataManager.getStudentsByIndustrialSupervisor(supervisorId);
        const studentIds = students.map(s => s.userId);

        return reports.filter(report =>
            studentIds.includes(report.studentId) &&
            report.status === 'submitted'
        );
    },
    
    addWeeklyReport: (report) => {
        const reports = dataManager.getWeeklyReports();
        const newReport = {
            ...report,
            id: utils.generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        reports.push(newReport);
        utils.storage.set('weeklyReports', reports);
        utils.eventBus.emit('weeklyReportAdded', newReport);
        return newReport;
    },
    
    updateWeeklyReport: (reportId, updates) => {
        const reports = dataManager.getWeeklyReports();
        const index = reports.findIndex(report => report.id === reportId);
        if (index !== -1) {
            reports[index] = {
                ...reports[index],
                ...updates,
                updatedAt: new Date(),
            };
            utils.storage.set('weeklyReports', reports);
            utils.eventBus.emit('weeklyReportUpdated', reports[index]);
            return reports[index];
        }
        return null;
    },
    
    // Notifications
    getNotifications: () => utils.storage.get('notifications') || [],
    
    getNotificationsByUser: (userId) => {
        const notifications = dataManager.getNotifications();
        return notifications.filter(notif => notif.userId === userId)
                          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    
    getUnreadNotifications: (userId) => {
        const notifications = dataManager.getNotificationsByUser(userId);
        return notifications.filter(notif => !notif.isRead);
    },
    
    markNotificationAsRead: (notificationId) => {
        const notifications = dataManager.getNotifications();
        const index = notifications.findIndex(notif => notif.id === notificationId);
        if (index !== -1) {
            notifications[index].isRead = true;
            utils.storage.set('notifications', notifications);
            utils.eventBus.emit('notificationRead', notifications[index]);
            return notifications[index];
        }
        return null;
    },
    
    addNotification: (notification) => {
        const notifications = dataManager.getNotifications();
        const newNotification = {
            ...notification,
            id: utils.generateId(),
            isRead: false,
            createdAt: new Date(),
        };
        notifications.push(newNotification);
        utils.storage.set('notifications', notifications);
        utils.eventBus.emit('notificationAdded', newNotification);
        return newNotification;
    }
};

// Initialize data on load
initializeData();

// Export data manager
window.dataManager = dataManager;
