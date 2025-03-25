#!/usr/bin/env node

/**
 * Comprehensive Test Runner for Beyond Medium
 * 
 * This script runs all tests and generates a comprehensive report.
 * It can be used as a pre-deployment check to ensure everything is working correctly.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Test categories and their commands
const testCategories = [
  { 
    name: 'Unit Tests', 
    command: 'pnpm jest --testPathPattern=__tests__/components',
    description: 'Testing individual UI components' 
  },
  { 
    name: 'Integration Tests', 
    command: 'pnpm jest --testPathPattern=__tests__/integration',
    description: 'Testing interactions between components and modules'
  },
  { 
    name: 'API Tests', 
    command: 'pnpm jest --testPathPattern=__tests__/api',
    description: 'Testing API endpoints and request handling'
  }
];

// Ensure data directory exists for tests
require('./test-setup');

console.log(`${colors.bright}${colors.blue}================================${colors.reset}`);
console.log(`${colors.bright}${colors.blue}  Beyond Medium Test Runner${colors.reset}`);
console.log(`${colors.bright}${colors.blue}================================${colors.reset}`);
console.log();

const results = [];
const startTime = Date.now();

// Run each test category
for (const category of testCategories) {
  console.log(`${colors.bright}${colors.cyan}Running ${category.name}${colors.reset}`);
  console.log(`${colors.dim}${category.description}${colors.reset}`);
  console.log(`${colors.dim}Command: ${category.command}${colors.reset}`);
  console.log();

  try {
    // Execute the test command
    const output = execSync(category.command, { encoding: 'utf8' });
    
    // Check for test results
    const passedMatch = output.match(/(\d+) passed/);
    const failedMatch = output.match(/(\d+) failed/);
    const skippedMatch = output.match(/(\d+) skipped/);
    
    const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
    const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
    const skipped = skippedMatch ? parseInt(skippedMatch[1]) : 0;
    const total = passed + failed + skipped;
    
    results.push({
      category: category.name,
      passed,
      failed,
      skipped,
      total,
      success: failed === 0,
      output: output
    });
    
    // Output summary
    if (failed === 0) {
      console.log(`${colors.green}✓ All tests passed! (${passed} total)${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${failed} tests failed (${passed} passed)${colors.reset}`);
    }
    
    console.log();
  } catch (error) {
    // If the tests fail, the command will throw an error
    console.log(`${colors.red}✗ Tests failed with error${colors.reset}`);
    console.log(error.stdout.toString());
    
    results.push({
      category: category.name,
      passed: 0,
      failed: 1,
      skipped: 0,
      total: 1,
      success: false,
      output: error.stdout.toString()
    });
  }
  
  console.log(`${colors.bright}${colors.blue}--------------------------------${colors.reset}`);
  console.log();
}

// Calculate total time
const endTime = Date.now();
const duration = (endTime - startTime) / 1000;

// Calculate overall results
const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
const totalFailed = results.reduce((sum, result) => sum + result.failed, 0);
const totalSkipped = results.reduce((sum, result) => sum + result.skipped, 0);
const totalTests = totalPassed + totalFailed + totalSkipped;
const allPassed = totalFailed === 0;

// Display summary
console.log(`${colors.bright}${colors.blue}================================${colors.reset}`);
console.log(`${colors.bright}${colors.blue}  Test Summary${colors.reset}`);
console.log(`${colors.bright}${colors.blue}================================${colors.reset}`);
console.log();

console.log(`${colors.bright}Total Tests: ${totalTests}${colors.reset}`);
console.log(`${colors.green}Passed: ${totalPassed}${colors.reset}`);
if (totalFailed > 0) {
  console.log(`${colors.red}Failed: ${totalFailed}${colors.reset}`);
}
if (totalSkipped > 0) {
  console.log(`${colors.yellow}Skipped: ${totalSkipped}${colors.reset}`);
}
console.log(`Total Time: ${duration.toFixed(2)} seconds`);
console.log();

// Overall result
if (allPassed) {
  console.log(`${colors.bright}${colors.green}✓ All tests passed!${colors.reset}`);
  console.log(`${colors.green}The application is ready for deployment.${colors.reset}`);
} else {
  console.log(`${colors.bright}${colors.red}✗ Some tests failed!${colors.reset}`);
  console.log(`${colors.red}Please fix the failing tests before deploying.${colors.reset}`);
  process.exit(1);
}

// Save test results to a file
const reportDir = path.join(process.cwd(), 'test-reports');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const reportPath = path.join(reportDir, `test-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
fs.writeFileSync(reportPath, JSON.stringify({
  date: new Date().toISOString(),
  duration,
  totalTests,
  totalPassed,
  totalFailed,
  totalSkipped,
  allPassed,
  results
}, null, 2));

console.log(`\nTest report saved to: ${reportPath}`); 