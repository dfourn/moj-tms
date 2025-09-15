# HMCTS Task Management System

Welcome to my task management system! 👋 This is a complete full-stack solution I built for HMCTS caseworkers, featuring a robust Spring Boot backend and a clean, accessible Node.js frontend that follows GOV.UK Design System standards.

## What I Built

Here's what I put together - a straightforward task management solution that covers all the essentials for caseworkers:

- Task creation, viewing, editing, and deletion
- Status management (TODO, IN_PROGRESS, COMPLETED, CANCELLED)
- Due date tracking
- User-friendly interface following GOV.UK standards
- Comprehensive API documentation
- Full test coverage

## Architecture

```
┌─────────────────────┐    HTTP/REST API    ┌─────────────────────┐
│                     │◄──────────────────►│                     │
│   Frontend (3100)   │                     │   Backend (8080)    │
│   Node.js/Express   │                     │   Spring Boot       │
│   GOV.UK Design     │                     │   REST API          │
│                     │                     │                     │
└─────────────────────┘                     └─────────────────────┘
                                                         │
                                                         ▼
                                            ┌─────────────────────┐
                                            │                     │
                                            │   H2 Database       │
                                            │   (In-Memory)       │
                                            │                     │
                                            └─────────────────────┘
```

## Project Structure

```
moj-senior-dev/
├── hmcts-dev-test-backend/     # Spring Boot REST API
│   ├── src/
│   │   ├── main/java/          # Application code
│   │   └── test/java/          # Unit tests
│   ├── build.gradle            # Build configuration
│   └── README.md              # Backend documentation
│
├── hmcts-dev-test-frontend/    # Node.js/Express web app
│   ├── src/
│   │   ├── main/              # Application code
│   │   └── test/              # Unit tests
│   ├── package.json           # Dependencies
│   └── README.md             # Frontend documentation
│
└── README.md                 # This file
```

## Quick Start

### Prerequisites

- **Java 21** (for backend)
- **Node.js 18+** (for frontend)
- **Yarn** package manager

### 1. Start the Backend

```bash
cd hmcts-dev-test-backend
./gradlew bootRun
```

Backend will be available at `http://localhost:8080`

### 2. Start the Frontend

```bash
cd hmcts-dev-test-frontend
yarn install
yarn webpack
yarn start:dev
```

Frontend will be available at `https://localhost:3100`

### 3. Access the Application

- **Web Interface**: https://localhost:3100
- **API Documentation**: http://localhost:8080/swagger-ui/index.html
- **Database Console**: http://localhost:8080/h2-console

## Features

### Backend API Features

- ✅ RESTful API endpoints for task management
- ✅ Input validation and error handling
- ✅ Swagger/OpenAPI documentation
- ✅ H2 in-memory database
- ✅ JPA entities with relationships
- ✅ Comprehensive unit tests
- ✅ Status management endpoints

### Frontend Web Application Features

- ✅ Task list with filtering and sorting
- ✅ Create new tasks with form validation
- ✅ View task details
- ✅ Edit existing tasks
- ✅ Quick status updates
- ✅ Delete tasks with confirmation
- ✅ Responsive GOV.UK design
- ✅ Error handling and user feedback
- ✅ Unit tests for routes

## API Endpoints

### Core Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Retrieve all tasks |
| GET | `/api/tasks/{id}` | Get specific task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update entire task |
| PATCH | `/api/tasks/{id}/status` | Update task status only |
| DELETE | `/api/tasks/{id}` | Delete a task |

### Task Data Structure

```json
{
  "id": 1,
  "title": "Complete case review",
  "description": "Review case documentation and prepare summary",
  "status": "IN_PROGRESS",
  "dueDate": "2025-01-15T17:00:00",
  "createdAt": "2025-01-01T09:00:00",
  "updatedAt": "2025-01-01T14:30:00"
}
```

## Testing

### Backend Tests

```bash
cd hmcts-dev-test-backend
./gradlew test                    # Run unit tests
./gradlew test jacocoTestReport  # Generate coverage report
```

### Frontend Tests

```bash
cd hmcts-dev-test-frontend
yarn test              # Run unit tests
yarn test:coverage     # Run with coverage
yarn test:routes       # Test route handlers
```

## Development Guidelines

### Code Quality Standards

Both projects enforce high code quality through:

- **Linting**: ESLint for TypeScript/JavaScript, Checkstyle for Java
- **Formatting**: Prettier for frontend, Java formatting rules for backend
- **Testing**: Comprehensive unit test coverage
- **Documentation**: Inline code comments and API documentation
- **Validation**: Input validation and error handling

### Security Best Practices

- Input validation on all API endpoints
- CSRF protection on frontend forms
- No sensitive data exposed in error messages
- Secure HTTP headers
- SQL injection prevention through JPA

### Accessibility Compliance

The frontend follows GOV.UK accessibility standards:
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast themes

## Deployment

### Backend Deployment

```bash
cd hmcts-dev-test-backend
./gradlew bootJar
java -jar build/libs/test-backend.jar
```

### Frontend Deployment

```bash
cd hmcts-dev-test-frontend
yarn install --production
yarn build:prod
yarn start
```

### Environment Configuration

#### Backend
- Configure database in `application.yml`
- Set JVM options for production
- Configure logging levels

#### Frontend
- Set `API_BASE_URL` environment variable
- Configure HTTPS certificates for production
- Set `NODE_ENV=production`

## Technology Choices

### Backend: Spring Boot + Java 21

**Why Spring Boot?**
- Mature ecosystem with excellent documentation
- Built-in features: validation, security, monitoring
- Easy testing with comprehensive test framework
- Production-ready with minimal configuration

**Why Java 21?**
- Latest LTS version with modern language features
- Excellent performance and stability
- Strong type system reduces runtime errors
- Great tooling and IDE support

### Frontend: Node.js + Express + GOV.UK Design

**Why Node.js/Express?**
- Fast development with JavaScript/TypeScript
- Large ecosystem of packages
- Good performance for web applications
- Easy integration with REST APIs

**Why GOV.UK Design System?**
- Government accessibility standards compliance
- Consistent user experience
- Mobile-responsive by default
- Well-tested components

### Database: H2 In-Memory

**Why H2?**
- Perfect for development and demonstration
- No setup required
- Fast performance
- Easy to reset for testing
- Can be easily replaced with PostgreSQL/MySQL for production

## Future Enhancements

### Potential Backend Improvements

- [ ] User authentication and authorization
- [ ] Task assignment to specific caseworkers
- [ ] File attachments support
- [ ] Task comments and activity log
- [ ] Email notifications for due dates
- [ ] PostgreSQL for production deployment
- [ ] Docker containerization
- [ ] API rate limiting

### Potential Frontend Improvements

- [ ] Task filtering and search functionality
- [ ] Bulk operations (mark multiple as complete)
- [ ] Calendar view for due dates
- [ ] Progressive Web App (PWA) support
- [ ] Real-time updates via WebSockets
- [ ] Export tasks to CSV/PDF
- [ ] Dark mode support
- [ ] Improved mobile experience

## Support and Documentation

- **Backend API**: See Swagger UI at http://localhost:8080/swagger-ui/index.html
- **Frontend Routes**: Detailed documentation in `hmcts-dev-test-frontend/README.md`
- **Backend Architecture**: Technical details in `hmcts-dev-test-backend/README.md`

## License

Copyright (c) 2025 Daniel Patynski
