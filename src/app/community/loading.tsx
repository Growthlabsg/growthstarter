export default function CommunityLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#0F7377] dark:border-teal-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      </div>
    </div>
  )
}
