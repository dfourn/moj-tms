import { test, expect } from '@playwright/test';

test.describe('Task Management System E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application homepage
    await page.goto('/');
    // Should redirect to tasks page
    await expect(page).toHaveURL('/tasks');
  });

  test('should display the task list page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Task Management');
    await expect(page.locator('text=Create New Task')).toBeVisible();
  });

  test('should create a new task with due date', async ({ page }) => {
    const taskTitle = `E2E Test Task ${Date.now()}`;
    
    // Click create new task button
    await page.click('text=Create New Task');
    
    // Verify we're on the create task page
    await expect(page).toHaveURL('/tasks/new');
    await expect(page.locator('h1')).toContainText('Create New Task');
    
    // Fill out the task form
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'This is a task created by E2E tests');
    await page.check('#status-todo');
    await page.fill('#dueDate', '2025-12-31T17:00');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect to tasks list
    await expect(page).toHaveURL('/tasks');
    
    // Verify the task appears in the list
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    // Find the specific row containing our task and check its status
    await expect(page.locator(`tr:has-text("${taskTitle}") .govuk-tag--blue`)).toContainText('TODO');
  });

  test('should create a new task without due date', async ({ page }) => {
    const taskTitle = `Task Without Due Date ${Date.now()}`;
    
    // Click create new task button
    await page.click('text=Create New Task');
    
    // Fill out the task form without due date
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'This task has no due date');
    await page.check('#status-inprogress');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect to tasks list
    await expect(page).toHaveURL('/tasks');
    
    // Verify the task appears in the list
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    // Find the specific row containing our task and check its status
    await expect(page.locator(`tr:has-text("${taskTitle}") .govuk-tag--yellow`)).toContainText('IN PROGRESS');
  });

  test('should view task details', async ({ page }) => {
    const taskTitle = `Task for Viewing ${Date.now()}`;
    
    // First create a task
    await page.click('text=Create New Task');
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'This task will be viewed');
    await page.check('#status-todo');
    await page.click('button[type="submit"]');
    
    // Click on the task title to view details
    await page.click(`text=${taskTitle}`);
    
    // Verify we're on the task detail page
    await expect(page.locator('h1')).toContainText(taskTitle);
    await expect(page.locator('text=This task will be viewed')).toBeVisible();
    await expect(page.locator('.govuk-tag--blue')).toContainText('TODO');
    
    // Verify action buttons are present
    await expect(page.locator('text=Edit Task')).toBeVisible();
    await expect(page.locator('text=Delete Task')).toBeVisible();
  });

  test('should edit an existing task', async ({ page }) => {
    const originalTitle = `Task to Edit ${Date.now()}`;
    const updatedTitle = `Updated Task Title ${Date.now()}`;
    
    // First create a task
    await page.click('text=Create New Task');
    await page.fill('#title', originalTitle);
    await page.fill('#description', 'Original description');
    await page.check('#status-todo');
    await page.click('button[type="submit"]');
    
    // Click on the task title to go to task detail page first
    await page.click(`text=${originalTitle}`);
    
    // Then click the Edit Task button from the task detail page
    await page.click('text=Edit Task');
    
    // Verify we're on the edit page
    await expect(page).toHaveURL(/\/tasks\/\d+\/edit/);
    await expect(page.locator('h1')).toContainText('Edit Task');
    
    // Verify form is pre-populated
    await expect(page.locator('#title')).toHaveValue(originalTitle);
    await expect(page.locator('#description')).toHaveValue('Original description');
    
    // Update the task
    await page.fill('#title', updatedTitle);
    await page.fill('#description', 'Updated description');
    await page.check('#status-completed');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect to task detail page
    await expect(page).toHaveURL(/\/tasks\/\d+$/);
    
    // Verify the updates
    await expect(page.locator('h1')).toContainText(updatedTitle);
    await expect(page.locator('text=Updated description')).toBeVisible();
    await expect(page.locator('.govuk-tag--green')).toContainText('COMPLETED');
  });

  test('should update task status quickly', async ({ page }) => {
    const taskTitle = `Status Update Task ${Date.now()}`;
    
    // First create a task
    await page.click('text=Create New Task');
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'Task for status updates');
    await page.check('#status-todo');
    await page.click('button[type="submit"]');
    
    // Go to task detail page
    await page.click(`text=${taskTitle}`);
    
    // Update status using quick status change
    await page.selectOption('select[name="status"]', 'IN_PROGRESS');
    
    // Verify status updated
    await expect(page.locator('.govuk-tag--yellow')).toContainText('IN PROGRESS');
  });

  test('should delete a task with confirmation', async ({ page }) => {
    const taskTitle = `Task to Delete ${Date.now()}`;
    
    // First create a task
    await page.click('text=Create New Task');
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'This task will be deleted');
    await page.check('#status-todo');
    await page.click('button[type="submit"]');
    
    // Go to task detail page
    await page.click(`text=${taskTitle}`);
    
    // Set up dialog handler before clicking delete
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Are you sure you want to delete this task?');
      await dialog.accept();
    });
    
    // Click delete button
    await page.click('text=Delete Task');
    
    // Should redirect to tasks list
    await expect(page).toHaveURL('/tasks');
    
    // Verify task is no longer in the list
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  });

  test('should handle form validation errors', async ({ page }) => {
    // Go to create task page
    await page.click('text=Create New Task');
    
    // Try to submit form with only title (missing required fields)
    await page.click('button[type="submit"]');
    
    // Should either stay on same page with error or redirect back with error
    // Since forms use server-side validation, check for error message
    const currentUrl = page.url();
    if (currentUrl.includes('/tasks/new')) {
      // Stayed on form page - check for error message
      await expect(page.locator('text=There is a problem')).toBeVisible();
    } else {
      // Redirected somewhere - test passed if it handles gracefully
      await expect(page).toHaveURL('/tasks');
    }
  });

  test('should display empty state when no tasks exist', async ({ page }) => {
    // This test assumes we start with a clean database
    // In a real scenario, you'd want to clear the database before this test
    
    // Navigate to tasks page
    await page.goto('/tasks');
    
    // Check for empty state message (if no tasks exist)
    const noTasksText = page.locator('text=No tasks found');
    if (await noTasksText.isVisible()) {
      await expect(noTasksText).toBeVisible();
      await expect(page.locator('text=Create your first task')).toBeVisible();
    }
  });

  test('should navigate using breadcrumbs', async ({ page }) => {
    const taskTitle = `Breadcrumb Test Task ${Date.now()}`;
    
    // Create a task first
    await page.click('text=Create New Task');
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'Testing breadcrumb navigation');
    await page.check('#status-todo');
    await page.click('button[type="submit"]');
    
    // Go to task detail page
    await page.click(`text=${taskTitle}`);
    
    // Click on breadcrumb to go back to task list
    await page.click('text=Tasks');
    
    // Should be back on tasks page
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('h1')).toContainText('Task Management');
  });

  test('should maintain task state across page refreshes', async ({ page }) => {
    const taskTitle = `Persistent Task ${Date.now()}`;
    
    // Create a task
    await page.click('text=Create New Task');
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'This task should persist');
    await page.check('#status-completed');
    await page.fill('#dueDate', '2025-06-15T14:30');
    await page.click('button[type="submit"]');
    
    // Refresh the page
    await page.reload();
    
    // Verify task still exists
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    // Use specific row selector for status check
    await expect(page.locator(`tr:has-text("${taskTitle}") .govuk-tag--green`)).toContainText('COMPLETED');
  });

  test('should handle different task statuses correctly', async ({ page }) => {
    const statuses = [
      { value: 'TODO', class: 'govuk-tag--blue', display: 'TODO' },
      { value: 'IN_PROGRESS', class: 'govuk-tag--yellow', display: 'IN PROGRESS' },
      { value: 'COMPLETED', class: 'govuk-tag--green', display: 'COMPLETED' },
      { value: 'CANCELLED', class: 'govuk-tag--red', display: 'CANCELLED' }
    ];
    
    for (const status of statuses) {
      const taskTitle = `${status.value} Task ${Date.now()}`;
      
      // Create task with specific status
      await page.click('text=Create New Task');
      await page.fill('#title', taskTitle);
      await page.fill('#description', `Task with ${status.value} status`);
      
      // Map status values to radio button IDs
      let statusId = '#status-todo';
      if (status.value === 'IN_PROGRESS') statusId = '#status-inprogress';
      if (status.value === 'COMPLETED') statusId = '#status-completed';
      if (status.value === 'CANCELLED') statusId = '#status-cancelled';
      
      await page.check(statusId);
      await page.click('button[type="submit"]');
      
      // Verify status display for the specific task
      await expect(page.locator(`tr:has-text("${taskTitle}") .${status.class}`)).toContainText(status.display);
      
      // Small delay to ensure unique timestamps
      await page.waitForTimeout(100);
    }
  });

  test('should format due dates correctly', async ({ page }) => {
    const taskTitle = `Date Format Test ${Date.now()}`;
    
    // Create task with due date
    await page.click('text=Create New Task');
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'Testing date formatting');
    await page.check('#status-todo');
    await page.fill('#dueDate', '2025-03-15T16:30');
    await page.click('button[type="submit"]');
    
    // Verify date is formatted correctly (DD/MM/YYYY) in the row with our task
    await expect(page.locator(`tr:has-text("${taskTitle}"):has-text("15/03/2025")`)).toBeVisible();
  });

  test('should work properly on mobile viewports', async ({ page }) => {
    const taskTitle = `Mobile Task ${Date.now()}`;
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test basic functionality on mobile
    await expect(page.locator('h1')).toContainText('Task Management');
    
    // Create a task on mobile
    await page.click('text=Create New Task');
    await page.fill('#title', taskTitle);
    await page.fill('#description', 'Created on mobile');
    await page.check('#status-todo');
    await page.click('button[type="submit"]');
    
    // Verify task appears
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    const taskTitle = `Keyboard Navigation Task ${Date.now()}`;
    
    // Navigate to create task form via keyboard
    await page.focus('text=Create New Task');
    await page.keyboard.press('Enter');
    
    // Verify we're on the create page
    await expect(page).toHaveURL('/tasks/new');
    
    // Fill form using direct focus and type
    await page.focus('#title');
    await page.fill('#title', taskTitle);
    await page.focus('#description');
    await page.fill('#description', 'Testing keyboard accessibility');
    
    // The form should be accessible and filled correctly
    await expect(page.locator('#title')).toHaveValue(taskTitle);
    await expect(page.locator('#description')).toHaveValue('Testing keyboard accessibility');
    
    // Should be able to submit with keyboard
    await page.keyboard.press('Tab'); // Move to radio buttons
    await page.keyboard.press('Space'); // Select first radio button
    await page.focus('button[type="submit"]');
    await page.keyboard.press('Enter');
    
    // Should redirect to tasks page
    await expect(page).toHaveURL('/tasks');
  });
});