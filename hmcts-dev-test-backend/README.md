# HMCTS Task Management Backend

Hey there! 👋 This is the backend for my HMCTS task management system - a Spring Boot REST API that I built to help caseworkers keep track of their tasks.

## What It Does

I've built this to handle all the core task management stuff you'd expect:
- Create, read, update, and delete tasks (the classic CRUD operations)
- Task status management - I went with TODO, IN_PROGRESS, COMPLETED, and CANCELLED
- Due date tracking (because deadlines matter!)
- Input validation and error handling (learned this the hard way 😅)
- H2 in-memory database - perfect for development and demos
- Swagger/OpenAPI documentation - because good docs save everyone time
- Comprehensive unit tests - I'm quite proud of the test coverage!

## Tech Stack

I chose these technologies because they work well together and I enjoy using them:
- **Java 21** - The latest LTS version with some nice modern features
- **Spring Boot 3.5.5** - My go-to framework for REST APIs
- **Spring Data JPA** - Makes database operations a breeze
- **H2 Database** - Perfect for development (and impressive demo moments!)
- **Spring Boot Validation** - Keeps the data clean and tidy
- **Swagger/OpenAPI** - Auto-generated docs that actually work
- **JUnit 5** - Modern testing framework that I've grown to love
- **Gradle** - Build tool of choice (sorry Maven fans!)

## Prerequisites

You'll need:
- Java 21 (I promise it's worth the upgrade!)
- Gradle (but don't worry, the wrapper handles everything)

## Getting Started

Ready to run this thing? Here's how:

### 1. Build it first
```bash
./gradlew build
```

### 2. Fire it up!
```bash
./gradlew bootRun
```

If all goes well, you'll see it spring to life at `http://localhost:8080` 🚀

### 3. Explore what you've got

- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html` - Interactive API docs (my favorite part!)
- **H2 Console**: `http://localhost:8080/h2-console` - Peek inside the database
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa` 
  - Password: (just leave it empty)

## API Endpoints

Here's what the API can do - I've tried to keep it RESTful and intuitive:

### Task Operations

| Method | Endpoint | What it does |
|--------|----------|-------------|
| GET | `/api/tasks` | Grab all your tasks |
| GET | `/api/tasks/{id}` | Get the details for a specific task |
| POST | `/api/tasks` | Create a shiny new task |
| PUT | `/api/tasks/{id}` | Update everything about a task |
| PATCH | `/api/tasks/{id}/status` | Quick status update (my personal favorite for efficiency!) |
| DELETE | `/api/tasks/{id}` | Say goodbye to a task |

### Task Entity

```json
{
  "id": 1,
  "title": "Complete backend implementation",
  "description": "Finish implementing all task management endpoints",
  "status": "IN_PROGRESS",
  "dueDate": "2025-01-15T10:00:00",
  "createdAt": "2025-01-01T10:00:00",
  "updatedAt": "2025-01-01T10:00:00"
}
```

### Status Values

I kept the status options simple but effective:
- `TODO` - Fresh task, ready to be tackled
- `IN_PROGRESS` - Someone's working on it right now
- `COMPLETED` - Done and dusted! ✅
- `CANCELLED` - Sometimes things change, and that's okay

## Testing

I'm a big believer in good tests - they've saved me countless times!

### Run all tests
```bash
./gradlew test
```

### See how well I covered things
```bash
./gradlew test jacocoTestReport
```

The coverage report lands in `build/reports/jacoco/test/html/index.html` - I'm pretty happy with the numbers!

## Database

I went with H2 in-memory database for this demo - it's perfect because everything just works out of the box! The schema gets created automatically when you start up, so there's no fiddling with migrations or setup scripts.

### Configuration

Database configuration can be found in `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: ""
  jpa:
    hibernate:
      ddl-auto: create-drop
```

## Error Handling

The application includes global exception handling that returns structured error responses:

```json
{
  "message": "Validation failed",
  "status": 400,
  "timestamp": "2025-01-01T10:00:00",
  "fieldErrors": {
    "title": "Title is required"
  }
}
```

## Development Notes

### My Approach to Code Style

I've set things up with:
- Checkstyle to keep us all honest about formatting
- Java 21 features where they make sense (sealed classes, pattern matching, etc.)
- Lombok to cut down on boilerplate - life's too short for getter/setter hell
- Spring Boot best practices that I've picked up over the years

### Want to Add New Features?

I've structured things in a pretty standard way - here's the pattern I followed:

1. **Models first**: Drop your entities in `src/main/java/uk/gov/hmcts/reform/dev/models/`
2. **Repository layer**: Add your data access in `src/main/java/uk/gov/hmcts/reform/dev/repositories/`
3. **Business logic**: Services go in `src/main/java/uk/gov/hmcts/reform/dev/services/`
4. **API layer**: Controllers in `src/main/java/uk/gov/hmcts/reform/dev/controllers/`
5. **Validate everything**: Bean Validation annotations are your friend
6. **Test it all**: Seriously, future you will thank present you

### Ready for Production?

```bash
./gradlew bootJar
```

You'll find your shiny executable JAR in `build/libs/test-backend.jar` - ready to deploy anywhere that runs Java!