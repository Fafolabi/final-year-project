const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LogEntry = sequelize.define('LogEntry', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
      }
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true,
        isNotFuture(value) {
          if (new Date(value) > new Date()) {
            throw new Error('Log entry date cannot be in the future');
          }
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 5000]
      }
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Attachments must be an array');
          }
        }
      }
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Tags must be an array');
          }
        }
      }
    },
    mood: {
      type: DataTypes.ENUM('excellent', 'good', 'neutral', 'challenging', 'difficult'),
      allowNull: true
    },
    hoursWorked: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 24
      }
    },
    type: {
      type: DataTypes.ENUM('regular', 'quick', 'weekly_summary'),
      allowNull: false,
      defaultValue: 'regular'
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'log_entries',
    indexes: [
      {
        fields: ['studentId']
      },
      {
        fields: ['date']
      },
      {
        fields: ['studentId', 'date']
      }
    ]
  });

  // Instance methods
  LogEntry.prototype.addAttachment = function(filename, originalName, size) {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push({
      filename,
      originalName,
      size,
      uploadedAt: new Date()
    });
  };

  LogEntry.prototype.removeAttachment = function(filename) {
    if (this.attachments) {
      this.attachments = this.attachments.filter(att => att.filename !== filename);
    }
  };

  return LogEntry;
};
