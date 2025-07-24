const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
      }
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200]
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000]
      }
    },
    type: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'reminder'),
      allowNull: false,
      defaultValue: 'info'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    relatedEntityType: {
      type: DataTypes.ENUM('log_entry', 'weekly_report', 'user', 'system'),
      allowNull: true
    },
    relatedEntityId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          args: true,
          msg: 'Action URL must be a valid URL'
        }
      }
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'notifications',
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['isRead']
      },
      {
        fields: ['type']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['userId', 'isRead']
      }
    ]
  });

  // Instance methods
  Notification.prototype.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
  };

  Notification.prototype.isExpired = function() {
    return this.expiresAt && new Date() > this.expiresAt;
  };

  // Static methods
  Notification.createForUser = async function(userId, title, message, options = {}) {
    return await this.create({
      userId,
      title,
      message,
      type: options.type || 'info',
      priority: options.priority || 'medium',
      relatedEntityType: options.relatedEntityType,
      relatedEntityId: options.relatedEntityId,
      actionUrl: options.actionUrl,
      expiresAt: options.expiresAt
    });
  };

  Notification.createWeeklyReportReminder = async function(userId, weekNumber) {
    return await this.createForUser(
      userId,
      'Weekly Report Due',
      `Your weekly report for Week ${weekNumber} is due soon. Please submit it before the deadline.`,
      {
        type: 'reminder',
        priority: 'high',
        relatedEntityType: 'weekly_report'
      }
    );
  };

  Notification.createSupervisorFeedback = async function(userId, reportId, supervisorName) {
    return await this.createForUser(
      userId,
      'Supervisor Feedback',
      `${supervisorName} has provided feedback on your weekly report.`,
      {
        type: 'info',
        priority: 'medium',
        relatedEntityType: 'weekly_report',
        relatedEntityId: reportId
      }
    );
  };

  return Notification;
};
