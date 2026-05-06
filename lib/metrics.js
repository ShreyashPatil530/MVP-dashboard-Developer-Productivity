/**
 * Metrics Calculation Logic
 */

export function calculateLeadTime(prs, deployments) {
  if (!prs.length || !deployments.length) return 0;

  const leadTimes = prs.map(pr => {
    const mergeTime = new Date(pr.merged_time);
    const openedTime = new Date(pr.opened_time);
    
    // Find the first deployment after merge
    const nextDeployment = deployments
      .map(d => new Date(d.deploy_time))
      .filter(d => d >= mergeTime)
      .sort((a, b) => a - b)[0];

    if (!nextDeployment) return 0;

    // Lead time = Time from PR opened to Deployment
    return (nextDeployment - openedTime) / (1000 * 60 * 60 * 24); // in days
  }).filter(lt => lt > 0);

  if (!leadTimes.length) return 0;
  return (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length).toFixed(1);
}

export function calculateCycleTime(issues) {
  const completedIssues = issues.filter(i => i.status === 'done' && i.end_time);
  if (!completedIssues.length) return 0;

  const cycleTimes = completedIssues.map(issue => {
    const start = new Date(issue.start_time);
    const end = new Date(issue.end_time);
    return (end - start) / (1000 * 60 * 60 * 24); // in days
  });

  return (cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length).toFixed(1);
}

export function calculateBugRate(bugs, completedIssues) {
  if (!completedIssues.length) return 0;
  return ((bugs.length / completedIssues.length) * 100).toFixed(1);
}

export function calculateDeploymentFrequency(deployments) {
  if (!deployments.length) return 0;
  
  // Assume a 30-day window for the dashboard
  const days = 30;
  const frequencyPerWeek = (deployments.length / days) * 7;
  return frequencyPerWeek.toFixed(1);
}

export function calculatePRThroughput(prs) {
  return prs.filter(pr => pr.merged_time).length;
}
