# SIWES Electronic Workbook

A comprehensive platform for documenting and tracking your industrial training experience. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance.

## Features

- **Daily Logs**: Keep track of your daily activities and tasks with easy-to-use log entries and attachments.
- **Weekly Reports**: Submit comprehensive weekly reports to document your progress and learning experiences.
- **Supervisor Feedback**: Receive timely feedback and guidance from your supervisors to enhance your learning.
- **Role-based Access**: Different interfaces for students, supervisors, and administrators.
- **Real-time Notifications**: Stay updated with important announcements and feedback.
- **Local Storage**: All data is stored locally in your browser for privacy and offline access.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required
- No build process or dependencies needed

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start using the application immediately

### Demo Login

The application includes demo data for testing purposes. You can login as:

- **Student**: Access daily logs, weekly reports, and view supervisor feedback
- **Supervisor**: Review student reports and provide feedback
- **Admin**: Manage users and view system statistics

## Usage

### For Students

1. Login using the "Login as Student" option
2. Navigate to the Dashboard to view your overview
3. Use the "Daily Logs" tab to add daily activity entries
4. Use the "Weekly Reports" tab to submit weekly progress reports
5. Check your profile for placement information

### For Supervisors

1. Login using the "Login as Supervisor" option
2. View pending reports that need review
3. Provide feedback on student submissions
4. Monitor supervised students' progress

### For Administrators

1. Login using the "Login as Admin" option
2. View system statistics and user management
3. Access system reports and settings

## Technologies Used

This project is built with:

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox and grid layouts
- **Vanilla JavaScript**: No frameworks or libraries required
- **Local Storage**: Browser-based data persistence
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── js/
│   ├── app.js          # Main application initialization
│   ├── auth.js         # Authentication system
│   ├── components.js   # Reusable UI components
│   ├── data.js         # Data management and storage
│   ├── forms.js        # Form handling and validation
│   ├── pages.js        # Page rendering functions
│   ├── router.js       # Client-side routing
│   └── utils.js        # Utility functions
└── public/
    ├── favicon.ico     # Site icon
    └── robots.txt      # Search engine instructions
```

## Development

### Debugging

The application includes debugging utilities accessible via the browser console:

```javascript
// Get current application state
debug.getAppState()

// Navigate to different pages
debug.navigate('/dashboard')

// Login as different roles
debug.login('student')
debug.login('supervisor')
debug.login('admin')

// Show toast notifications
debug.showToast('Title', 'Message', 'success')

// Export data
debug.exportData()

// Clear all data (use with caution)
debug.clearAllData()
```

### Data Management

All data is stored in the browser's localStorage. The application automatically initializes with demo data on first run. Data persists between sessions unless manually cleared.

### Customization

The application is designed to be easily customizable:

- Modify `styles.css` to change the appearance
- Update `js/data.js` to change default data or add new fields
- Extend `js/components.js` to add new UI components
- Add new pages by extending `js/pages.js` and `js/router.js`

## Browser Compatibility

This application works in all modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the MIT License.
