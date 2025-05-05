// @ts-check
import { test, expect } from '@playwright/test';
import TodoPage from './todoPage';
import { TODO_LIST, SPECIAL_CHARACTERS, LONG_TEXT } from './testData';

// Setup before each test
test.beforeEach(async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
});

test.describe('TO-DO DEMO', () => {
    test('TC_ATM_001 - Add valid text', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        await todoPage.addTask(TODO_LIST[0]);
        
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 1);
        
        const displayedList = await page.locator('#incomplete-tasks span#text-1');
        await expect(displayedList).toHaveText(TODO_LIST[0]);
    });
    
    test('TC_ATM_002 - Add empty string', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        await todoPage.clickTabAndCheckActive('#add-item');
        await expect(todoPage.newTaskInput).toBeEmpty();
        
        await todoPage.addButton.click();
        await expect(todoPage.newTaskInput).toBeEmpty();
        
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 0);
    });
    
    test('TC_ATM_003 - Add only spaces', async ({ page }) => {
        // This test will always fail as current bug system allows adding space value
        const todoPage = new TodoPage(page);
        
        await todoPage.clickTabAndCheckActive('#add-item');
        await todoPage.newTaskInput.fill(' ');
        await expect(todoPage.newTaskInput).toHaveValue(' ');
        
        await todoPage.addButton.click();
        await expect(todoPage.newTaskInput).toBeEmpty();
        
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 0);
    });

    test('TC_ATM_004 - Add special characters', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        await todoPage.addTask(SPECIAL_CHARACTERS);
        
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 1);
        
        const displayedList = await page.locator('#incomplete-tasks span#text-1');
        await expect(displayedList).toHaveText(SPECIAL_CHARACTERS);
    });
    
    test('TC_ATM_005 - Add long string (255 chars)', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        await todoPage.addTask(LONG_TEXT);
        
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 1);
        
        const displayedList = await page.locator('#incomplete-tasks span#text-1');
        await expect(displayedList).toHaveText(LONG_TEXT);
    });

    test('TC_ATM_006 - Add duplicate task', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add first task
        await todoPage.addTask(TODO_LIST[0]);
        
        // Verify task was added
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 1);
        await todoPage.verifyTaskInList('incomplete-tasks', TODO_LIST[0], true);
        
        // Add the same task again
        await todoPage.addTask(TODO_LIST[0]);
        
        // Verify two tasks exist
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 2);
        
        // Verify both tasks have the same text
        const taskTexts = await todoPage.getAllTaskTexts('incomplete-tasks');
        expect(taskTexts.length).toBe(2);
        expect(taskTexts[0]).toBe(TODO_LIST[0]);
        expect(taskTexts[1]).toBe(TODO_LIST[0]);
    });

    test('TC_ATM_007 - New task should append to the bottom list', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add first task
        await todoPage.addTask(TODO_LIST[0]);
        
        // Verify task was added
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 1);
        
        // Add second task
        await todoPage.addTask(TODO_LIST[1]);
        
        // Verify both tasks exist in correct order
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', 2);
        
        const taskTexts = await todoPage.getAllTaskTexts('incomplete-tasks');
        expect(taskTexts).toEqual([TODO_LIST[0], TODO_LIST[1]]);
    });

    test('TC_ATM_008 - Add multiple valid text', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add all tasks
        await todoPage.addMultipleTasks(TODO_LIST);
        
        // Verify all tasks were added
        await todoPage.clickTabAndCheckActive('#todo');
        await todoPage.checkListCount('ul#incomplete-tasks li', TODO_LIST.length);
        
        // Verify tasks are in correct order
        const taskTexts = await todoPage.getAllTaskTexts('incomplete-tasks');
        expect(taskTexts).toEqual(TODO_LIST);
    });

    test('TC_ATM_009 - Mark single task as complete', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add all tasks
        await todoPage.addMultipleTasks(TODO_LIST);
        
        // Mark first task as complete
        const completedTaskText = await todoPage.markTaskAsComplete(0);
        
        // Verify task count reduced
        await todoPage.checkListCount('ul#incomplete-tasks li', TODO_LIST.length - 1);
        
        // Verify task is no longer in todo list
        await todoPage.verifyTaskInList('incomplete-tasks', completedTaskText, false);
        
        // Verify task appears in completed list
        await todoPage.clickTabAndCheckActive('#completed');
        await todoPage.verifyTaskInList('completed-tasks', completedTaskText, true);
    });
    
    test('TC_ATM_010 - Mark all task as complete', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add all tasks
        await todoPage.addMultipleTasks(TODO_LIST);
        
        // Get all task texts before completing
        await todoPage.clickTabAndCheckActive('#todo');
        const originalTaskTexts = await todoPage.getAllTaskTexts('incomplete-tasks');
        
        // Mark all tasks as complete
        await todoPage.markAllTasksAsComplete();
        
        // Verify no tasks remain in todo list
        await todoPage.checkListCount('ul#incomplete-tasks li', 0);
        
        // Verify all tasks appear in completed list
        await todoPage.clickTabAndCheckActive('#completed');
        
        for (const taskText of originalTaskTexts) {
            await todoPage.verifyTaskInList('completed-tasks', taskText, true);
        }
    });
    
    test('TC_ATM_011 - New complete task should append to the bottom', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add all tasks
        await todoPage.addMultipleTasks(TODO_LIST);
        
        // Mark first task as complete
        const firstCompletedTask = await todoPage.markTaskAsComplete(0);
        
        // Mark "Read books" (index 3 after removing the first task) as complete
        const secondCompletedTask = await todoPage.markTaskAsComplete(3);
        
        // Verify tasks appear in completed list in correct order
        await todoPage.clickTabAndCheckActive('#completed');
        const completedTaskTexts = await todoPage.getAllTaskTexts('completed-tasks');
        
        expect(completedTaskTexts.length).toBe(2);
        expect(completedTaskTexts[0]).toBe(firstCompletedTask);
        expect(completedTaskTexts[1]).toBe(secondCompletedTask);
    });
    
    test('TC_ATM_012 - Delete to-do tasks', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add all tasks
        await todoPage.addMultipleTasks(TODO_LIST);
        
        // Delete the first task
        const deletedTaskText = await todoPage.deleteTask('incomplete-tasks', 0);
        
        // Verify task count reduced
        await todoPage.checkListCount('ul#incomplete-tasks li', TODO_LIST.length - 1);
        
        // Verify deleted task is gone from todo list
        await todoPage.verifyTaskInList('incomplete-tasks', deletedTaskText, false);
        
        // Verify deleted task is not in completed list
        await todoPage.clickTabAndCheckActive('#completed');
        await todoPage.verifyTaskInList('completed-tasks', deletedTaskText, false);
    });
    
    test('TC_ATM_013 - Delete all to-do tasks', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add all tasks
        await todoPage.addMultipleTasks(TODO_LIST);
        
        // Delete all tasks one by one
        await todoPage.clickTabAndCheckActive('#todo');
        while (await todoPage.todoList.count() > 0) {
            const taskText = await todoPage.deleteTask('incomplete-tasks', 0);
            
            // Verify deleted task is gone from todo list
            await todoPage.verifyTaskInList('incomplete-tasks', taskText, false);
            
            // Verify deleted task is not in completed list
            await todoPage.clickTabAndCheckActive('#completed');
            await todoPage.verifyTaskInList('completed-tasks', taskText, false);
            
            // Go back to todo tab for next deletion
            await todoPage.clickTabAndCheckActive('#todo');
        }
        
        // Verify no tasks remain
        await todoPage.checkListCount('ul#incomplete-tasks li', 0);
    });

    test('TC_ATM_014 - Delete complete task', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add one task and mark it complete
        await todoPage.addTask(TODO_LIST[0]);
        const completedTaskText = await todoPage.markTaskAsComplete(0);
        
        // Verify task appears in completed list
        await todoPage.clickTabAndCheckActive('#completed');
        await todoPage.verifyTaskInList('completed-tasks', completedTaskText, true);
        
        // Delete the completed task
        await todoPage.deleteTask('completed-tasks', 0);
        
        // Verify task is removed from completed list
        await todoPage.verifyTaskInList('completed-tasks', completedTaskText, false);
    });

    test('TC_ATM_015 - Delete all complete tasks', async ({ page }) => {
        const todoPage = new TodoPage(page);
        
        // Add all tasks and mark them complete
        await todoPage.addMultipleTasks(TODO_LIST);
        await todoPage.markAllTasksAsComplete();
        
        // Verify all tasks are in completed list
        await todoPage.clickTabAndCheckActive('#completed');
        await todoPage.checkListCount('ul#completed-tasks li', TODO_LIST.length);
        
        // Delete all completed tasks one by one
        while (await todoPage.completedList.count() > 0) {
            const taskText = await todoPage.deleteTask('completed-tasks', 0);
            
            // Verify deleted task is gone
            await todoPage.verifyTaskInList('completed-tasks', taskText, false);
        }
        
        // Verify no tasks remain
        await todoPage.checkListCount('ul#completed-tasks li', 0);
    });
});
