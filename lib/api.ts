const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Add a helper function to check if API is available
async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    return response.ok
  } catch {
    return false
  }
}

// Build Logs API
export interface BuildLog {
  build_id: string
  type: string
  status: string
  start_time: string
  end_time?: string
  config: any
  command?: string
  jenkins_job: string
  output_log?: string
}

export interface BuildLogResponse extends BuildLog {
  id: string
}

export const buildLogsApi = {
  async create(buildLog: Omit<BuildLog, "id">): Promise<{ id: string; message: string }> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      // Fallback to localStorage for demo purposes
      const existingPipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
      const newPipeline = {
        ...buildLog,
        id: buildLog.build_id,
      }
      existingPipelines.unshift(newPipeline)
      localStorage.setItem("pipelines", JSON.stringify(existingPipelines))
      return { id: buildLog.build_id, message: "Build log created (offline mode)" }
    }

    const response = await fetch(`${API_BASE_URL}/build-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildLog),
    })
    if (!response.ok) throw new Error("Failed to create build log")
    return response.json()
  },

  async getAll(params?: {
    skip?: number
    limit?: number
    status?: string
    type?: string
  }): Promise<BuildLogResponse[]> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      // Fallback to localStorage
      const pipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
      return pipelines.map((p: any) => ({
        ...p,
        start_time: p.startTime || p.start_time,
        end_time: p.endTime || p.end_time,
        jenkins_job: p.jenkinsJob || p.jenkins_job,
      }))
    }

    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append("skip", params.skip.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.type) searchParams.append("type", params.type)

    const response = await fetch(`${API_BASE_URL}/build-logs?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch build logs")
    return response.json()
  },

  async getById(buildId: string): Promise<BuildLogResponse> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      const pipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
      const pipeline = pipelines.find((p: any) => p.id === buildId || p.build_id === buildId)
      if (!pipeline) throw new Error("Build log not found")
      return {
        ...pipeline,
        start_time: pipeline.startTime || pipeline.start_time,
        end_time: pipeline.endTime || pipeline.end_time,
        jenkins_job: pipeline.jenkinsJob || pipeline.jenkins_job,
      }
    }

    const response = await fetch(`${API_BASE_URL}/build-logs/${buildId}`)
    if (!response.ok) throw new Error("Failed to fetch build log")
    return response.json()
  },

  async update(
    buildId: string,
    data: {
      status?: string
      end_time?: string
      output_log?: string
    },
  ): Promise<{ message: string }> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      const pipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
      const pipelineIndex = pipelines.findIndex((p: any) => p.id === buildId || p.build_id === buildId)
      if (pipelineIndex !== -1) {
        pipelines[pipelineIndex] = { ...pipelines[pipelineIndex], ...data }
        localStorage.setItem("pipelines", JSON.stringify(pipelines))
      }
      return { message: "Build log updated (offline mode)" }
    }

    const response = await fetch(`${API_BASE_URL}/build-logs/${buildId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update build log")
    return response.json()
  },

  async delete(buildId: string): Promise<{ message: string }> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      const pipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
      const filteredPipelines = pipelines.filter((p: any) => p.id !== buildId && p.build_id !== buildId)
      localStorage.setItem("pipelines", JSON.stringify(filteredPipelines))
      return { message: "Build log deleted (offline mode)" }
    }

    const response = await fetch(`${API_BASE_URL}/build-logs/${buildId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete build log")
    return response.json()
  },

  async clearAll(): Promise<{ message: string }> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      localStorage.setItem("pipelines", JSON.stringify([]))
      return { message: "All build logs cleared (offline mode)" }
    }

    const response = await fetch(`${API_BASE_URL}/build-logs`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to clear build logs")
    return response.json()
  },
}

// Generated Code API
export interface GeneratedCode {
  language: string
  type: string
  code: string
  description: string
  created_at: string
}

export interface GeneratedCodeResponse extends GeneratedCode {
  id: string
}

export const generatedCodeApi = {
  async create(code: Omit<GeneratedCode, "id" | "created_at">): Promise<{ id: string; message: string }> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      // Fallback to localStorage
      const existingCodes = JSON.parse(localStorage.getItem("generatedCodes") || "[]")
      const newCode = {
        ...code,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      }

      // Keep only 10 most recent
      existingCodes.unshift(newCode)
      if (existingCodes.length > 10) {
        existingCodes.splice(10)
      }

      localStorage.setItem("generatedCodes", JSON.stringify(existingCodes))
      return { id: newCode.id, message: "Generated code saved (offline mode)" }
    }

    const response = await fetch(`${API_BASE_URL}/generated-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(code),
    })
    if (!response.ok) throw new Error("Failed to save generated code")
    return response.json()
  },

  async getAll(params?: { skip?: number; limit?: number }): Promise<GeneratedCodeResponse[]> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      // Fallback to localStorage
      const codes = JSON.parse(localStorage.getItem("generatedCodes") || "[]")
      return codes.slice(0, params?.limit || 10)
    }

    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append("skip", params.skip.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const response = await fetch(`${API_BASE_URL}/generated-code?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch generated code")
    return response.json()
  },

  async getById(codeId: string): Promise<GeneratedCodeResponse> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      const codes = JSON.parse(localStorage.getItem("generatedCodes") || "[]")
      const code = codes.find((c: any) => c.id === codeId)
      if (!code) throw new Error("Generated code not found")
      return code
    }

    const response = await fetch(`${API_BASE_URL}/generated-code/${codeId}`)
    if (!response.ok) throw new Error("Failed to fetch generated code")
    return response.json()
  },

  async delete(codeId: string): Promise<{ message: string }> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      const codes = JSON.parse(localStorage.getItem("generatedCodes") || "[]")
      const filteredCodes = codes.filter((c: any) => c.id !== codeId)
      localStorage.setItem("generatedCodes", JSON.stringify(filteredCodes))
      return { message: "Generated code deleted (offline mode)" }
    }

    const response = await fetch(`${API_BASE_URL}/generated-code/${codeId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete generated code")
    return response.json()
  },

  async clearAll(): Promise<{ message: string }> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      localStorage.setItem("generatedCodes", JSON.stringify([]))
      return { message: "All generated code cleared (offline mode)" }
    }

    const response = await fetch(`${API_BASE_URL}/generated-code`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to clear generated code")
    return response.json()
  },
}

// Stats API
export interface Stats {
  build_logs: {
    total: number
    running: number
    completed: number
    failed: number
    by_type: {
      jtaf: number
      floating: number
      os_making: number
    }
  }
  generated_code: {
    total: number
    limit: number
  }
}

export const statsApi = {
  async get(): Promise<Stats> {
    const isApiAvailable = await checkApiHealth()
    if (!isApiAvailable) {
      // Fallback to localStorage stats
      const pipelines = JSON.parse(localStorage.getItem("pipelines") || "[]")
      const codes = JSON.parse(localStorage.getItem("generatedCodes") || "[]")

      return {
        build_logs: {
          total: pipelines.length,
          running: pipelines.filter((p: any) => p.status === "running").length,
          completed: pipelines.filter((p: any) => p.status === "completed").length,
          failed: pipelines.filter((p: any) => p.status === "failed").length,
          by_type: {
            jtaf: pipelines.filter((p: any) => p.type === "JTAF Framework").length,
            floating: pipelines.filter((p: any) => p.type === "Floating Framework").length,
            os_making: pipelines.filter((p: any) => p.type === "OS Making").length,
          },
        },
        generated_code: {
          total: codes.length,
          limit: 10,
        },
      }
    }

    const response = await fetch(`${API_BASE_URL}/stats`)
    if (!response.ok) throw new Error("Failed to fetch stats")
    return response.json()
  },
}

// Export the health check function for components to use
export { checkApiHealth }
