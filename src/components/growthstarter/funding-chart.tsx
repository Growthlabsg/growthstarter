"use client"

import { useMemo } from "react"
import { Project } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  DollarSign
} from "lucide-react"

interface FundingChartProps {
  project: Project
  showProjection?: boolean
}

// Generate mock historical funding data
function generateFundingHistory(project: Project) {
  const totalDays = 30 // Assume 30 day campaign
  const elapsedDays = totalDays - project.daysLeft
  const dailyTarget = project.goal / totalDays
  
  const data = []
  let cumulative = 0
  
  for (let day = 1; day <= elapsedDays; day++) {
    // Simulate realistic funding curve (usually front-loaded)
    const dayProgress = day / elapsedDays
    const curveFactor = dayProgress < 0.2 ? 1.5 : dayProgress > 0.8 ? 1.2 : 0.8
    const dailyAmount = (project.raised / elapsedDays) * curveFactor * (0.7 + Math.random() * 0.6)
    cumulative += dailyAmount
    
    data.push({
      day,
      date: `Day ${day}`,
      raised: Math.round(Math.min(cumulative, project.raised)),
      target: Math.round(dailyTarget * day),
      backers: Math.round((project.backers / elapsedDays) * day * (0.8 + Math.random() * 0.4))
    })
  }
  
  // Ensure last data point matches actual values
  if (data.length > 0) {
    data[data.length - 1].raised = project.raised
    data[data.length - 1].backers = project.backers
  }
  
  return data
}

// Project future funding
function projectFutureFunding(project: Project, history: ReturnType<typeof generateFundingHistory>) {
  const remainingDays = project.daysLeft
  const avgDailyRaise = history.length > 0 
    ? history.reduce((sum, d, i, arr) => i > 0 ? sum + (d.raised - arr[i-1].raised) : sum, 0) / (history.length - 1)
    : project.raised / (30 - remainingDays)
  
  const projection = []
  let lastRaised = project.raised
  const lastDay = history.length
  
  for (let i = 1; i <= remainingDays; i++) {
    // Slight decay in daily funding over time
    const decayFactor = Math.pow(0.98, i)
    lastRaised += avgDailyRaise * decayFactor * (0.8 + Math.random() * 0.4)
    projection.push({
      day: lastDay + i,
      date: `Day ${lastDay + i}`,
      projected: Math.round(lastRaised),
      target: Math.round((project.goal / 30) * (lastDay + i))
    })
  }
  
  return projection
}

export function FundingChart({ project, showProjection = true }: FundingChartProps) {
  const fundingHistory = useMemo(() => generateFundingHistory(project), [project])
  const fundingProjection = useMemo(() => 
    showProjection ? projectFutureFunding(project, fundingHistory) : [], 
    [project, fundingHistory, showProjection]
  )

  const combinedData = useMemo(() => {
    const combined = [...fundingHistory]
    if (showProjection && fundingProjection.length > 0) {
      // Add projection data with null raised values
      fundingProjection.forEach(p => {
        combined.push({
          ...p,
          raised: null as unknown as number,
          backers: null as unknown as number
        })
      })
    }
    return combined
  }, [fundingHistory, fundingProjection, showProjection])

  const projectedTotal = fundingProjection.length > 0 
    ? fundingProjection[fundingProjection.length - 1].projected 
    : project.raised
  
  const willMeetGoal = projectedTotal >= project.goal
  const percentOfGoal = Math.round((projectedTotal / project.goal) * 100)
  
  // Calculate trend
  const recentDays = fundingHistory.slice(-5)
  const trend = recentDays.length >= 2
    ? ((recentDays[recentDays.length - 1].raised - recentDays[0].raised) / recentDays[0].raised) * 100
    : 0

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
    return `$${value}`
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            Funding Progress
          </CardTitle>
          <div className="flex items-center gap-2">
            {trend > 0 ? (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{trend.toFixed(1)}% this week
              </Badge>
            ) : trend < 0 ? (
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <TrendingDown className="h-3 w-3 mr-1" />
                {trend.toFixed(1)}%
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <DollarSign className="h-4 w-4 mx-auto mb-1 text-teal-600" />
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(project.raised)}
            </div>
            <div className="text-xs text-slate-500">Current</div>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <Target className="h-4 w-4 mx-auto mb-1 text-purple-600" />
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(project.goal)}
            </div>
            <div className="text-xs text-slate-500">Goal</div>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <Calendar className="h-4 w-4 mx-auto mb-1 text-orange-600" />
            <div className={`text-lg font-bold ${willMeetGoal ? 'text-emerald-600' : 'text-amber-600'}`}>
              {formatCurrency(projectedTotal)}
            </div>
            <div className="text-xs text-slate-500">Projected</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F7377" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0F7377" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'raised' ? 'Raised' : name === 'projected' ? 'Projected' : 'Target'
                ]}
              />
              <ReferenceLine 
                y={project.goal} 
                stroke="#10B981" 
                strokeDasharray="5 5" 
                label={{ value: 'Goal', position: 'right', fontSize: 10, fill: '#10B981' }}
              />
              <Area
                type="monotone"
                dataKey="raised"
                stroke="#0F7377"
                strokeWidth={2}
                fill="url(#colorRaised)"
                dot={false}
                connectNulls={false}
              />
              {showProjection && (
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorProjected)"
                  dot={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="target"
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Projection Summary */}
        {showProjection && (
          <div className={`mt-4 p-3 rounded-lg ${
            willMeetGoal 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' 
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
          }`}>
            <p className="text-sm font-medium">
              {willMeetGoal 
                ? `🎉 On track to reach ${percentOfGoal}% of goal!`
                : `⚠️ Currently projected to reach ${percentOfGoal}% of goal`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

