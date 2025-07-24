const { sequelize, User, StudentProfile, LogEntry, WeeklyReport, Notification } = require('../models');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');

    const today = new Date();
    const subDays = (date, days) => new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    const addDays = (date, days) => new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));

    // Create users
    console.log('Creating users...');
    const users = await User.bulkCreate([
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'student123',
        role: 'student',
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        id: 'user-2',
        name: 'Dr. Jane Smith',
        email: 'jane.smith@example.com',
        password: 'academic123',
        role: 'academic_supervisor',
        profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        id: 'user-3',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      {
        id: 'user-4',
        name: 'Mr. Robert Johnson',
        email: 'robert.johnson@techsolutions.com',
        password: 'industrial123',
        role: 'industrial_supervisor',
        profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
    ], { individualHooks: true }); // Enable hooks for password hashing

    console.log(`Created ${users.length} users.`);

    // Create student profile
    console.log('Creating student profiles...');
    const studentProfiles = await StudentProfile.bulkCreate([
      {
        id: 'profile-1',
        userId: 'user-1',
        matricNumber: 'MAT12345',
        department: 'Computer Science',
        level: '300',
        company: 'Tech Solutions Ltd',
        academicSupervisorId: 'user-2',
        industrialSupervisorId: 'user-4',
        startDate: subDays(today, 30),
        endDate: addDays(today, 60),
      },
    ]);

    console.log(`Created ${studentProfiles.length} student profiles.`);

    // Create log entries
    console.log('Creating log entries...');
    const logEntries = await LogEntry.bulkCreate([
      {
        id: 'log-1',
        studentId: 'user-1',
        date: subDays(today, 2),
        content: 'Attended orientation and was introduced to the company structure.',
        type: 'regular'
      },
      {
        id: 'log-2',
        studentId: 'user-1',
        date: subDays(today, 1),
        content: 'Participated in a team meeting and was assigned to a project.',
        attachments: ['meeting-notes.pdf'],
        type: 'regular'
      },
      {
        id: 'log-3',
        studentId: 'user-1',
        date: today,
        content: 'Started working on the frontend of the project using React.',
        type: 'regular'
      },
    ]);

    console.log(`Created ${logEntries.length} log entries.`);

    // Create weekly reports
    console.log('Creating weekly reports...');
    const weeklyReports = await WeeklyReport.bulkCreate([
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
        reviewedAt: subDays(today, 5)
      },
    ]);

    console.log(`Created ${weeklyReports.length} weekly reports.`);

    // Create notifications
    console.log('Creating notifications...');
    const notifications = await Notification.bulkCreate([
      {
        id: 'notif-1',
        userId: 'user-1',
        title: 'Weekly Report Due',
        message: 'Your weekly report for Week 2 is due in 2 days.',
        type: 'warning',
        isRead: false
      },
      {
        id: 'notif-2',
        userId: 'user-1',
        title: 'Supervisor Comment',
        message: 'Your supervisor has left a comment on your Week 1 report.',
        type: 'info',
        isRead: true,
        readAt: subDays(today, 1)
      },
    ]);

    console.log(`Created ${notifications.length} notifications.`);

    console.log('Database seeding completed successfully!');
    console.log('\nDemo Login Credentials:');
    console.log('Student: john.doe@example.com / student123');
    console.log('Academic Supervisor: jane.smith@example.com / academic123');
    console.log('Industrial Supervisor: robert.johnson@techsolutions.com / industrial123');
    console.log('Admin: admin@example.com / admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
