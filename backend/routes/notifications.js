const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const { Notification, User } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for current user
// @access  Private
router.get('/', [
  auth,
  query('isRead').optional().isBoolean().withMessage('isRead must be a boolean'),
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

    const { isRead, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = { userId: req.user.id };

    if (isRead !== undefined) {
      whereClause.isRead = isRead === 'true';
    }

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      notifications: notifications.rows,
      pagination: {
        total: notifications.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(notifications.count / limit)
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get count of unread notifications
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.count({
      where: { 
        userId: req.user.id, 
        isRead: false 
      }
    });

    res.json({ unreadCount: count });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get single notification
// @access  Private
router.get('/:id', [
  auth,
  param('id').notEmpty().withMessage('Notification ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user owns this notification
    if (notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ notification });

  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/notifications
// @desc    Create new notification
// @access  Private (Admin only for system notifications)
router.post('/', [
  auth,
  isAdmin,
  body('userId').optional().isString().withMessage('User ID must be a string'),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters'),
  body('type').optional().isIn(['info', 'success', 'warning', 'error']).withMessage('Invalid notification type'),
  body('actionUrl').optional().isURL().withMessage('Action URL must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { userId, title, message, type = 'info', actionUrl } = req.body;

    // If userId is provided, create for specific user, otherwise create for all users
    if (userId) {
      // Verify user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        actionUrl
      });

      res.status(201).json({ 
        success: true,
        message: 'Notification created successfully',
        notification 
      });
    } else {
      // Create notification for all users
      const users = await User.findAll({ where: { isActive: true } });
      const notifications = [];

      for (const user of users) {
        const notification = await Notification.create({
          userId: user.id,
          title,
          message,
          type,
          actionUrl
        });
        notifications.push(notification);
      }

      res.status(201).json({ 
        success: true,
        message: `Notification sent to ${notifications.length} users`,
        count: notifications.length
      });
    }

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', [
  auth,
  param('id').notEmpty().withMessage('Notification ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user owns this notification
    if (notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await notification.update({ 
      isRead: true,
      readAt: new Date()
    });

    res.json({ 
      success: true,
      message: 'Notification marked as read',
      notification 
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read for current user
// @access  Private
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const [updatedCount] = await Notification.update(
      { 
        isRead: true,
        readAt: new Date()
      },
      { 
        where: { 
          userId: req.user.id, 
          isRead: false 
        } 
      }
    );

    res.json({ 
      success: true,
      message: `${updatedCount} notifications marked as read`
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', [
  auth,
  param('id').notEmpty().withMessage('Notification ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user owns this notification or is admin
    if (notification.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await notification.destroy();

    res.json({ 
      success: true,
      message: 'Notification deleted successfully' 
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
