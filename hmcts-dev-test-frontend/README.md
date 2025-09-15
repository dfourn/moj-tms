# HMCTS Task Management Frontend

Welcome to the frontend! 🎨 This is where all the magic happens for users - a clean, accessible web app built with Node.js and Express, following the excellent GOV.UK Design System guidelines.

## What Users Get

I've focused on making this as user-friendly as possible:
- Clean task list view that doesn't overwhelm
- Simple task creation with proper validation (nobody likes broken forms!)
- Intuitive editing - click and change what you need
- Quick status updates without page refreshes 
- Thoughtful delete confirmation (we've all accidentally deleted things!)
- Responsive design that works on phones, tablets, everything
- Proper error handling with helpful messages
- Comprehensive unit tests (because I care about quality!)

## Tech Stack

Here's what I chose and why I love each piece:
- **Node.js 18+** - Fast, modern, and handles everything I throw at it
- **Express.js** - The web framework that just works (and doesn't get in my way)
- **TypeScript** - Because catching errors at compile time > debugging at 2am
- **Nunjucks** - Template engine that plays nicely with GOV.UK components
- **GOV.UK Frontend** - Professional, accessible, and saves me from designing buttons!
- **Webpack** - Asset bundling that handles all the modern web stuff
- **Jest** - Testing framework that makes writing tests actually pleasant
- **Yarn** - Package manager that's faster than npm (fight me! 😄)

## Prerequisites

Before we get started, you'll need:
- Node.js 18 or higher (I recommend using the latest LTS)
- Yarn package manager (because it's just better)
- The backend API running (check out the hmcts-dev-test-backend folder)

## Getting Started

Let's get this thing running! Here's my usual workflow:

### 1. Grab the dependencies
```bash
yarn install
```

### 2. Build the assets
```bash
yarn webpack
```
This compiles all the TypeScript and SCSS into something browsers can understand.

### 3. Fire it up!
```bash
yarn start:dev
```

If everything goes well, you'll have a beautiful task management interface at `https://localhost:3100` ✨

### 4. Start in production mode

```bash
yarn build:prod
yarn start
```

## Architecture

### Directory Structure

```
src/
├── main/
│   ├── assets/          # Static assets (CSS, JS, images)
│   ├── routes/          # Express route handlers
│   ├── views/           # Nunjucks templates
│   │   └── tasks/       # Task-specific templates
│   ├── modules/         # Custom modules (Nunjucks setup)
│   ├── app.ts           # Express application setup
│   └── server.ts        # Application entry point
├── test/
│   └── unit/            # Unit tests
```

### Routes (The User Journey)

| Route | Method | What happens |
|-------|--------|-------------|
| `/` | GET | Welcome! Redirects straight to the task list |
| `/tasks` | GET | The main event - shows all your tasks |
| `/tasks/new` | GET | Clean form to create something new |
| `/tasks` | POST | Saves that new task you just created |
| `/tasks/:id` | GET | All the details about a specific task |
| `/tasks/:id/edit` | GET | Edit form pre-filled with current data |
| `/tasks/:id` | POST | Updates the task with your changes |
| `/tasks/:id/status` | POST | Quick status change (no full page reload!) |
| `/tasks/:id/delete` | POST | Goodbye task (with confirmation, of course) |

## Backend Integration

The frontend integrates with the backend API running on `http://localhost:8080/api`. The API base URL can be configured using the `API_BASE_URL` environment variable.

### API Configuration

```typescript
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';
```

## UI Components

### Task List
- Displays all tasks in a table format
- Shows task title, status, due date, and actions
- Status badges with color coding
- Links to view and edit tasks

### Task Forms
- Create new task form with validation
- Edit existing task form
- Status radio buttons
- DateTime input for due dates
- GOV.UK form components

### Task Details
- Complete task information display
- Quick status change dropdown
- Edit and delete buttons
- Breadcrumb navigation

## Testing

### Run unit tests

```bash
yarn test
```

### Run with coverage

```bash
yarn test:coverage
```

### Run route tests

```bash
yarn test:routes
```

## Development

### Code Style

The project enforces code quality with:
- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for code formatting
- **Stylelint** for CSS/SCSS linting
- **Husky** for pre-commit hooks

### Linting

```bash
# Check all files
yarn lint

# Fix auto-fixable issues
yarn lint:fix
```

### Asset Building

```bash
# Development build
yarn build

# Production build
yarn build:prod
```

## Error Handling

The application includes comprehensive error handling:

- **API Errors**: Graceful handling of backend API failures
- **404 Errors**: Custom not-found pages for missing tasks  
- **Form Validation**: Client-side and server-side validation
- **User Feedback**: Clear error messages and success notifications

## GOV.UK Design System

The frontend uses the official GOV.UK Frontend package:

- Consistent styling and components
- Accessible by default
- Mobile-responsive design
- Government branding standards

### Key Components Used

- Headers and footers
- Navigation (breadcrumbs)
- Forms (inputs, textareas, radios)
- Tables for data display
- Buttons and links
- Tags for status indicators
- Error summaries and validation

## Environment Configuration

### Environment Variables

- `NODE_ENV` - Application environment (development/production)
- `API_BASE_URL` - Backend API base URL (default: http://localhost:8080/api)
- `PORT` - Application port (default: 3100)

## Deployment

### Building for Production

1. Install dependencies: `yarn install`
2. Build assets: `yarn build:prod`
3. Start application: `yarn start`

### Docker Support

The application can be containerized using the standard Node.js Docker practices:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY . .
RUN yarn build:prod
EXPOSE 3100
CMD ["yarn", "start"]
```

## Security

- **CSRF Protection**: Implemented using csurf middleware
- **HTTPS**: Enabled by default in development
- **Input Validation**: Server-side validation for all forms
- **Error Handling**: No sensitive information exposed in error messages

## Accessibility

The application follows GOV.UK accessibility standards:

- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast support
- Alternative text for images