const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const { LogEntry, User } = require('../models');
const { auth, isStudent, isAdminOrSupervisor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/log-entries
// @desc    Get log entries (filtered by user role)
// @access  Private
router.get('/', [
  auth,
  query('studentId').optional().isString().withMessage('Student ID must be a string'),
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

    const { studentId, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};

    // Filter based on user role
    if (req.user.role === 'student') {
      whereClause.studentId = req.user.id;
    } else if (studentId) {
      whereClause.studentId = studentId;
    }

    const logEntries = await LogEntry.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'profileImage']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      logEntries: logEntries.rows,
      pagination: {
        total: logEntries.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(logEntries.count / limit)
      }
    });

  } catch (error) {
    console.error('Get log entries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/log-entries/student/:studentId
// @desc    Get log entries for a specific student
// @access  Private (Student can only access their own, supervisors can access their students)
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

    const logEntries = await LogEntry.findAll({
      where: { studentId },
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'profileImage']
      }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({ logEntries });

  } catch (error) {
    console.error('Get student log entries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/log-entries/:id
// @desc    Get single log entry
// @access  Private
router.get('/:id', [
  auth,
  param('id').notEmpty().withMessage('Log entry ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const logEntry = await LogEntry.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'profileImage']
      }]
    });

    if (!logEntry) {
      return res.status(404).json({ error: 'Log entry not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && req.user.id !== logEntry.studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ logEntry });

  } catch (error) {
    console.error('Get log entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/log-entries
// @desc    Create new log entry
// @access  Private (Students only)
router.post('/', [
  auth,
  isStudent,
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('content').trim().isLength({ min: 10, max: 5000 }).withMessage('Content must be 10-5000 characters'),
  body('attachments').optional().isArray().withMessage('Attachments must be an array'),
  body('type').optional().isIn(['regular', 'quick', 'weekly_summary']).withMessage('Invalid log type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { date, content, attachments = [], type = 'regular' } = req.body;

    const logEntry = await LogEntry.create({
      studentId: req.user.id,
      date: new Date(date),
      content,
      attachments,
      type
    });

    // Fetch the created entry with student info
    const createdEntry = await LogEntry.findByPk(logEntry.id, {
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'profileImage']
      }]
    });

    res.status(201).json({ 
      success: true,
      message: 'Log entry created successfully',
      logEntry: createdEntry 
    });

  } catch (error) {
    console.error('Create log entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/log-entries/:id
// @desc    Update log entry
// @access  Private (Students can only update their own)
router.put('/:id', [
  auth,
  param('id').notEmpty().withMessage('Log entry ID is required'),
  body('date').optional().isISO8601().withMessage('Please provide a valid date'),
  body('content').optional().trim().isLength({ min: 10, max: 5000 }).withMessage('Content must be 10-5000 characters'),
  body('attachments').optional().isArray().withMessage('Attachments must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const logEntry = await LogEntry.findByPk(req.params.id);
    if (!logEntry) {
      return res.status(404).json({ error: 'Log entry not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && req.user.id !== logEntry.studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { date, content, attachments } = req.body;
    const updateData = {};

    if (date) updateData.date = new Date(date);
    if (content) updateData.content = content;
    if (attachments !== undefined) updateData.attachments = attachments;

    await logEntry.update(updateData);

    // Fetch updated entry with student info
    const updatedEntry = await LogEntry.findByPk(logEntry.id, {
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'profileImage']
      }]
    });

    res.json({ 
      success: true,
      message: 'Log entry updated successfully',
      logEntry: updatedEntry 
    });

  } catch (error) {
    console.error('Update log entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/log-entries/:id
// @desc    Delete log entry
// @access  Private (Students can only delete their own)
router.delete('/:id', [
  auth,
  param('id').notEmpty().withMessage('Log entry ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const logEntry = await LogEntry.findByPk(req.params.id);
    if (!logEntry) {
      return res.status(404).json({ error: 'Log entry not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && req.user.id !== logEntry.studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await logEntry.destroy();

    res.json({ 
      success: true,
      message: 'Log entry deleted successfully' 
    });

  } catch (error) {
    console.error('Delete log entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
