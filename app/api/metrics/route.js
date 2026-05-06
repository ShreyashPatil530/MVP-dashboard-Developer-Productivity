import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  calculateLeadTime, 
  calculateCycleTime, 
  calculateBugRate, 
  calculateDeploymentFrequency, 
  calculatePRThroughput 
} from '@/lib/metrics';
import { generateInsights } from '@/lib/insights';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'data.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContents);

    const metrics = {
      leadTime: calculateLeadTime(data.pull_requests, data.deployments),
      cycleTime: calculateCycleTime(data.issues),
      bugRate: calculateBugRate(data.bugs, data.issues.filter(i => i.status === 'done')),
      deploymentFrequency: calculateDeploymentFrequency(data.deployments),
      prThroughput: calculatePRThroughput(data.pull_requests)
    };

    const insight = generateInsights(metrics);

    return NextResponse.json({
      developer: { 
        name: "Sample Test", 
        team: "Senior Software Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sample" 
      },


      metrics,
      insight,
      raw: data
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
