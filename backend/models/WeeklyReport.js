const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WeeklyReport = sequelize.define('WeeklyReport', {
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
    weekNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 52
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true,
        isAfterStartDate(value) {
          if (value <= this.startDate) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [50, 10000]
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'reviewed', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'draft'
    },
    supervisorFeedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    industrialSupervisorFeedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    industrialSupervisorId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    industrialCommentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    academicFeedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    academicCommentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    grade: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D', 'F'),
      allowNull: true
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
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'weekly_reports',
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'weekNumber']
      },
      {
        fields: ['studentId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['industrialSupervisorId']
      }
    ]
  });

  // Instance methods
  WeeklyReport.prototype.submit = function() {
    this.status = 'submitted';
    this.submittedAt = new Date();
  };

  WeeklyReport.prototype.addIndustrialFeedback = function(feedback, supervisorId) {
    this.industrialSupervisorFeedback = feedback;
    this.industrialSupervisorId = supervisorId;
    this.industrialCommentDate = new Date();
    this.status = 'reviewed';
    this.reviewedAt = new Date();
  };

  WeeklyReport.prototype.addAcademicFeedback = function(feedback, grade = null) {
    this.academicFeedback = feedback;
    this.academicCommentDate = new Date();
    if (grade) {
      this.grade = grade;
      this.status = 'approved';
    }
  };

  return WeeklyReport;
};
