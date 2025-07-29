"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FrameworkConfig {
  framework: "jtaf" | "floating" | ""
  testSuite?: string
  environment?: string
  browser?: string
  parallel?: string
  timeout?: string
  configFile?: string
  logLevel?: string
  outputDir?: string
  customParams?: string
}

export default function FrameworkExecutor() {
  const [config, setConfig] = useState<FrameworkConfig>({
    framework: "",
    testSuite: "",
    environment: "dev",
    browser: "chrome",
    parallel: "1",
    timeout: "30",
    configFile: "",
    logLevel: "info",
    outputDir: "./results",
    customParams: "",
  })

  const [isExecuting, setIsExecuting] = useState(false)
  const [executionOutput, setExecutionOutput] = useState("")
  const [generatedCommand, setGeneratedCommand] = useState("")
  const { toast } = useToast()

  const handleConfigChange = (key: keyof FrameworkConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    generateCommand({ ...config, [key]: value })
  }

  const generateCommand = (currentConfig: FrameworkConfig) => {
    if (!currentConfig.framework) {
      setGeneratedCommand("")
      return
    }

    let command = ""

    if (currentConfig.framework === "jtaf") {
      command = "java -jar jtaf-runner.jar"
      if (currentConfig.testSuite) command += ` --suite="${currentConfig.testSuite}"`
      if (currentConfig.environment) command += ` --env=${currentConfig.environment}`
      if (currentConfig.browser) command += ` --browser=${currentConfig.browser}`
      if (currentConfig.parallel && currentConfig.parallel !== "1") command += ` --parallel=${currentConfig.parallel}`
      if (currentConfig.timeout) command += ` --timeout=${currentConfig.timeout}`
      if (currentConfig.configFile) command += ` --config="${currentConfig.configFile}"`
      if (currentConfig.logLevel) command += ` --log-level=${currentConfig.logLevel}`
      if (currentConfig.outputDir) command += ` --output="${currentConfig.outputDir}"`
    } else if (currentConfig.framework === "floating") {
      command = "floating execute"
      if (currentConfig.testSuite) command += ` --task="${currentConfig.testSuite}"`
      if (currentConfig.environment) command += ` --env=${currentConfig.environment}`
      if (currentConfig.parallel && currentConfig.parallel !== "1") command += ` --workers=${currentConfig.parallel}`
      if (currentConfig.timeout) command += ` --timeout=${currentConfig.timeout}s`
      if (currentConfig.configFile) command += ` --config="${currentConfig.configFile}"`
      if (currentConfig.logLevel) command += ` --verbose=${currentConfig.logLevel}`
      if (currentConfig.outputDir) command += ` --output-dir="${currentConfig.outputDir}"`
    }

    if (currentConfig.customParams) {
      command += ` ${currentConfig.customParams}`
    }

    setGeneratedCommand(command)
  }

  const executeCommand = async () => {
    if (!generatedCommand) {
      toast({
        title: "No Command Generated",
        description: "Please configure the framework parameters first.",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setExecutionOutput("Starting execution...\n")

    // Simulate command execution
    const steps = [
      "Initializing framework...",
      "Loading configuration...",
      "Setting up environment...",
      "Executing tasks...",
      "Processing results...",
      "Generating reports...",
      "Execution completed successfully!",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setExecutionOutput((prev) => prev + `[${new Date().toLocaleTimeString()}] ${steps[i]}\n`)
    }

    setIsExecuting(false)
    toast({
      title: "Execution Complete",
      description: "Framework command executed successfully.",
    })
  }

  const copyCommand = () => {
    navigator.clipboard.writeText(generatedCommand)
    toast({
      title: "Command Copied",
      description: "Command has been copied to clipboard.",
    })
  }

  const resetConfig = () => {
    setConfig({
      framework: "",
      testSuite: "",
      environment: "dev",
      browser: "chrome",
      parallel: "1",
      timeout: "30",
      configFile: "",
      logLevel: "info",
      outputDir: "./results",
      customParams: "",
    })
    setGeneratedCommand("")
    setExecutionOutput("")
  }

  return (
    <div className="space-y-6">
      {/* Framework Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Framework Selection</CardTitle>
          <CardDescription>Choose the framework you want to configure and execute</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={config.framework === "jtaf" ? "default" : "outline"}
              className="h-20 flex flex-col space-y-2"
              onClick={() => handleConfigChange("framework", "jtaf")}
            >
              <span className="font-semibold">JTAF Framework</span>
              <span className="text-xs opacity-70">Java Test Automation</span>
            </Button>
            <Button
              variant={config.framework === "floating" ? "default" : "outline"}
              className="h-20 flex flex-col space-y-2"
              onClick={() => handleConfigChange("framework", "floating")}
            >
              <span className="font-semibold">Floating Framework</span>
              <span className="text-xs opacity-70">Dynamic Task Execution</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Parameters */}
      {config.framework && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Configuration Parameters</span>
              <Badge variant="secondary">{config.framework.toUpperCase()}</Badge>
            </CardTitle>
            <CardDescription>
              Configure the parameters for {config.framework === "jtaf" ? "JTAF" : "Floating"} framework execution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testSuite">{config.framework === "jtaf" ? "Test Suite" : "Task Name"}</Label>
                <Input
                  id="testSuite"
                  placeholder={config.framework === "jtaf" ? "e.g., regression-tests" : "e.g., data-processing"}
                  value={config.testSuite}
                  onChange={(e) => handleConfigChange("testSuite", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select value={config.environment} onValueChange={(value) => handleConfigChange("environment", value)}>
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

              {config.framework === "jtaf" && (
                <div className="space-y-2">
                  <Label htmlFor="browser">Browser</Label>
                  <Select value={config.browser} onValueChange={(value) => handleConfigChange("browser", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chrome">Chrome</SelectItem>
                      <SelectItem value="firefox">Firefox</SelectItem>
                      <SelectItem value="safari">Safari</SelectItem>
                      <SelectItem value="edge">Edge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="parallel">{config.framework === "jtaf" ? "Parallel Threads" : "Workers"}</Label>
                <Input
                  id="parallel"
                  type="number"
                  min="1"
                  max="10"
                  value={config.parallel}
                  onChange={(e) => handleConfigChange("parallel", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min="10"
                  max="300"
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
                  placeholder="e.g., ./config/framework.json"
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
                placeholder="Add any additional command line parameters..."
                value={config.customParams}
                onChange={(e) => handleConfigChange("customParams", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Command */}
      {generatedCommand && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Command</CardTitle>
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
            <CardDescription>Execute the configured framework command</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={executeCommand} disabled={isExecuting} className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>{isExecuting ? "Executing..." : "Execute Command"}</span>
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
                    a.download = "execution-log.txt"
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
      )}

      {/* Execution Output */}
      {executionOutput && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Execution Output</span>
              {isExecuting && (
                <Badge variant="secondary" className="animate-pulse">
                  Running
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Real-time output from framework execution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{executionOutput}</pre>
              {isExecuting && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">Executing...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
