const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || path.join(__dirname, '../database/siwes.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

// Import models
const User = require('./User')(sequelize);
const StudentProfile = require('./StudentProfile')(sequelize);
const LogEntry = require('./LogEntry')(sequelize);
const WeeklyReport = require('./WeeklyReport')(sequelize);
const Notification = require('./Notification')(sequelize);

// Define associations
User.hasOne(StudentProfile, { 
  foreignKey: 'userId', 
  as: 'studentProfile',
  onDelete: 'CASCADE'
});
StudentProfile.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

// Academic Supervisor relationship
User.hasMany(StudentProfile, { 
  foreignKey: 'academicSupervisorId', 
  as: 'supervisedStudents',
  onDelete: 'SET NULL'
});
StudentProfile.belongsTo(User, { 
  foreignKey: 'academicSupervisorId', 
  as: 'academicSupervisor' 
});

// Industrial Supervisor relationship
User.hasMany(StudentProfile, { 
  foreignKey: 'industrialSupervisorId', 
  as: 'industrialStudents',
  onDelete: 'SET NULL'
});
StudentProfile.belongsTo(User, { 
  foreignKey: 'industrialSupervisorId', 
  as: 'industrialSupervisor' 
});

// Log Entries
User.hasMany(LogEntry, { 
  foreignKey: 'studentId', 
  as: 'logEntries',
  onDelete: 'CASCADE'
});
LogEntry.belongsTo(User, { 
  foreignKey: 'studentId', 
  as: 'student' 
});

// Weekly Reports
User.hasMany(WeeklyReport, { 
  foreignKey: 'studentId', 
  as: 'weeklyReports',
  onDelete: 'CASCADE'
});
WeeklyReport.belongsTo(User, { 
  foreignKey: 'studentId', 
  as: 'student' 
});

// Industrial Supervisor for Weekly Reports
User.hasMany(WeeklyReport, { 
  foreignKey: 'industrialSupervisorId', 
  as: 'reviewedReports',
  onDelete: 'SET NULL'
});
WeeklyReport.belongsTo(User, { 
  foreignKey: 'industrialSupervisorId', 
  as: 'industrialSupervisor' 
});

// Notifications
User.hasMany(Notification, { 
  foreignKey: 'userId', 
  as: 'notifications',
  onDelete: 'CASCADE'
});
Notification.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

module.exports = {
  sequelize,
  User,
  StudentProfile,
  LogEntry,
  WeeklyReport,
  Notification
};
