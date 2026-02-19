"use client"

import { useState } from "react"
import { Reward } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  X,
  Check,
  Minus,
  Gift,
  Calendar,
  Users,
  Sparkles,
  Star,
  ArrowRight,
  Info
} from "lucide-react"

interface RewardComparisonProps {
  rewards: Reward[]
  isOpen: boolean
  onClose: () => void
  onSelectReward: (rewardIndex: number) => void
}

export function RewardComparison({
  rewards,
  isOpen,
  onClose,
  onSelectReward
}: RewardComparisonProps) {
  const [selectedRewards, setSelectedRewards] = useState<number[]>([0, 1])

  const toggleReward = (index: number) => {
    if (selectedRewards.includes(index)) {
      if (selectedRewards.length > 2) {
        setSelectedRewards(selectedRewards.filter(i => i !== index))
      }
    } else {
      if (selectedRewards.length < 4) {
        setSelectedRewards([...selectedRewards, index])
      }
    }
  }

  // Get comparison features
  const allFeatures = new Set<string>()
  rewards.forEach(reward => {
    reward.includes?.forEach(item => allFeatures.add(item))
  })
  const featureList = Array.from(allFeatures)

  const comparedRewards = selectedRewards.map(i => rewards[i]).filter(Boolean)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-5xl !w-[95vw] max-h-[90vh] p-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  Compare Rewards
                </DialogTitle>
                <p className="text-sm text-slate-500">
                  Select up to 4 rewards to compare side by side
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Reward Selection */}
          <div className="flex flex-wrap gap-2 mt-4">
            {rewards.map((reward, index) => (
              <Button
                key={reward.id}
                variant={selectedRewards.includes(index) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleReward(index)}
                className={selectedRewards.includes(index) ? "gs-gradient text-white" : ""}
              >
                ${reward.amount} - {reward.title}
              </Button>
            ))}
          </div>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header Row */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="p-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400 w-48">
                  Features
                </th>
                {comparedRewards.map((reward, index) => (
                  <th key={reward.id} className="p-4 text-center min-w-[200px]">
                    <div className="space-y-2">
                      {index === comparedRewards.length - 1 && rewards.indexOf(reward) === rewards.length - 1 && (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 mb-2">
                          <Star className="h-3 w-3 mr-1" />
                          Best Value
                        </Badge>
                      )}
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        ${reward.amount}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {reward.title}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Description Row */}
              <tr className="bg-white dark:bg-slate-900">
                <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Description
                </td>
                {comparedRewards.map((reward) => (
                  <td key={reward.id} className="p-4 text-sm text-slate-600 dark:text-slate-400 text-center">
                    {reward.description}
                  </td>
                ))}
              </tr>

              {/* Delivery Row */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Est. Delivery
                </td>
                {comparedRewards.map((reward) => (
                  <td key={reward.id} className="p-4 text-sm text-slate-700 dark:text-slate-300 text-center font-medium">
                    {reward.estimatedDelivery || "TBD"}
                  </td>
                ))}
              </tr>

              {/* Backers Row */}
              <tr className="bg-white dark:bg-slate-900">
                <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Backers
                </td>
                {comparedRewards.map((reward) => (
                  <td key={reward.id} className="p-4 text-sm text-slate-700 dark:text-slate-300 text-center">
                    <span className="font-bold">{reward.claimedCount || 0}</span>
                    {reward.limited && (
                      <span className="text-slate-400"> / {reward.limitCount}</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Limited Row */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Availability
                </td>
                {comparedRewards.map((reward) => (
                  <td key={reward.id} className="p-4 text-center">
                    {reward.limited ? (
                      <Badge variant="destructive" className="text-xs">
                        {(reward.limitCount || 0) - (reward.claimedCount || 0)} left
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs">
                        Unlimited
                      </Badge>
                    )}
                  </td>
                ))}
              </tr>

              {/* Feature Rows */}
              {featureList.map((feature, fIndex) => (
                <tr 
                  key={feature} 
                  className={fIndex % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}
                >
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {feature}
                  </td>
                  {comparedRewards.map((reward) => (
                    <td key={reward.id} className="p-4 text-center">
                      {reward.includes?.includes(feature) ? (
                        <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                          <Minus className="h-4 w-4 text-slate-400" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Value Score Row */}
              <tr className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30">
                <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Value Score
                </td>
                {comparedRewards.map((reward, index) => {
                  // Calculate simple value score based on features per dollar
                  const featureCount = reward.includes?.length || 0
                  const valueScore = Math.round((featureCount / reward.amount) * 1000)
                  const isHighest = valueScore === Math.max(...comparedRewards.map(r => Math.round(((r.includes?.length || 0) / r.amount) * 1000)))
                  
                  return (
                    <td key={reward.id} className="p-4 text-center">
                      <div className={`text-2xl font-bold ${isHighest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {valueScore}
                        {isHighest && <span className="text-sm ml-1">⭐</span>}
                      </div>
                      <div className="text-xs text-slate-500">points per $</div>
                    </td>
                  )
                })}
              </tr>
            </tbody>

            {/* Action Row */}
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <td className="p-4"></td>
                {comparedRewards.map((reward) => {
                  const rewardIndex = rewards.indexOf(reward)
                  return (
                    <td key={reward.id} className="p-4 text-center">
                      <Button
                        className="gs-gradient text-white shadow-lg hover:shadow-xl transition-all"
                        onClick={() => {
                          onSelectReward(rewardIndex)
                          onClose()
                        }}
                      >
                        Select This Reward
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

