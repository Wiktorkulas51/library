import { ScrollFadeEffect } from "@/components/integrations/21st/scroll-fade-effect.component"

const items = Array.from({ length: 20 }, (_, i) => {
  const emojis = ["🎨", "⚡", "🌊", "🔥", "✨", "🎯", "🚀", "💎", "🌙", "🎪"]
  return { id: i, label: `Item ${i + 1}`, emoji: emojis[i % emojis.length]! }
})

export default function Demo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Vertical</p>
          <ScrollFadeEffect className="h-64 w-48 rounded-xl border border-border bg-card">
            <div className="flex flex-col gap-2 p-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </ScrollFadeEffect>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Horizontal</p>
          <ScrollFadeEffect orientation="horizontal" className="w-64 rounded-xl border border-border bg-card">
            <div className="flex gap-2 p-3">
              {items.map((item) => (
                <div key={item.id} className="flex shrink-0 flex-col items-center gap-1 rounded-lg bg-muted/50 px-4 py-3 text-sm">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </ScrollFadeEffect>
        </div>
      </div>
    </div>
  )
}

