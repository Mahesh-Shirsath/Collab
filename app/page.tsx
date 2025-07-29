"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Zap, Settings, Wrench, Sparkles, Activity } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const frameworks = [
    {
      id: "jtaf",
      title: "JTAF Framework",
      description: "Java Test Automation Framework for comprehensive testing solutions",
      icon: Settings,
      color: "blue",
      href: "/frameworks/jtaf",
      features: ["Test Execution", "Parallel Processing", "Advanced Reporting"],
    },
    {
      id: "floating",
      title: "Floating Framework",
      description: "Lightweight and flexible framework for dynamic task execution",
      icon: Zap,
      color: "purple",
      href: "/frameworks/floating",
      features: ["Dynamic Loading", "Resource Optimization", "Cloud Integration"],
    },
    {
      id: "os-making",
      title: "OS Making",
      description: "Automated OS image creation and deployment via Jenkins pipeline",
      icon: Wrench,
      color: "green",
      href: "/os-making",
      features: ["Jenkins Integration", "Automated Builds", "Image Deployment"],
    },
    {
      id: "code-generation",
      title: "Code Generation",
      description: "AI-powered code generation for multiple programming languages",
      icon: Sparkles,
      color: "orange",
      href: "/code-generation",
      features: ["Multi-language Support", "Template Generation", "Best Practices"],
    },
    {
      id: "pipeline-tracker",
      title: "Pipeline Tracker",
      description: "Monitor and track all Jenkins pipeline executions across frameworks",
      icon: Activity,
      color: "indigo",
      href: "/pipelines",
      features: ["Real-time Monitoring", "Execution History", "Status Tracking"],
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "hover:border-blue-200",
        badge: "bg-blue-50 text-blue-700",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "hover:border-purple-200",
        badge: "bg-purple-50 text-purple-700",
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "hover:border-green-200",
        badge: "bg-green-50 text-green-700",
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        border: "hover:border-orange-200",
        badge: "bg-orange-50 text-orange-700",
      },
      indigo: {
        bg: "bg-indigo-100",
        text: "text-indigo-600",
        border: "hover:border-indigo-200",
        badge: "bg-indigo-50 text-indigo-700",
      },
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Framework Hub</h1>
                <p className="text-sm text-gray-600">Development Solutions Platform</p>
              </div>
            </Link>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Zap className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Development Solution
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access powerful frameworks, automated OS creation, and AI-powered code generation tools. Select a solution
            below to get started with your development workflow.
          </p>
        </div>

        {/* Framework Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {frameworks.map((framework) => {
            const colorClasses = getColorClasses(framework.color)
            const IconComponent = framework.icon

            return (
              <Link key={framework.id} href={framework.href}>
                <Card
                  className={`h-full border-2 ${colorClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                      </div>
                      <Badge variant="outline" className={`${colorClasses.badge} border-0`}>
                        Ready
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {framework.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {framework.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Key Features</h4>
                      <div className="space-y-2">
                        {framework.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className={`w-1.5 h-1.5 ${colorClasses.bg} rounded-full mr-3`}></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className={`text-sm font-medium ${colorClasses.text} group-hover:underline`}>
                        Access Framework →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
            <div className="text-sm text-gray-600">Testing Frameworks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
            <div className="text-sm text-gray-600">OS Builder</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
            <div className="text-sm text-gray-600">AI Code Generator</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
            <div className="text-sm text-gray-600">Pipeline Tracker</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Availability</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Framework Hub. Built for efficient development workflows.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
