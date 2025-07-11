# Urgent Medicine Reminder PWA

A Progressive Web App (PWA) built with React.js and Tailwind CSS to help users manage their medications, track intake, and never miss a dose.

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Secure token storage

### 📊 Dashboard
- Welcome message with user's name
- Today's medication summary
- Quick stats and progress tracking
- Upcoming medication reminders

### 💊 Medication Management
- Add, edit, and delete medications
- Set multiple daily reminder times
- Enable/disable reminders per medication
- Beautiful, animated medication cards

### 📝 Logs & History
- View all medication logs
- Filter by date, medication, or action
- Timeline view with grouped entries
- Sync logs with backend

### ⚙️ Settings
- Light/dark theme toggle
- Notification preferences
- Data export functionality
- Account management

### 📱 PWA Features
- Installable on mobile and desktop
- Offline functionality
- Push notifications for reminders
- Responsive design
- Custom app icons and splash screen

## Tech Stack

- **Frontend**: React.js (JavaScript, no TypeScript)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin with Workbox
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Routing**: React Router DOM

## Design System

### Colors
- **Primary Blue**: #2C7BE5 (CTAs, highlights)
- **Success Green**: #38C172 (taken medications)
- **Warning Orange**: #F6AD55 (warnings, missed)
- **Danger Red**: #E53E3E (errors, overdue)
- **Soft Background**: #F9FAFB
- **Light Gray**: #FFFFFF (cards)
- **Dark Gray**: #2D3748 (text)
- **Mid Gray**: #718096 (secondary text)

### Typography
- **Headings**: Montserrat (bold, semibold)
- **Body**: Inter (regular, medium)
- **Sizes**: 28-32px (titles), 20-24px (headings), 16px (body), 13-14px (labels)

### Spacing
- Scale: 4px, 8px, 16px, 24px, 32px, 48px
- Card radius: 16px
- Button radius: 12px

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd urgent-medicine-reminder-pwa
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   \`\`\`env
   VITE_API_BASE_URL=http://localhost:5000/api
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

6. **Preview production build**
   \`\`\`bash
   npm run preview
   \`\`\`

## API Integration

The app integrates with a backend API with the following endpoints:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Medications
- `GET /medications` - Get all medications
- `POST /medications` - Create/update medication
- `DELETE /medications/:id` - Delete medication

### Logs
- `GET /logs` - Get all logs
- `POST /logs/sync` - Sync logs from frontend

### Export
- `GET /export` - Export all data as JSON

All protected endpoints require JWT token in Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## PWA Features

### Service Worker
- Caches static assets for offline use
- Network-first strategy for API calls
- Background sync for logs

### Manifest
- App name, icons, and theme colors
- Standalone display mode
- Portrait orientation
- Installable on home screen

### Offline Support
- Cached static assets work offline
- Pending logs stored locally
- Sync when connection restored

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── FloatingLabelInput.jsx
│   ├── Toast.jsx
│   ├── Navigation.jsx
│   ├── Layout.jsx
│   ├── MedicationModal.jsx
│   ├── ConfirmModal.jsx
│   ├── ReminderModal.jsx
│   ├── QuickStats.jsx
│   └── TodaySchedule.jsx
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   ├── MedicationContext.jsx
│   └── LogContext.jsx
├── hooks/              # Custom hooks
│   └── useReminders.js
├── pages/              # Main pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Medications.jsx
│   ├── Logs.jsx
│   ├── Settings.jsx
│   └── NotFound.jsx
├── services/           # API services
│   └── api.js
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
\`\`\`

## Key Features Implementation

### Reminders System
- Frontend-only reminder system using `setInterval`
- Checks every minute for scheduled medications
- Shows modal with sound alert
- Supports snooze functionality

### Offline Sync
- Stores logs locally when offline
- Syncs with backend when online
- Visual indicators for pending sync

### Theme System
- React Context for theme state
- Tailwind dark mode classes
- Persistent theme preference

### Responsive Design
- Mobile-first approach
- Collapsible navigation
- Touch-friendly controls
- Optimized for all screen sizes

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
