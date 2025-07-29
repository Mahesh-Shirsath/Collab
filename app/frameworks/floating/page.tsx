"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, RotateCcw, Copy, Download, Zap, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface FloatingConfig {
  taskName: string
  environment: string
  workers: string
  timeout: string
  configFile: string
  logLevel: string
  outputDir: string
  customParams: string
}

export default function FloatingPage() {
  const [config, setConfig] = useState<FloatingConfig>({
    taskName: "",
    environment: "dev",
    workers: "1",
    timeout: "60",
    configFile: "",
    logLevel: "info",
    outputDir: "./output",
    customParams: "",
  })

  const [isExecuting, setIsExecuting] = useState(false)
  const [executionOutput, setExecutionOutput] = useState("")
  const [generatedCommand, setGeneratedCommand] = useState("")
  const { toast } = useToast()
  const [buildId, setBuildId] = useState("")
  const [jenkinsJob] = useState("floating-execution-pipeline")

  const handleConfigChange = (key: keyof FloatingConfig, value: string) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    generateCommand(newConfig)
  }

  const generateCommand = (currentConfig: FloatingConfig) => {
    let command = "floating execute"
    if (currentConfig.taskName) command += ` --task="${currentConfig.taskName}"`
    if (currentConfig.environment) command += ` --env=${currentConfig.environment}`
    if (currentConfig.workers && currentConfig.workers !== "1") command += ` --workers=${currentConfig.workers}`
    if (currentConfig.timeout) command += ` --timeout=${currentConfig.timeout}s`
    if (currentConfig.configFile) command += ` --config="${currentConfig.configFile}"`
    if (currentConfig.logLevel) command += ` --verbose=${currentConfig.logLevel}`
    if (currentConfig.outputDir) command += ` --output-dir="${currentConfig.outputDir}"`
    if (currentConfig.customParams) command += ` ${currentConfig.customParams}`

    setGeneratedCommand(command)
  }

  const executeCommand = async () => {
    if (!generatedCommand) {
      toast({
        title: "No Command Generated",
        description: "Please configure the Floating parameters first.",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setExecutionOutput("Triggering Floating Jenkins pipeline...\n")

    // Generate build ID
    const newBuildId = `FLOATING-${Date.now()}`
    setBuildId(newBuildId)

    // Store pipeline info in localStorage for tracking
    const pipelineInfo = {
      id: newBuildId,
      type: "Floating Framework",
      status: "running",
      startTime: new Date().toISOString(),
      config: config,
      command: generatedCommand,
      jenkinsJob: jenkinsJob,
    }

    const existingPipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
    existingPipelines.unshift(pipelineInfo)
    localStorage.setItem("pipelines", JSON.stringify(existingPipelines))

    const steps = [
      "Connecting to Jenkins server...",
      "Validating Floating parameters...",
      "Starting Floating execution pipeline...",
      "Initializing dynamic task environment...",
      "Setting up worker configurations...",
      "Executing floating tasks...",
      "Processing with multiple workers...",
      "Optimizing resource allocation...",
      "Collecting execution results...",
      "Floating pipeline execution completed successfully!",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setExecutionOutput((prev) => prev + `[${new Date().toLocaleTimeString()}] ${steps[i]}\n`)
    }

    // Update pipeline status
    const updatedPipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
    const pipelineIndex = updatedPipelines.findIndex((p: any) => p.id === newBuildId)
    if (pipelineIndex !== -1) {
      updatedPipelines[pipelineIndex].status = "completed"
      updatedPipelines[pipelineIndex].endTime = new Date().toISOString()
      localStorage.setItem("pipelines", JSON.stringify(updatedPipelines))
    }

    setIsExecuting(false)
    toast({
      title: "Floating Pipeline Complete",
      description: "Jenkins pipeline executed successfully.",
    })
  }

  const copyCommand = () => {
    navigator.clipboard.writeText(generatedCommand)
    toast({
      title: "Command Copied",
      description: "Floating command has been copied to clipboard.",
    })
  }

  const resetConfig = () => {
    setConfig({
      taskName: "",
      environment: "dev",
      workers: "1",
      timeout: "60",
      configFile: "",
      logLevel: "info",
      outputDir: "./output",
      customParams: "",
    })
    setGeneratedCommand("")
    setExecutionOutput("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-100">
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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Floating Framework</h1>
                  <p className="text-sm text-gray-600">Dynamic Task Execution Framework</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Framework Info */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Floating Configuration</CardTitle>
              <CardDescription>Configure parameters for Floating dynamic task execution framework</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskName">Task Name</Label>
                  <Input
                    id="taskName"
                    placeholder="e.g., data-processing"
                    value={config.taskName}
                    onChange={(e) => handleConfigChange("taskName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select
                    value={config.environment}
                    onValueChange={(value) => handleConfigChange("environment", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="prod">Production</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workers">Workers</Label>
                  <Input
                    id="workers"
                    type="number"
                    min="1"
                    max="20"
                    value={config.workers}
                    onChange={(e) => handleConfigChange("workers", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    min="30"
                    max="600"
                    value={config.timeout}
                    onChange={(e) => handleConfigChange("timeout", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select value={config.logLevel} onValueChange={(value) => handleConfigChange("logLevel", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="configFile">Config File Path</Label>
                  <Input
                    id="configFile"
                    placeholder="e.g., ./config/floating.yml"
                    value={config.configFile}
                    onChange={(e) => handleConfigChange("configFile", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outputDir">Output Directory</Label>
                  <Input
                    id="outputDir"
                    value={config.outputDir}
                    onChange={(e) => handleConfigChange("outputDir", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customParams">Custom Parameters</Label>
                <Textarea
                  id="customParams"
                  placeholder="Add any additional Floating command line parameters..."
                  value={config.customParams}
                  onChange={(e) => handleConfigChange("customParams", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generated Command */}
          {generatedCommand && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Floating Command</CardTitle>
                <CardDescription>Review the generated command before execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                  <pre className="whitespace-pre-wrap break-all">{generatedCommand}</pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-green-400 hover:text-green-300"
                    onClick={copyCommand}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Execution Controls */}
          {generatedCommand && (
            <Card>
              <CardHeader>
                <CardTitle>Execution Controls</CardTitle>
                <CardDescription>Execute the configured Floating command</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={executeCommand} disabled={isExecuting} className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>{isExecuting ? "Executing..." : "Execute Floating"}</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={resetConfig}
                    disabled={isExecuting}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Configuration</span>
                  </Button>

                  {executionOutput && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([executionOutput], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "floating-execution-log.txt"
                        a.click()
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Log</span>
                    </Button>
                  )}
                  {buildId && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(`https://jenkins.example.com/job/${jenkinsJob}/${buildId}/console`, "_blank")
                      }
                      className="flex items-center space-x-2 bg-transparent"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Jenkins Console</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Execution Output */}
          {executionOutput && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Floating Execution Output</span>
                  {isExecuting && (
                    <Badge variant="secondary" className="animate-pulse">
                      Running
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Real-time output from Floating execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{executionOutput}</pre>
                  {isExecuting && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Executing Floating...</span>
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
