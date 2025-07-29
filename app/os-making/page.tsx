"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, RotateCcw, Download, Wrench, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface OSConfig {
  osType: string
  version: string
  architecture: string
  packages: string
  customizations: string
  jenkinsJob: string
  buildParams: string
}

export default function OSMakingPage() {
  const [config, setConfig] = useState<OSConfig>({
    osType: "ubuntu",
    version: "22.04",
    architecture: "x86_64",
    packages: "",
    customizations: "",
    jenkinsJob: "os-builder-pipeline",
    buildParams: "",
  })

  const [isBuilding, setIsBuilding] = useState(false)
  const [buildOutput, setBuildOutput] = useState("")
  const [buildId, setBuildId] = useState("")
  const { toast } = useToast()

  const handleConfigChange = (key: keyof OSConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const triggerJenkinsBuild = async () => {
    if (!config.osType || !config.version) {
      toast({
        title: "Configuration Required",
        description: "Please select OS type and version before building.",
        variant: "destructive",
      })
      return
    }

    setIsBuilding(true)
    setBuildOutput("Triggering OS Making Jenkins pipeline...\n")

    // Generate build ID
    const newBuildId = `OS-${Date.now()}`
    setBuildId(newBuildId)

    // Store pipeline info in localStorage for tracking
    const pipelineInfo = {
      id: newBuildId,
      type: "OS Making",
      status: "running",
      startTime: new Date().toISOString(),
      config: config,
      jenkinsJob: config.jenkinsJob,
    }

    const existingPipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
    existingPipelines.unshift(pipelineInfo)
    localStorage.setItem("pipelines", JSON.stringify(existingPipelines))

    const steps = [
      "Connecting to Jenkins server...",
      "Validating build parameters...",
      "Starting OS image creation pipeline...",
      "Setting up base OS environment...",
      "Installing selected packages...",
      "Applying customizations...",
      "Building OS image...",
      "Running image validation tests...",
      "Compressing and packaging image...",
      "OS image build completed successfully!",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setBuildOutput((prev) => prev + `[${new Date().toLocaleTimeString()}] ${steps[i]}\n`)
    }

    // Update pipeline status
    const updatedPipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
    const pipelineIndex = updatedPipelines.findIndex((p: any) => p.id === newBuildId)
    if (pipelineIndex !== -1) {
      updatedPipelines[pipelineIndex].status = "completed"
      updatedPipelines[pipelineIndex].endTime = new Date().toISOString()
      localStorage.setItem("pipelines", JSON.stringify(updatedPipelines))
    }

    setIsBuilding(false)
    toast({
      title: "OS Build Complete",
      description: "Operating system image has been built successfully.",
    })
  }

  const resetConfig = () => {
    setConfig({
      osType: "ubuntu",
      version: "22.04",
      architecture: "x86_64",
      packages: "",
      customizations: "",
      jenkinsJob: "os-builder-pipeline",
      buildParams: "",
    })
    setBuildOutput("")
    setBuildId("")
  }

  const openJenkinsConsole = () => {
    // In a real implementation, this would open the actual Jenkins build console
    window.open(`https://jenkins.example.com/job/${config.jenkinsJob}/${buildId}/console`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Hub</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">OS Making</h1>
                  <p className="text-sm text-gray-600">Automated OS Image Creation</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Jenkins Ready
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* OS Configuration */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">OS Image Configuration</CardTitle>
              <CardDescription>Configure the operating system image to be built via Jenkins pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="osType">Operating System</Label>
                  <Select value={config.osType} onValueChange={(value) => handleConfigChange("osType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ubuntu">Ubuntu</SelectItem>
                      <SelectItem value="centos">CentOS</SelectItem>
                      <SelectItem value="debian">Debian</SelectItem>
                      <SelectItem value="rhel">Red Hat Enterprise Linux</SelectItem>
                      <SelectItem value="alpine">Alpine Linux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Select value={config.version} onValueChange={(value) => handleConfigChange("version", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.osType === "ubuntu" && (
                        <>
                          <SelectItem value="22.04">22.04 LTS</SelectItem>
                          <SelectItem value="20.04">20.04 LTS</SelectItem>
                          <SelectItem value="18.04">18.04 LTS</SelectItem>
                        </>
                      )}
                      {config.osType === "centos" && (
                        <>
                          <SelectItem value="8">CentOS 8</SelectItem>
                          <SelectItem value="7">CentOS 7</SelectItem>
                        </>
                      )}
                      {config.osType === "debian" && (
                        <>
                          <SelectItem value="11">Debian 11</SelectItem>
                          <SelectItem value="10">Debian 10</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="architecture">Architecture</Label>
                  <Select
                    value={config.architecture}
                    onValueChange={(value) => handleConfigChange("architecture", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="x86_64">x86_64</SelectItem>
                      <SelectItem value="arm64">ARM64</SelectItem>
                      <SelectItem value="i386">i386</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenkinsJob">Jenkins Job</Label>
                  <Input
                    id="jenkinsJob"
                    value={config.jenkinsJob}
                    onChange={(e) => handleConfigChange("jenkinsJob", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packages">Additional Packages</Label>
                <Textarea
                  id="packages"
                  placeholder="Enter package names separated by spaces or new lines (e.g., docker nginx git python3)"
                  value={config.packages}
                  onChange={(e) => handleConfigChange("packages", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customizations">Custom Scripts & Configurations</Label>
                <Textarea
                  id="customizations"
                  placeholder="Enter custom shell commands or configuration changes..."
                  value={config.customizations}
                  onChange={(e) => handleConfigChange("customizations", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildParams">Jenkins Build Parameters</Label>
                <Textarea
                  id="buildParams"
                  placeholder="Additional Jenkins build parameters (JSON format)"
                  value={config.buildParams}
                  onChange={(e) => handleConfigChange("buildParams", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Build Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Build Summary</CardTitle>
              <CardDescription>Review your OS image configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">OS Type:</span>
                    <Badge variant="outline">{config.osType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Version:</span>
                    <Badge variant="outline">{config.version}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Architecture:</span>
                    <Badge variant="outline">{config.architecture}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Jenkins Job:</span>
                    <Badge variant="outline">{config.jenkinsJob}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Packages:</span>
                    <Badge variant="outline">{config.packages ? "Custom" : "Default"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Customizations:</span>
                    <Badge variant="outline">{config.customizations ? "Yes" : "None"}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Build Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Build Controls</CardTitle>
              <CardDescription>Trigger Jenkins pipeline to build OS image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={triggerJenkinsBuild} disabled={isBuilding} className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>{isBuilding ? "Building..." : "Start Build"}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={resetConfig}
                  disabled={isBuilding}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Configuration</span>
                </Button>

                {buildId && (
                  <Button
                    variant="outline"
                    onClick={openJenkinsConsole}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Jenkins Console</span>
                  </Button>
                )}

                {buildOutput && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([buildOutput], { type: "text/plain" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = "os-build-log.txt"
                      a.click()
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Log</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Build Output */}
          {buildOutput && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Jenkins Build Output</span>
                  {isBuilding && (
                    <Badge variant="secondary" className="animate-pulse">
                      Building
                    </Badge>
                  )}
                  {buildId && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {buildId}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Real-time output from Jenkins pipeline execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{buildOutput}</pre>
                  {isBuilding && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Building OS image...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
