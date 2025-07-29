"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, RotateCcw, Copy, Download, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface JTAFConfig {
  testSuite: string
  environment: string
  browser: string
  parallel: string
  timeout: string
  configFile: string
  logLevel: string
  outputDir: string
  customParams: string
}

export default function JTAFPage() {
  const [config, setConfig] = useState<JTAFConfig>({
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

  const handleConfigChange = (key: keyof JTAFConfig, value: string) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    generateCommand(newConfig)
  }

  const generateCommand = (currentConfig: JTAFConfig) => {
    let command = "java -jar jtaf-runner.jar"
    if (currentConfig.testSuite) command += ` --suite="${currentConfig.testSuite}"`
    if (currentConfig.environment) command += ` --env=${currentConfig.environment}`
    if (currentConfig.browser) command += ` --browser=${currentConfig.browser}`
    if (currentConfig.parallel && currentConfig.parallel !== "1") command += ` --parallel=${currentConfig.parallel}`
    if (currentConfig.timeout) command += ` --timeout=${currentConfig.timeout}`
    if (currentConfig.configFile) command += ` --config="${currentConfig.configFile}"`
    if (currentConfig.logLevel) command += ` --log-level=${currentConfig.logLevel}`
    if (currentConfig.outputDir) command += ` --output="${currentConfig.outputDir}"`
    if (currentConfig.customParams) command += ` ${currentConfig.customParams}`

    setGeneratedCommand(command)
  }

  const executeCommand = async () => {
    if (!generatedCommand) {
      toast({
        title: "No Command Generated",
        description: "Please configure the JTAF parameters first.",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setExecutionOutput("Starting JTAF execution...\n")

    const steps = [
      "Initializing JTAF framework...",
      "Loading test configuration...",
      "Setting up browser environment...",
      "Executing test suite...",
      "Running parallel tests...",
      "Generating test reports...",
      "JTAF execution completed successfully!",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setExecutionOutput((prev) => prev + `[${new Date().toLocaleTimeString()}] ${steps[i]}\n`)
    }

    setIsExecuting(false)
    toast({
      title: "JTAF Execution Complete",
      description: "Test automation framework executed successfully.",
    })
  }

  const copyCommand = () => {
    navigator.clipboard.writeText(generatedCommand)
    toast({
      title: "Command Copied",
      description: "JTAF command has been copied to clipboard.",
    })
  }

  const resetConfig = () => {
    setConfig({
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">JTAF Framework</h1>
                  <p className="text-sm text-gray-600">Java Test Automation Framework</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Framework Info */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">JTAF Configuration</CardTitle>
              <CardDescription>Configure parameters for Java Test Automation Framework execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testSuite">Test Suite</Label>
                  <Input
                    id="testSuite"
                    placeholder="e.g., regression-tests"
                    value={config.testSuite}
                    onChange={(e) => handleConfigChange("testSuite", e.target.value)}
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

                <div className="space-y-2">
                  <Label htmlFor="parallel">Parallel Threads</Label>
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
                    placeholder="e.g., ./config/jtaf.json"
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
                  placeholder="Add any additional JTAF command line parameters..."
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
                <CardTitle>Generated JTAF Command</CardTitle>
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
                <CardDescription>Execute the configured JTAF command</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={executeCommand} disabled={isExecuting} className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>{isExecuting ? "Executing..." : "Execute JTAF"}</span>
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
                        a.download = "jtaf-execution-log.txt"
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
                  <span>JTAF Execution Output</span>
                  {isExecuting && (
                    <Badge variant="secondary" className="animate-pulse">
                      Running
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Real-time output from JTAF execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{executionOutput}</pre>
                  {isExecuting && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Executing JTAF...</span>
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
