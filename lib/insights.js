/**
 * Insight Engine Logic
 */

export function generateInsights(metrics) {
  const { cycleTime, prThroughput, bugRate, deploymentFrequency } = metrics;
  const insights = [];

  // Rule 1: High Cycle Time & Low Throughput
  if (parseFloat(cycleTime) > 3 && prThroughput < 10) {
    insights.push({
      title: "Delivery Bottleneck Detected",
      meaning: "Your average task is taking over 3 days to complete while PR volume is low. This suggests work might be getting stuck in large batches.",
      actions: [
        "Break down tasks into smaller, manageable sub-tasks",
        "Request earlier peer reviews to avoid end-of-cycle blockers",
        "Audit time spent in 'In Review' vs 'In Progress'"
      ],
      severity: "warning"
    });
  }

  // Rule 2: High Bug Rate
  if (parseFloat(bugRate) > 15) {
    insights.push({
      title: "Quality Stability Risk",
      meaning: "The current bug rate is higher than the 15% threshold. This indicates that new features might be introducing regressions.",
      actions: [
        "Increase unit test coverage for new components",
        "Implement a 'bug-bash' session before major releases",
        "Review common failure patterns in recent bugs"
      ],
      severity: "danger"
    });
  }

  // Rule 3: Low Deployment Frequency
  if (parseFloat(deploymentFrequency) < 2) {
    insights.push({
      title: "Slow Release Cadence",
      meaning: "Deployments are happening less than twice a week. This increases the risk per release and slows down feedback loops.",
      actions: [
        "Automate deployment pipelines to reduce manual effort",
        "Use feature flags to merge code without immediate exposure",
        "Aim for smaller, daily deployments to production"
      ],
      severity: "info"
    });
  }

  // Default fallback if no rules triggered
  if (insights.length === 0) {
    insights.push({
      title: "System Healthy",
      meaning: "All metrics are within optimal thresholds. Maintain current workflow practices.",
      actions: [
        "Continue consistent PR reviews",
        "Keep up the current deployment cadence"
      ],
      severity: "success"
    });
  }

  return insights[0]; // Return the most critical or first insight for the MVP
}
