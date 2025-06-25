# Convivio

Convivio is a workplace social platform that empowers coworkers to create, discover, and participate in social events within their organization. Build stronger team connections and foster a vibrant workplace culture through shared experiences and activities.

## Features

- **Event Management**: Create, edit, and manage workplace social events
- **Event Discovery**: Browse and join events created by colleagues
- **User Authentication**: Secure login and registration system
- **Profile Management**: Personalized user profiles for team members
- **Place Management**: Discover and manage event venues and locations
- **Reviews & Ratings**: Share feedback and rate events and places
- **Role-based Access**: Different permission levels for event organizers and participants

## Technology Stack

- **Frontend**: Angular 17 with TailwindCSS
- **API**: RESTful API architecture
- **Authentication**: JWT-based secure authentication
- **Maps Integration**: Interactive maps for location selection and display

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd convivio-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Development

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes to the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Testing

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Project Structure

```
src/app/
├── components/          # Reusable UI components
│   ├── layout/         # Header, footer, navigation components
│   ├── maps/           # Map display and location picker components
│   └── places/         # Place selection components
├── core/               # Core services and utilities
│   ├── auth.service.ts # Authentication service
│   ├── event.service.ts# Event management service
│   ├── place.service.ts# Place management service
│   └── user.service.ts # User management service
├── models/             # TypeScript interfaces and data models
├── pages/              # Application pages and routes
│   ├── auth/           # Login and registration pages
│   ├── events/         # Event management pages
│   ├── places/         # Place management pages
│   └── profile/        # User profile page
└── assets/             # Static assets and resources
```

## Key Features Overview

### For Event Organizers
- Create and manage workplace social events
- Select venues and locations with map integration
- Track event participants and attendance
- Manage event details and updates

### For Participants
- Discover upcoming workplace events
- Join events that interest you
- View event details and locations on interactive maps
- Leave reviews and ratings for events you've attended

### For Administrators
- Manage user access and permissions
- Oversee platform usage and event creation
- Maintain place and venue databases

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

*Building stronger workplace communities, one event at a time.*
