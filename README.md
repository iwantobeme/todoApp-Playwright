# ✅ TodoApp Automated Tests with Playwright

This project contains automated end-to-end test scripts for the [To-Do List Web App](https://abhigyank.github.io/To-Do-List/) using [Microsoft Playwright](https://playwright.dev/).  
It includes setup instructions and execution steps to run the tests on any machine from scratch.

---

## 📌 Project URL Under Test

Url = https://abhigyank.github.io/To-Do-List/

---

## 🧰 Tech Stack

- **Automation Tool:** Playwright
- **Language:** JavaScript
- **Test Runner:** Playwright Test
- **Platform:** Cross-browser support (Chromium, Firefox, WebKit)

---

## 🚀 How to Set Up and Run (Windows – Clean Machine)

### 1. ✅ Prerequisites

- [Node.js (LTS version)](https://nodejs.org/) must be installed.
  > Verify by run
  ```bash
  node -v
  npm -v
  ```

### 2. 📥 Clone repository 
- clone the project down to your local run
  ```bash
  git clone https://github.com/iwantobeme/todoApp-Playwright.git
  cd todoApp-Playwright
  ```

### 3. 📦 Install Dependencies
- to installs Playwright, node_modules and all required packages listed in package.json.
  ```bash
  npm install
  ```
### 4. 🌐 Install Playwright Browsers
- This downloads the required browsers (Chromium, Firefox, WebKit) for testing.
  ```bash
  npx playwright install
  ```
### 5. 🧪 Run the Tests
- cd to the root of repository then run command
  ```bash
  npx playwright test
  ```
  
🔌 Additional Notes
No external libraries are required beyond what’s in package.json.
You can modify browser settings or add test devices in playwright.config.js.
  
