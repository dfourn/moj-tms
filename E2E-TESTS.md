# End-to-End Tests for HMCTS Task Management System

Welcome to my E2E testing setup! 🎭 This is a comprehensive Playwright test suite that puts the entire system through its paces.

## What This Does

These tests are all about the real user experience - they fire up browsers, click buttons, fill forms, and make sure everything works exactly like a real person would use it. The tests run against the complete stack:

- **Backend**: Spring Boot API (port 8080)
- **Frontend**: Node.js/Express web application (port 3100)  
- **Database**: H2 in-memory database

## Test Coverage

The E2E test suite (`tests/e2e/task-management.spec.ts`) covers:

### ✅ Core CRUD Operations
- Creating tasks with and without due dates
- Viewing task details
- Editing existing tasks
- Deleting tasks with confirmation
- Quick status updates

### ✅ User Interface Testing
- Task list display and navigation
- Form validation and error handling
- Status badges and color coding
- Date formatting (DD/MM/YYYY)
- Breadcrumb navigation

### ✅ Cross-Browser Compatibility
- Chrome/Chromium
- Firefox  
- Safari/WebKit

### ✅ Responsive Design
- Mobile viewport testing
- Desktop layouts

### ✅ Accessibility
- Keyboard navigation
- Screen reader compatibility
- GOV.UK design system compliance

### ✅ Data Persistence
- Task state across page refreshes
- Database integration
- Multiple task statuses (TODO, IN_PROGRESS, COMPLETED, CANCELLED)

## Prerequisites

1. **Java 21** - for backend
2. **Node.js 18+** - for frontend
3. **Yarn** - package manager
4. **Playwright browsers** - automatically installed

## Setup

1. Install E2E test dependencies:
```bash
yarn install
yarn test:e2e:install
```

2. Ensure both services are running:
   - Backend: `http://localhost:8080`
   - Frontend: `https://localhost:3100`

## Running Tests

### Automated Service Startup
The Playwright config automatically starts both services before running tests:

```bash
# Run all tests (services auto-start)
yarn test:e2e

# Run with browser UI visible
yarn test:e2e:headed

# Interactive debugging mode
yarn test:e2e:debug

# Playwright UI mode
yarn test:e2e:ui
```

### Manual Service Management
If you prefer to manage services manually:

1. Start backend:
```bash
cd hmcts-dev-test-backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
./gradlew bootRun
```

2. Start frontend:
```bash
cd hmcts-dev-test-frontend
yarn install
yarn webpack
yarn start:dev
```

3. Run tests:
```bash
yarn test:e2e
```

## Test Results

### View Test Report
```bash
yarn test:e2e:report
```

### Test Output
Tests generate:
- HTML test reports
- Screenshots on failures
- Video recordings of test runs
- Trace files for debugging

## Test Structure

### Test File Organization
```
tests/
├── e2e/
│   └── task-management.spec.ts    # Main E2E test suite
├── playwright.config.ts           # Playwright configuration
└── package.json                   # Test scripts and dependencies
```

### Key Test Scenarios

1. **Task Creation Flow**
   - Navigate to create form
   - Fill required fields
   - Submit and verify redirect
   - Confirm task appears in list

2. **Task Management Workflow**  
   - Create → View → Edit → Update Status → Delete
   - Test different status transitions
   - Verify data persistence

3. **Error Handling**
   - Form validation errors
   - Network error scenarios
   - 404 handling for missing tasks

4. **User Experience**
   - Mobile responsiveness
   - Keyboard accessibility
   - Visual design consistency

## Configuration

### Playwright Config (`playwright.config.ts`)
- **Test Directory**: `./tests/e2e`
- **Base URL**: `https://localhost:3100`
- **Browsers**: Chrome, Firefox, Safari
- **Auto-start services**: Backend + Frontend
- **Reports**: HTML format
- **Retries**: 2 on CI, 0 locally

### Environment Variables
- `CI`: Enables CI-specific settings
- `JAVA_HOME`: Java installation path
- Custom timeouts and retry logic

## Continuous Integration

The tests are designed to run in CI environments:

```bash
# CI-optimized test run
CI=1 yarn test:e2e
```

CI features:
- Reduced parallelism (1 worker)
- Increased retries (2x)
- Headless mode only
- Service auto-management

## Debugging Tests

### Debug Mode
```bash
yarn test:e2e:debug
```
Opens Playwright Inspector for step-by-step debugging.

### UI Mode
```bash
yarn test:e2e:ui
```
Interactive test runner with live test editing.

### Trace Viewer
Failed tests automatically generate traces:
```bash
npx playwright show-trace test-results/trace.zip
```

## Test Data Management

### Database State
- Tests use H2 in-memory database
- Fresh database per test run
- No cleanup required between tests
- Some tests may interact with existing data

### Test Isolation
Each test is designed to be independent, but some tests create data that others might interact with. In production, you may want to:
- Clear database before each test
- Use unique test data identifiers
- Implement database seeding

## Performance Considerations

### Test Execution Time
- Full suite: ~2-3 minutes
- Individual tests: 10-30 seconds each
- Service startup: ~30 seconds (one-time)

### Optimization Tips
- Use `test.describe.configure({ mode: 'parallel' })` for faster execution
- Skip browser installations in CI with cached images
- Use headless mode for faster execution

## Troubleshooting

### Common Issues

1. **Service Startup Failures**
   - Check Java version: `java --version`
   - Verify ports 8080/3100 are available
   - Check JAVA_HOME environment variable

2. **Test Timeouts**
   - Increase timeout in playwright.config.ts
   - Check service health endpoints
   - Verify HTTPS certificates for frontend

3. **Browser Issues**
   - Reinstall browsers: `yarn test:e2e:install`
   - Clear Playwright cache
   - Check browser compatibility

### Debug Commands
```bash
# Check service health
curl http://localhost:8080/actuator/health
curl -k https://localhost:3100

# Verify test configuration
npx playwright test --list

# Run specific test
npx playwright test --grep "should create a new task"
```

## Future Enhancements

Potential improvements to the E2E test suite:

1. **Advanced Scenarios**
   - Bulk operations testing
   - Concurrent user simulation  
   - Performance testing

2. **Data Management**
   - Database fixtures and seeding
   - Test data factories
   - Cleanup automation

3. **Visual Testing**
   - Screenshot comparisons
   - Visual regression testing
   - Cross-browser visual consistency

4. **API Testing Integration**
   - Direct API validation
   - Backend service testing
   - Database state verification

## Contributing

When adding new E2E tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Include proper assertions
4. Test both success and error paths
5. Consider mobile and accessibility aspects
6. Update this documentation

---

The E2E test suite provides comprehensive coverage of the HMCTS Task Management System, ensuring that the full user journey works correctly across different browsers and devices while maintaining government accessibility standards.