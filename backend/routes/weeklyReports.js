const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const { WeeklyReport, User, StudentProfile } = require('../models');
const { auth, isStudent, isAcademicSupervisor, isIndustrialSupervisor, isAdminOrSupervisor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/weekly-reports
// @desc    Get weekly reports (filtered by user role)
// @access  Private
router.get('/', [
  auth,
  query('studentId').optional().isString().withMessage('Student ID must be a string'),
  query('status').optional().isIn(['draft', 'submitted', 'reviewed']).withMessage('Invalid status'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { studentId, status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};

    // Filter based on user role
    if (req.user.role === 'student') {
      whereClause.studentId = req.user.id;
    } else if (studentId) {
      whereClause.studentId = studentId;
    }

    if (status) {
      whereClause.status = status;
    }

    const reports = await WeeklyReport.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'profileImage']
        },
        {
          model: User,
          as: 'industrialSupervisor',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['weekNumber', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      reports: reports.rows,
      pagination: {
        total: reports.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(reports.count / limit)
      }
    });

  } catch (error) {
    console.error('Get weekly reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/weekly-reports/student/:studentId
// @desc    Get weekly reports for a specific student
// @access  Private
router.get('/student/:studentId', [
  auth,
  param('studentId').notEmpty().withMessage('Student ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { studentId } = req.params;

    // Check permissions
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const reports = await WeeklyReport.findAll({
      where: { studentId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'profileImage']
        },
        {
          model: User,
          as: 'industrialSupervisor',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ],
      order: [['weekNumber', 'DESC']]
    });

    res.json({ reports });

  } catch (error) {
    console.error('Get student weekly reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/weekly-reports/pending
// @desc    Get pending reports for supervisor review
// @access  Private (Supervisors only)
router.get('/pending', [auth, isAdminOrSupervisor], async (req, res) => {
  try {
    let whereClause = { status: 'submitted' };
    let studentIds = [];

    // Get students supervised by this user
    if (req.user.role === 'academic_supervisor' || req.user.role === 'industrial_supervisor') {
      const supervisorField = req.user.role === 'academic_supervisor' ? 'academicSupervisorId' : 'industrialSupervisorId';
      
      const studentProfiles = await StudentProfile.findAll({
        where: { [supervisorField]: req.user.id }
      });
      
      studentIds = studentProfiles.map(profile => profile.userId);
      
      if (studentIds.length === 0) {
        return res.json({ reports: [] });
      }
      
      whereClause.studentId = studentIds;
    }

    const reports = await WeeklyReport.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'profileImage'],
          include: [{
            model: StudentProfile,
            as: 'studentProfile',
            attributes: ['matricNumber', 'department', 'level', 'company']
          }]
        },
        {
          model: User,
          as: 'industrialSupervisor',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({ reports });

  } catch (error) {
    console.error('Get pending reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/weekly-reports/:id
// @desc    Get single weekly report
// @access  Private
router.get('/:id', [
  auth,
  param('id').notEmpty().withMessage('Report ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const report = await WeeklyReport.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'profileImage'],
          include: [{
            model: StudentProfile,
            as: 'studentProfile',
            attributes: ['matricNumber', 'department', 'level', 'company']
          }]
        },
        {
          model: User,
          as: 'industrialSupervisor',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ error: 'Weekly report not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && req.user.id !== report.studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ report });

  } catch (error) {
    console.error('Get weekly report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/weekly-reports
// @desc    Create new weekly report
// @access  Private (Students only)
router.post('/', [
  auth,
  isStudent,
  body('weekNumber').isInt({ min: 1, max: 52 }).withMessage('Week number must be between 1 and 52'),
  body('startDate').isISO8601().withMessage('Please provide a valid start date'),
  body('endDate').isISO8601().withMessage('Please provide a valid end date'),
  body('content').trim().isLength({ min: 50, max: 10000 }).withMessage('Content must be 50-10000 characters'),
  body('status').optional().isIn(['draft', 'submitted']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { weekNumber, startDate, endDate, content, status = 'draft' } = req.body;

    // Check if report for this week already exists
    const existingReport = await WeeklyReport.findOne({
      where: { 
        studentId: req.user.id, 
        weekNumber 
      }
    });

    if (existingReport) {
      return res.status(400).json({ error: 'Report for this week already exists' });
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const report = await WeeklyReport.create({
      studentId: req.user.id,
      weekNumber,
      startDate: start,
      endDate: end,
      content,
      status
    });

    // Fetch the created report with student info
    const createdReport = await WeeklyReport.findByPk(report.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ]
    });

    res.status(201).json({ 
      success: true,
      message: 'Weekly report created successfully',
      report: createdReport 
    });

  } catch (error) {
    console.error('Create weekly report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/weekly-reports/:id
// @desc    Update weekly report
// @access  Private (Students can only update their own)
router.put('/:id', [
  auth,
  param('id').notEmpty().withMessage('Report ID is required'),
  body('weekNumber').optional().isInt({ min: 1, max: 52 }).withMessage('Week number must be between 1 and 52'),
  body('startDate').optional().isISO8601().withMessage('Please provide a valid start date'),
  body('endDate').optional().isISO8601().withMessage('Please provide a valid end date'),
  body('content').optional().trim().isLength({ min: 50, max: 10000 }).withMessage('Content must be 50-10000 characters'),
  body('status').optional().isIn(['draft', 'submitted']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const report = await WeeklyReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Weekly report not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && req.user.id !== report.studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Don't allow editing reviewed reports
    if (report.status === 'reviewed') {
      return res.status(400).json({ error: 'Cannot edit reviewed reports' });
    }

    const { weekNumber, startDate, endDate, content, status } = req.body;
    const updateData = {};

    if (weekNumber && weekNumber !== report.weekNumber) {
      // Check if another report exists for this week
      const existingReport = await WeeklyReport.findOne({
        where: {
          studentId: req.user.id,
          weekNumber,
          id: { [require('sequelize').Op.ne]: report.id }
        }
      });
      if (existingReport) {
        return res.status(400).json({ error: 'Report for this week already exists' });
      }
      updateData.weekNumber = weekNumber;
    }

    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (content) updateData.content = content;
    if (status) updateData.status = status;

    // Validate date range if both dates are provided
    const finalStartDate = updateData.startDate || report.startDate;
    const finalEndDate = updateData.endDate || report.endDate;
    if (finalStartDate >= finalEndDate) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    await report.update(updateData);

    // Fetch updated report with student info
    const updatedReport = await WeeklyReport.findByPk(report.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Weekly report updated successfully',
      report: updatedReport
    });

  } catch (error) {
    console.error('Update weekly report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/weekly-reports/:id/review
// @desc    Review weekly report (Academic Supervisor)
// @access  Private (Academic Supervisors only)
router.put('/:id/review', [
  auth,
  isAcademicSupervisor,
  param('id').notEmpty().withMessage('Report ID is required'),
  body('supervisorFeedback').trim().isLength({ min: 10, max: 2000 }).withMessage('Feedback must be 10-2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const report = await WeeklyReport.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'student',
        include: [{
          model: StudentProfile,
          as: 'studentProfile'
        }]
      }]
    });

    if (!report) {
      return res.status(404).json({ error: 'Weekly report not found' });
    }

    // Check if this supervisor is assigned to this student
    if (report.student.studentProfile.academicSupervisorId !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned as supervisor for this student' });
    }

    const { supervisorFeedback } = req.body;

    await report.update({
      status: 'reviewed',
      supervisorFeedback,
      reviewedAt: new Date()
    });

    // Fetch updated report
    const updatedReport = await WeeklyReport.findByPk(report.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Report reviewed successfully',
      report: updatedReport
    });

  } catch (error) {
    console.error('Review weekly report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/weekly-reports/:id/industrial-comment
// @desc    Add industrial supervisor comment
// @access  Private (Industrial Supervisors only)
router.put('/:id/industrial-comment', [
  auth,
  isIndustrialSupervisor,
  param('id').notEmpty().withMessage('Report ID is required'),
  body('industrialSupervisorFeedback').trim().isLength({ min: 10, max: 2000 }).withMessage('Feedback must be 10-2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const report = await WeeklyReport.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'student',
        include: [{
          model: StudentProfile,
          as: 'studentProfile'
        }]
      }]
    });

    if (!report) {
      return res.status(404).json({ error: 'Weekly report not found' });
    }

    // Check if this supervisor is assigned to this student
    if (report.student.studentProfile.industrialSupervisorId !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned as industrial supervisor for this student' });
    }

    const { industrialSupervisorFeedback } = req.body;

    await report.update({
      industrialSupervisorFeedback,
      industrialSupervisorId: req.user.id,
      industrialCommentDate: new Date()
    });

    // Fetch updated report
    const updatedReport = await WeeklyReport.findByPk(report.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'profileImage']
        },
        {
          model: User,
          as: 'industrialSupervisor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Industrial supervisor comment added successfully',
      report: updatedReport
    });

  } catch (error) {
    console.error('Add industrial comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/weekly-reports/:id
// @desc    Delete weekly report
// @access  Private (Students can only delete their own draft reports)
router.delete('/:id', [
  auth,
  param('id').notEmpty().withMessage('Report ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const report = await WeeklyReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Weekly report not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && req.user.id !== report.studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow deletion of draft reports
    if (report.status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete draft reports' });
    }

    await report.destroy();

    res.json({
      success: true,
      message: 'Weekly report deleted successfully'
    });

  } catch (error) {
    console.error('Delete weekly report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
