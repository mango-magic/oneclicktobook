"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Shield, Clock, Users, Sparkles, Rocket, Target, Moon, Sun, ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTryItNow = () => {
    router.push("/onboarding")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background luxury-pattern">
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="elegant-glow sophisticated-hover elegant-border"
        >
          {theme === "dark" ? <Sun className="h-5 w-5 text-secondary" /> : <Moon className="h-5 w-5 text-primary" />}
        </Button>
      </div>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-8 font-serif font-semibold text-base px-8 py-3 bg-primary/10 text-primary border-primary/20 sophisticated-hover">
                The Anti-Calendly
              </Badge>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif elegant-title mb-8 luxury-gradient">
                OneClickToBook.Me
              </h1>

              <p className="text-xl md:text-2xl font-sans refined-text text-muted-foreground mb-12 max-w-3xl leading-relaxed">
                The fastest way to stop scheduling like a cave-dweller. Elegant simplicity meets powerful functionality.
              </p>

              <div className="flex flex-col gap-6 justify-center lg:justify-start mb-16">
                <Button
                  size="lg"
                  onClick={handleTryItNow}
                  className="elegant-glow luxury-button font-serif font-semibold text-xl px-12 py-6 bg-primary hover:bg-primary/90 group"
                >
                  <Zap className="mr-3 h-6 w-6" />
                  Try It Now
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-sm font-sans text-muted-foreground text-center lg:text-left">
                  Takes 30 seconds. No credit card. No bullshit.
                </p>
              </div>
            </div>

            {/* Right content - Simplified 3D Scene Placeholder */}
            <div className="relative h-[600px] lg:h-[700px]">
              <Card className="w-full h-full bg-background/50 backdrop-blur-sm relative overflow-hidden elegant-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary/40 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm font-sans text-muted-foreground">Interactive 3D Scene</p>
                    <p className="text-xs text-muted-foreground/60">Coming Soon</p>
                  </div>
                </div>

                {/* Overlay text */}
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <p className="text-sm font-sans text-muted-foreground/80 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
                    Interactive Experience
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif elegant-title mb-8 text-primary">
              Tired of playing Calendar Jenga?
            </h2>
            <p className="text-xl font-sans refined-text text-muted-foreground">Let's talk about the chaos:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Target className="h-10 w-10 text-primary" />,
                title: "Email Hell",
                desc: "Endless back-and-forth emails like it's 2006.",
                bgColor: "bg-primary/10",
                textColor: "text-primary",
              },
              {
                icon: <Sparkles className="h-10 w-10 text-secondary" />,
                title: "Link Spam",
                desc: "People sending their Calendly link like it's a power move.",
                bgColor: "bg-secondary/10",
                textColor: "text-secondary",
              },
              {
                icon: <Shield className="h-10 w-10 text-primary" />,
                title: "Form Assault",
                desc: "27 time slots, timezone dropdowns, and 'what are your goals?' forms.",
                bgColor: "bg-primary/10",
                textColor: "text-primary",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className={`premium-card sophisticated-hover elegant-animation fade-in-elegant stagger-${index + 1}`}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div
                      className={`w-20 h-20 rounded-full ${item.bgColor} flex items-center justify-center elegant-glow`}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <h3 className={`text-xl font-serif font-semibold mb-4 ${item.textColor}`}>{item.title}</h3>
                  <p className="font-sans refined-text text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <h3 className="text-3xl font-serif elegant-title text-primary luxury-gradient">Burn it all down.</h3>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif elegant-title mb-6 text-foreground">
              How it works (but like, simply)
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "1",
                title: "Generate Smart Link",
                desc: "You generate a Smart Link with your availability rules.",
                icon: <Zap className="h-8 w-8" />,
                bgColor: "bg-primary/10",
                textColor: "text-primary",
              },
              {
                step: "2",
                title: "One-Time Access",
                desc: 'They click "Use My Calendar" and grant 1-time access to their free/busy data.',
                icon: <Shield className="h-8 w-8" />,
                bgColor: "bg-secondary/10",
                textColor: "text-secondary",
              },
              {
                step: "3",
                title: "Instant Matching",
                desc: "We find overlaps instantly.",
                icon: <Clock className="h-8 w-8" />,
                bgColor: "bg-primary/10",
                textColor: "text-primary",
              },
              {
                step: "4",
                title: "Pick & Book",
                desc: "They pick a time. Meeting goes on your calendar. Theirs too. Everyone shuts up.",
                icon: <Users className="h-8 w-8" />,
                bgColor: "bg-secondary/10",
                textColor: "text-secondary",
              },
            ].map((item, index) => (
              <Card key={index} className="premium-card sophisticated-hover">
                <CardContent className="p-8">
                  <div className="flex items-start gap-8">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-full ${item.bgColor} flex items-center justify-center elegant-glow`}
                      >
                        <span className={`text-2xl font-serif font-bold ${item.textColor}`}>{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={item.textColor}>{item.icon}</div>
                        <h3 className="text-xl font-serif font-semibold text-foreground">{item.title}</h3>
                      </div>
                      <p className="font-sans refined-text text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif elegant-title mb-8 luxury-gradient">
              Ready to stop the scheduling madness?
            </h2>
            <p className="text-xl font-sans refined-text text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands who've already ditched the calendar chaos. Create your first Smart Link in under a minute.
            </p>
            <div className="space-y-6">
              <Button
                size="lg"
                onClick={handleTryItNow}
                className="elegant-glow luxury-button font-serif font-semibold text-xl px-16 py-6 bg-primary hover:bg-primary/90 group"
              >
                <Rocket className="mr-3 h-6 w-6" />
                Try It Now
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center justify-center gap-6 text-sm font-sans text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  Free forever
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  30-second setup
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  No forms to fill
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
