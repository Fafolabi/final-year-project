const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { User, StudentProfile } = require('../models');
const { auth, isAdmin, isAdminOrSupervisor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      include: [{
        model: StudentProfile,
        as: 'studentProfile',
        required: false
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: users.rows,
      pagination: {
        total: users.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(users.count / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/by-role/:role
// @desc    Get users by role
// @access  Private (Admin or Supervisor)
router.get('/by-role/:role', [
  auth,
  isAdminOrSupervisor,
  param('role').isIn(['student', 'academic_supervisor', 'industrial_supervisor', 'admin'])
    .withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const users = await User.findAll({
      where: { role: req.params.role, isActive: true },
      include: [{
        model: StudentProfile,
        as: 'studentProfile',
        required: false
      }],
      order: [['name', 'ASC']]
    });

    res.json({ users });

  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', [
  auth,
  param('id').notEmpty().withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = await User.findByPk(req.params.id, {
      include: [{
        model: StudentProfile,
        as: 'studentProfile',
        required: false
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user can access this profile
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Admin)
router.post('/', [
  auth,
  isAdmin,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').isIn(['student', 'academic_supervisor', 'industrial_supervisor', 'admin'])
    .withMessage('Invalid role'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('profileImage').optional().isURL().withMessage('Profile image must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, email, role, password, profileImage, ...roleSpecificData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    const userData = {
      name,
      email,
      role,
      password: password || 'password123', // Default password
      profileImage: profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`
    };

    const user = await User.create(userData);

    // If student, create student profile
    if (role === 'student') {
      const { matricNumber, department = 'Computer Science', level = '300' } = roleSpecificData;
      
      if (!matricNumber) {
        return res.status(400).json({ error: 'Matric number is required for students' });
      }

      // Check if matric number already exists
      const existingProfile = await StudentProfile.findOne({ where: { matricNumber } });
      if (existingProfile) {
        return res.status(400).json({ error: 'Student with this matric number already exists' });
      }

      // Get available supervisors for assignment
      const academicSupervisors = await User.findAll({ where: { role: 'academic_supervisor', isActive: true } });
      const industrialSupervisors = await User.findAll({ where: { role: 'industrial_supervisor', isActive: true } });

      // Simple round-robin assignment
      const existingProfiles = await StudentProfile.findAll();
      
      let academicSupervisorId = null;
      let industrialSupervisorId = null;

      if (academicSupervisors.length > 0) {
        const academicIndex = existingProfiles.filter(p => p.academicSupervisorId).length % academicSupervisors.length;
        academicSupervisorId = academicSupervisors[academicIndex].id;
      }

      if (industrialSupervisors.length > 0) {
        const industrialIndex = existingProfiles.filter(p => p.industrialSupervisorId).length % industrialSupervisors.length;
        industrialSupervisorId = industrialSupervisors[industrialIndex].id;
      }

      const profileData = {
        userId: user.id,
        matricNumber,
        department,
        level,
        academicSupervisorId,
        industrialSupervisorId,
        company: industrialSupervisorId ? 'Company TBD' : 'No Company Assigned',
        startDate: new Date(),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) // 4 months
      };

      await StudentProfile.create(profileData);
    }

    // Fetch user with profile for response
    const createdUser = await User.findByPk(user.id, {
      include: [{
        model: StudentProfile,
        as: 'studentProfile',
        required: false
      }]
    });

    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      user: createdUser 
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', [
  auth,
  param('id').notEmpty().withMessage('User ID is required'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('profileImage').optional().isURL().withMessage('Profile image must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, email, profileImage } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        where: { email, id: { [require('sequelize').Op.ne]: user.id } } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
      updateData.email = email;
    }
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    await user.update(updateData);

    const updatedUser = await User.findByPk(user.id, {
      include: [{
        model: StudentProfile,
        as: 'studentProfile',
        required: false
      }]
    });

    res.json({ 
      success: true, 
      message: 'User updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/:id', [
  auth,
  isAdmin,
  param('id').notEmpty().withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deletion of admin users
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }

    await user.destroy();

    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
