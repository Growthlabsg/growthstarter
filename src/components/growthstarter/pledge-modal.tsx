"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Project, Reward } from "@/types"
import { 
  Heart, 
  Check, 
  CreditCard, 
  Gift, 
  Users, 
  Clock, 
  AlertCircle,
  Sparkles,
  ChevronRight
} from "lucide-react"

interface PledgeModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onPledge: (amount: number, reward?: Reward) => void
  selectedRewardId?: string
}

export function PledgeModal({ 
  project, 
  isOpen, 
  onClose, 
  onPledge,
  selectedRewardId 
}: PledgeModalProps) {
  const [customAmount, setCustomAmount] = useState("")
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [step, setStep] = useState<"select" | "payment" | "success">("select")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!project) return null

  const fundingPercentage = Math.min(100, Math.round((project.raised / project.goal) * 100))

  const handleRewardSelect = (reward: Reward) => {
    setSelectedReward(reward)
    setCustomAmount(reward.amount.toString())
  }

  const handlePledge = async () => {
    const amount = parseFloat(customAmount) || 0
    if (amount < (project.minimumPledge || 1)) return

    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsProcessing(false)
    setStep("success")
    
    // Call the onPledge callback
    onPledge(amount, selectedReward || undefined)
  }

  const handleClose = () => {
    setStep("select")
    setSelectedReward(null)
    setCustomAmount("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#0F7377]" />
                Back this project
              </DialogTitle>
            </DialogHeader>

            {/* Project Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
              <div className="flex gap-4">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                  <p className="text-sm text-slate-500">by {project.creator.name}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#0F7377] font-semibold">{fundingPercentage}% funded</span>
                      <span className="text-slate-500">{project.daysLeft} days left</span>
                    </div>
                    <Progress value={fundingPercentage} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Pledge */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Enter your pledge amount
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedReward(null)
                    }}
                    placeholder="0"
                    className="pl-8 text-lg font-semibold"
                    min={project.minimumPledge || 1}
                  />
                </div>
                <Button
                  onClick={() => setStep("payment")}
                  disabled={!customAmount || parseFloat(customAmount) < (project.minimumPledge || 1)}
                  className="gs-gradient text-white px-6"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Minimum pledge: ${project.minimumPledge || 1} • Pledge without a reward
              </p>
            </div>

            <Separator className="my-4" />

            {/* Rewards */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Gift className="h-4 w-4 text-[#0F7377]" />
                Select a reward
              </h4>
              
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                {project.rewards.map((reward) => {
                  const limitCount = reward.limitCount ?? 0
                  const isLimited = reward.limited && limitCount > 0
                  const isSoldOut = isLimited && reward.claimedCount != null && reward.claimedCount >= limitCount
                  const remaining = isLimited ? limitCount - (reward.claimedCount || 0) : null
                  const isSelected = selectedReward?.id === reward.id
                  
                  return (
                    <button
                      key={reward.id}
                      onClick={() => !isSoldOut && handleRewardSelect(reward)}
                      disabled={isSoldOut}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#0F7377] bg-[#0F7377]/5'
                          : isSoldOut
                          ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-700 hover:border-[#0F7377]/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-[#0F7377]">${reward.amount}</span>
                            {isSelected && (
                              <Check className="h-5 w-5 text-[#0F7377]" />
                            )}
                          </div>
                          <h5 className="font-semibold text-slate-900 dark:text-white">{reward.title}</h5>
                        </div>
                        {isLimited && (
                          <Badge variant={isSoldOut ? "secondary" : "outline"} className="text-xs">
                            {isSoldOut ? 'Sold Out' : `${remaining} left`}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {reward.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {reward.estimatedDelivery && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Est. {reward.estimatedDelivery}
                          </span>
                        )}
                        {reward.claimedCount && reward.claimedCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {reward.claimedCount} backers
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#0F7377]" />
                Complete your pledge
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Pledge amount</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">${customAmount}</span>
                </div>
                {selectedReward && (
                  <div className="text-sm text-slate-500">
                    Reward: {selectedReward.title}
                  </div>
                )}
              </div>

              {/* Payment Form (Simulated) */}
              <div className="space-y-4">
                <div>
                  <Label>Card Number</Label>
                  <Input placeholder="4242 4242 4242 4242" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry Date</Label>
                    <Input placeholder="MM/YY" className="mt-1" />
                  </div>
                  <div>
                    <Label>CVC</Label>
                    <Input placeholder="123" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Name on Card</Label>
                  <Input placeholder="John Doe" className="mt-1" />
                </div>
              </div>

              {/* Info */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-sm flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 dark:text-amber-200">
                  You won&apos;t be charged unless this project reaches its funding goal by {project.endDate}.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handlePledge}
                  disabled={isProcessing}
                  className="flex-1 gs-gradient text-white"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pledge ${customAmount}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="w-20 h-20 gs-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Thank you for your support!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Your pledge of <span className="font-semibold text-[#0F7377]">${customAmount}</span> to{" "}
              <span className="font-semibold">{project.title}</span> has been confirmed.
            </p>
            {selectedReward && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-slate-500 mb-1">Your reward</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedReward.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedReward.description}</p>
              </div>
            )}
            <Button onClick={handleClose} className="gs-gradient text-white px-8">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

