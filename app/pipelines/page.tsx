"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  Download,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Pipeline {
  id: string
  type: string
  status: "running" | "completed" | "failed"
  startTime: string
  endTime?: string
  config: any
  command?: string
  jenkinsJob: string
}

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [filteredPipelines, setFilteredPipelines] = useState<Pipeline[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadPipelines()
    const interval = setInterval(loadPipelines, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterPipelines()
  }, [pipelines, searchTerm, statusFilter, typeFilter])

  const loadPipelines = () => {
    const storedPipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
    setPipelines(storedPipelines)
  }

  const filterPipelines = () => {
    let filtered = pipelines

    if (searchTerm) {
      filtered = filtered.filter(
        (pipeline) =>
          pipeline.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pipeline.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((pipeline) => pipeline.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((pipeline) => pipeline.type === typeFilter)
    }

    setFilteredPipelines(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      running: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "JTAF Framework": "bg-blue-50 border-blue-200",
      "Floating Framework": "bg-purple-50 border-purple-200",
      "OS Making": "bg-green-50 border-green-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-50 border-gray-200"
  }

  const getDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000)

    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`
  }

  const openJenkinsConsole = (pipeline: Pipeline) => {
    window.open(`https://jenkins.example.com/job/${pipeline.jenkinsJob}/${pipeline.id}/console`, "_blank")
  }

  const deletePipeline = (pipelineId: string) => {
    const updatedPipelines = pipelines.filter((p) => p.id !== pipelineId)
    setPipelines(updatedPipelines)
    localStorage.setItem("pipelines", JSON.stringify(updatedPipelines))
    toast({
      title: "Pipeline Deleted",
      description: "Pipeline record has been removed.",
    })
  }

  const clearAllPipelines = () => {
    setPipelines([])
    localStorage.setItem("pipelines", JSON.stringify([]))
    toast({
      title: "All Pipelines Cleared",
      description: "All pipeline records have been removed.",
    })
  }

  const exportPipelines = () => {
    const dataStr = JSON.stringify(pipelines, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pipelines-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const getStats = () => {
    const total = pipelines.length
    const running = pipelines.filter((p) => p.status === "running").length
    const completed = pipelines.filter((p) => p.status === "completed").length
    const failed = pipelines.filter((p) => p.status === "failed").length

    return { total, running, completed, failed }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Pipeline Tracker</h1>
                  <p className="text-sm text-gray-600">Monitor all Jenkins pipeline executions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {stats.total} Total
              </Badge>
              {stats.running > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 animate-pulse">
                  {stats.running} Running
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-600">Total Pipelines</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
                    <p className="text-sm text-gray-600">Running</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                    <p className="text-sm text-gray-600">Failed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pipeline Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={loadPipelines}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportPipelines}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllPipelines}
                    className="text-red-600 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search pipelines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="JTAF Framework">JTAF Framework</SelectItem>
                    <SelectItem value="Floating Framework">Floating Framework</SelectItem>
                    <SelectItem value="OS Making">OS Making</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pipelines List */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline History</CardTitle>
              <CardDescription>
                {filteredPipelines.length} of {pipelines.length} pipelines shown
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPipelines.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pipelines Found</h3>
                  <p className="text-gray-600">
                    {pipelines.length === 0
                      ? "No pipelines have been executed yet. Start by running a framework or OS build."
                      : "No pipelines match your current filters."}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredPipelines.map((pipeline) => (
                      <Card
                        key={pipeline.id}
                        className={`${getTypeColor(pipeline.type)} transition-all hover:shadow-md`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(pipeline.status)}
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900">{pipeline.id}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    {pipeline.type}
                                  </Badge>
                                  <Badge className={`text-xs ${getStatusBadge(pipeline.status)}`}>
                                    {pipeline.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                  <span>Started: {new Date(pipeline.startTime).toLocaleString()}</span>
                                  <span>Duration: {getDuration(pipeline.startTime, pipeline.endTime)}</span>
                                  <span>Job: {pipeline.jenkinsJob}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openJenkinsConsole(pipeline)}
                                className="flex items-center space-x-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Console</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePipeline(pipeline.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Configuration Details */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <details className="group">
                              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                                View Configuration
                              </summary>
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                  {JSON.stringify(pipeline.config, null, 2)}
                                </pre>
                                {pipeline.command && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Generated Command:</p>
                                    <code className="text-xs bg-gray-900 text-green-400 p-2 rounded block">
                                      {pipeline.command}
                                    </code>
                                  </div>
                                )}
                              </div>
                            </details>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
