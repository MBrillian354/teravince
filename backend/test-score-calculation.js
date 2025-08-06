// Test script for KPI score calculation
const mongoose = require('mongoose');

// Calculate task score based on KPI performance
const calculateTaskScore = (kpis) => {
  if (!kpis || !Array.isArray(kpis) || kpis.length === 0) {
    return 0;
  }

  let totalScore = 0;
  let validKpis = 0;

  kpis.forEach(kpi => {
    const { targetAmount, achievedAmount, operator } = kpi;
    
    // Skip KPIs with invalid data
    if (typeof targetAmount !== 'number' || typeof achievedAmount !== 'number') {
      return;
    }

    let kpiScore = 0;

    if (targetAmount === 0) {
      // If target is 0, consider it as 100% achievement
      kpiScore = 100;
    } else if (operator === 'greaterThan') {
      // For greaterThan: score = min(100, (achieved / target) * 100)
      kpiScore = Math.min(100, (achievedAmount / targetAmount) * 100);
    } else if (operator === 'lessThan') {
      // For lessThan: score = 100 if achieved <= target, otherwise decrease proportionally
      if (achievedAmount <= targetAmount) {
        // Perfect score if achieved is less than or equal to target
        kpiScore = 100;
      } else {
        // Score decreases as achieved exceeds target
        // Formula: 100 - ((achieved - target) / target) * 100
        const excessRatio = (achievedAmount - targetAmount) / targetAmount;
        kpiScore = Math.max(0, 100 - (excessRatio * 100));
      }
    }

    // Ensure score is between 0 and 100
    kpiScore = Math.max(0, Math.min(100, kpiScore));
    
    totalScore += kpiScore;
    validKpis++;
  });

  // Return average score, rounded to nearest integer
  return validKpis > 0 ? Math.round(totalScore / validKpis) : 0;
};

// Test cases
console.log('=== KPI Score Calculation Tests ===\n');

// Test case 1: Mixed KPIs
const testKpis1 = [
  { kpiTitle: 'Sales', targetAmount: 100, achievedAmount: 120, operator: 'greaterThan' },
  { kpiTitle: 'Costs', targetAmount: 50, achievedAmount: 40, operator: 'lessThan' },
  { kpiTitle: 'Time', targetAmount: 10, achievedAmount: 12, operator: 'lessThan' }
];

const score1 = calculateTaskScore(testKpis1);
console.log('Test 1 - Mixed KPIs:');
console.log('Sales (greaterThan): Target 100, Achieved 120 -> Expected: 100');
console.log('Costs (lessThan): Target 50, Achieved 40 -> Expected: 100 (achieved < target)');
console.log('Time (lessThan): Target 10, Achieved 12 -> Expected: 80 (20% excess)');
console.log('Overall Score:', score1, '(Expected: 93)\n');

// Test case 2: Perfect performance
const testKpis2 = [
  { kpiTitle: 'Revenue', targetAmount: 1000, achievedAmount: 1200, operator: 'greaterThan' },
  { kpiTitle: 'Errors', targetAmount: 5, achievedAmount: 2, operator: 'lessThan' }
];

const score2 = calculateTaskScore(testKpis2);
console.log('Test 2 - High Performance:');
console.log('Revenue (greaterThan): Target 1000, Achieved 1200 -> Expected: 100');
console.log('Errors (lessThan): Target 5, Achieved 2 -> Expected: 100 (achieved < target)');
console.log('Overall Score:', score2, '(Expected: 100)\n');

// Test case 3: Poor performance
const testKpis3 = [
  { kpiTitle: 'Sales', targetAmount: 100, achievedAmount: 50, operator: 'greaterThan' },
  { kpiTitle: 'Quality', targetAmount: 10, achievedAmount: 20, operator: 'lessThan' }
];

const score3 = calculateTaskScore(testKpis3);
console.log('Test 3 - Poor Performance:');
console.log('Sales (greaterThan): Target 100, Achieved 50 -> Expected: 50');
console.log('Quality (lessThan): Target 10, Achieved 20 -> Expected: 0 (100% excess)');
console.log('Overall Score:', score3, '(Expected: 25)\n');

// Test case 4: Edge case - zero target
const testKpis4 = [
  { kpiTitle: 'Special', targetAmount: 0, achievedAmount: 10, operator: 'greaterThan' }
];

const score4 = calculateTaskScore(testKpis4);
console.log('Test 4 - Zero Target:');
console.log('Special (greaterThan): Target 0, Achieved 10 -> Expected: 100');
console.log('Overall Score:', score4, '(Expected: 100)\n');

console.log('=== Test completed ===');
