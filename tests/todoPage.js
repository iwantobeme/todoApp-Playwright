// @ts-check
import { expect } from '@playwright/test';

/**
 * Page Object class for the Todo List application
 */
class TodoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Page elements
    this.newTaskInput = page.locator('#new-task');
    this.addButton = page.getByRole('button', { name: 'add' });
    this.todoList = page.locator('ul#incomplete-tasks li');
    this.completedList = page.locator('ul#completed-tasks li');
    this.addItemTab = page.locator('a[href="#add-item"]');
    this.todoTab = page.locator('a[href="#todo"]');
    this.completedTab = page.locator('a[href="#completed"]');
  }

  /**
   * Navigate to the Todo application
   */
  async goto() {
    await this.page.goto('https://abhigyank.github.io/To-Do-List/');
    await expect(this.page).toHaveTitle('To-Do List');
  }

  /**
   * Click on a tab and verify it's active
   * @param {string} href - The href attribute of the tab to click
   */
  async clickTabAndCheckActive(href) {
    const tab = this.page.locator(`a[href='${href}']`);
    await tab.click();
    await expect(tab).toHaveClass(/is-active/);
  }

  /**
   * Add a single task to the todo list
   * @param {string} taskText - Text for the task to add
   */
  async addTask(taskText) {
    await this.clickTabAndCheckActive('#add-item');
    await this.newTaskInput.fill(taskText);
    await expect(this.newTaskInput).toHaveValue(taskText);
    
    await this.addButton.click();
    await expect(this.newTaskInput).toBeEmpty();
  }

  /**
   * Add multiple tasks to the todo list
   * @param {string[]} tasks - Array of task texts to add
   */
  async addMultipleTasks(tasks) {
    for (const task of tasks) {
      await this.addTask(task);
    }
  }

  /**
   * Count elements matching a specific selector
   * @param {string} locatorString - CSS selector for elements to count
   * @param {number} expectedAmount - Expected count
   */
  async checkListCount(locatorString, expectedAmount) {
    const list = this.page.locator(locatorString);
    await expect(list).toHaveCount(expectedAmount);
  }

  /**
   * Verify if a task text exists or does not exist in a specified list
   * @param {string} listId - ID of the list ('incomplete-tasks' or 'completed-tasks')
   * @param {string} taskText - The text to verify
   * @param {boolean} shouldExist - Whether the task should exist
   */
  async verifyTaskInList(listId, taskText, shouldExist) {
    const locator = this.page.locator(`ul#${listId} li:has(span:has-text("${taskText}"))`);
    const count = await locator.count();
    
    if (shouldExist) {
      expect(count).toBeGreaterThan(0);
    } else {
      expect(count).toBe(0);
    }
  }

  /**
   * Mark a task as complete by index
   * @param {number} index - Index of the task to mark complete (0-based)
   * @returns {Promise<string>} - The text of the completed task
   */
  async markTaskAsComplete(index) {
    await this.clickTabAndCheckActive('#todo');
    const taskItem = this.todoList.nth(index);
    const taskText = await taskItem.locator('span.mdl-checkbox__label').innerText();
    await taskItem.locator('label').click();
    return taskText;
  }

  /**
   * Mark all tasks as complete
   */
  async markAllTasksAsComplete() {
    await this.clickTabAndCheckActive('#todo');
    while (await this.todoList.count() > 0) {
      await this.todoList.nth(0).locator('label').click();
    }
  }

  /**
   * Delete a task by index from specified list
   * @param {string} listId - ID of the list ('incomplete-tasks' or 'completed-tasks')
   * @param {number} index - Index of the task to delete (0-based)
   * @returns {Promise<string>} - The text of the deleted task
   */
  async deleteTask(listId, index) {
    await this.clickTabAndCheckActive(listId === 'incomplete-tasks' ? '#todo' : '#completed');
    
    const taskItem = this.page.locator(`ul#${listId} li`).nth(index);
    
    let taskText;
    if (listId === 'incomplete-tasks') {
      taskText = await taskItem.locator('span.mdl-checkbox__label').innerText();
    } else {
      // For completed tasks, we need to clean the text
      const fullText = await taskItem.locator('span.mdl-list__item-primary-content').innerText();
      taskText = fullText.replace('done', '').trim();
    }
    
    await taskItem.locator('button.delete').click();
    return taskText;
  }

  /**
   * Get all task texts from a list
   * @param {string} listId - ID of the list ('incomplete-tasks' or 'completed-tasks')
   * @returns {Promise<string[]>} - Array of task texts
   */
  async getAllTaskTexts(listId) {
    const selector = listId === 'incomplete-tasks' 
      ? 'span.mdl-checkbox__label'
      : 'span.mdl-list__item-primary-content';
    
    const tasks = this.page.locator(`ul#${listId} li ${selector}`);
    const count = await tasks.count();
    const texts = [];
    
    for (let i = 0; i < count; i++) {
      let text = await tasks.nth(i).innerText();
      if (listId === 'completed-tasks') {
        text = text.replace('done', '').trim();
      }
      texts.push(text);
    }
    
    return texts;
  }
}

export default TodoPage;
