# Convivio

Convivio is a social platform that allows users to discover events and places, create and join events, and share reviews.

## Features

- User authentication (login, registration, profile management)
- Event discovery and management
- Place discovery and management
- Reviews and ratings
- Role-based access control

## Technology Stack

- **Frontend**: Angular 17, TailwindCSS
- **API**: RESTful API (see `api-documentation.md` for details)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run start
   ```
4. Open your browser and navigate to `http://localhost:4200`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Project Structure

- `/src/app/components` - Reusable UI components
- `/src/app/core` - Core services and utilities
- `/src/app/models` - Data models and interfaces
- `/src/app/pages` - Page components
- `/src/assets` - Static assets

## API Documentation

For detailed information about the API endpoints, refer to the [API Documentation](api-documentation.md).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
