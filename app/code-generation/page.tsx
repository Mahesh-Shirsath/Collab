"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Copy, Download, Sparkles, Code, FileText, Trash2, Wifi, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { generatedCodeApi, checkApiHealth, type GeneratedCodeResponse } from "@/lib/api"

interface GeneratedCode {
  id: string
  language: string
  type: string
  code: string
  description: string
  timestamp: Date
}

export default function CodeGenerationPage() {
  const [prompt, setPrompt] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [selectedType, setSelectedType] = useState("function")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCodeResponse[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "typescript", label: "TypeScript" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
  ]

  const codeTypes = [
    { value: "function", label: "Function" },
    { value: "class", label: "Class" },
    { value: "api", label: "API Endpoint" },
    { value: "component", label: "UI Component" },
    { value: "algorithm", label: "Algorithm" },
    { value: "test", label: "Unit Test" },
    { value: "config", label: "Configuration" },
    { value: "script", label: "Script" },
  ]

  // Check API status and load generated codes on component mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      try {
        // Check if API is available
        const apiStatus = await checkApiHealth()
        setIsOnline(apiStatus)

        // Load generated codes
        const codes = await generatedCodeApi.getAll({ limit: 10 })
        setGeneratedCodes(codes)

        if (!apiStatus) {
          toast({
            title: "Offline Mode",
            description: "API is not available. Using local storage for demo purposes.",
            variant: "default",
          })
        }
      } catch (error) {
        console.error("Failed to initialize:", error)
        setIsOnline(false)
        // Try to load from localStorage as fallback
        try {
          const codes = await generatedCodeApi.getAll({ limit: 10 })
          setGeneratedCodes(codes)
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError)
          toast({
            title: "Initialization Failed",
            description: "Could not load generated codes. Starting fresh.",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [toast])

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description of what you want to generate.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockCode = generateMockCode(prompt, selectedLanguage, selectedType)

      // Save to database/localStorage
      const result = await generatedCodeApi.create({
        language: selectedLanguage,
        type: selectedType,
        code: mockCode,
        description: prompt,
      })

      // Refresh the list
      const updatedCodes = await generatedCodeApi.getAll({ limit: 10 })
      setGeneratedCodes(updatedCodes)

      setPrompt("")
      setIsGenerating(false)

      toast({
        title: "Code Generated",
        description: `${selectedLanguage} ${selectedType} has been generated and saved${!isOnline ? " (offline mode)" : ""}.`,
      })
    } catch (error) {
      console.error("Code generation failed:", error)
      setIsGenerating(false)
      toast({
        title: "Generation Failed",
        description: "Failed to generate and save code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteCode = async (codeId: string) => {
    try {
      await generatedCodeApi.delete(codeId)

      // Refresh the list
      const updatedCodes = await generatedCodeApi.getAll({ limit: 10 })
      setGeneratedCodes(updatedCodes)

      toast({
        title: "Code Deleted",
        description: `Generated code has been deleted successfully${!isOnline ? " (offline mode)" : ""}.`,
      })
    } catch (error) {
      console.error("Delete failed:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete generated code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateMockCode = (prompt: string, language: string, type: string): string => {
    // Your existing generateMockCode function remains the same
    const lowerPrompt = prompt.toLowerCase()

    if (language === "javascript") {
      if (type === "function") {
        return `// Generated JavaScript function based on: "${prompt}"
function processData(input) {
    try {
        // Validate input
        if (!input || typeof input !== 'object') {
            throw new Error('Invalid input provided');
        }
        
        // Process the data
        const result = {
            processed: true,
            timestamp: new Date().toISOString(),
            data: input
        };
        
        // Apply transformations
        if (input.items && Array.isArray(input.items)) {
            result.data.items = input.items.map(item => ({
                ...item,
                processed: true
            }));
        }
        
        return result;
    } catch (error) {
        console.error('Processing failed:', error);
        return { error: error.message };
    }
}

// Usage example
const sampleData = { items: [{ id: 1, name: 'test' }] };
const result = processData(sampleData);
console.log(result);`
      }

      if (type === "component") {
        return `// Generated React component based on: "${prompt}"
import React, { useState, useEffect } from 'react';

const CustomComponent = ({ 
  title = "Default Title",
  data = [],
  onItemClick,
  className = "",
  ...props 
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Component initialization logic
    console.log('Component mounted with data:', data);
  }, [data]);

  const handleItemClick = (item, index) => {
    setSelectedItem(item);
    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(\`Action \${action} performed on:\`, item);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={\`custom-component \${className}\`} {...props}>
      <header className="component-header">
        <h2>{title}</h2>
        {isLoading && <span className="loading-indicator">Loading...</span>}
      </header>
      
      <main className="component-content">
        {data.length === 0 ? (
          <div className="empty-state">
            <p>No data available</p>
          </div>
        ) : (
          <ul className="data-list">
            {data.map((item, index) => (
              <li 
                key={item.id || index}
                className={\`data-item \${selectedItem?.id === item.id ? 'selected' : ''}\`}
                onClick={() => handleItemClick(item, index)}
              >
                <div className="item-content">
                  <h3>{item.name || item.title || \`Item \${index + 1}\`}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
                <div className="item-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('edit', item);
                    }}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('delete', item);
                    }}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      
      {selectedItem && (
        <footer className="component-footer">
          <div className="selected-info">
            <h4>Selected: {selectedItem.name || 'Unknown'}</h4>
            <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
          </div>
        </footer>
      )}
    </div>
  );
};

export default CustomComponent;`
      }
    }

    if (language === "python") {
      if (type === "function") {
        return `# Generated Python function based on: "${prompt}"
from typing import Dict, Any, Optional
import json
from datetime import datetime

def process_data(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process input data and return structured result.
    
    Args:
        input_data: Dictionary containing data to process
        
    Returns:
        Dictionary with processed results
        
    Raises:
        ValueError: If input data is invalid
    """
    try:
        # Validate input
        if not isinstance(input_data, dict):
            raise ValueError("Input must be a dictionary")
        
        # Process the data
        result = {
            "processed": True,
            "timestamp": datetime.now().isoformat(),
            "data": input_data.copy()
        }
        
        # Apply transformations
        if "items" in input_data and isinstance(input_data["items"], list):
            result["data"]["items"] = [
                {**item, "processed": True} 
                for item in input_data["items"]
            ]
        
        return result
        
    except Exception as e:
        return {"error": str(e)}

# Usage example
if __name__ == "__main__":
    sample_data = {"items": [{"id": 1, "name": "test"}]}
    result = process_data(sample_data)
    print(json.dumps(result, indent=2))`
      }
    }

    // Default fallback
    return `// Generated ${language} ${type} based on: "${prompt}"
// This is a placeholder implementation
// Please provide more specific requirements for better code generation

console.log("Generated code for: ${prompt}");`
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code Copied",
      description: "Code has been copied to clipboard.",
    })
  }

  const downloadCode = (code: GeneratedCodeResponse) => {
    const extension = getFileExtension(code.language)
    const blob = new Blob([code.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated-${code.type}-${code.id}.${extension}`
    a.click()
  }

  const getFileExtension = (language: string): string => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      go: "go",
      rust: "rs",
      cpp: "cpp",
      csharp: "cs",
    }
    return extensions[language] || "txt"
  }

  const quickPrompts = [
    "Create a REST API endpoint for user authentication",
    "Generate a data validation function",
    "Build a responsive React component",
    "Create a database connection class",
    "Generate unit tests for a calculator function",
    "Build a file upload handler",
    "Create a caching mechanism",
    "Generate a configuration parser",
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-orange-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Loading Code Generator...</h3>
          <p className="text-gray-600">Initializing the application</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100">
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
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Code Generation</h1>
                  <p className="text-sm text-gray-600">AI-Powered Code Generator</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                AI Ready
              </Badge>
              <Badge
                variant={isOnline ? "default" : "secondary"}
                className={isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Generation Panel */}
          <div className="xl:w-1/3 space-y-6">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900 flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Code Generator</span>
                </CardTitle>
                <CardDescription>Describe what you want to generate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Programming Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Code Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {codeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={generateCode} disabled={isGenerating} className="w-full flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? "Generating..." : "Generate Code"}</span>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Prompts</CardTitle>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {quickPrompts.map((quickPrompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 text-xs hover:bg-orange-50"
                      onClick={() => setPrompt(quickPrompt)}
                    >
                      <span className="line-clamp-2">{quickPrompt}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Code Display */}
          <div className="xl:w-2/3">
            <Card className="h-[800px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Generated Code</span>
                  {generatedCodes.length > 0 && <Badge variant="outline">{generatedCodes.length} items</Badge>}
                </CardTitle>
                <CardDescription>Your generated code will appear here {!isOnline && "(offline mode)"}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0">
                {generatedCodes.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <Code className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">No Code Generated Yet</h3>
                        <p className="text-gray-600">
                          Use the generator on the left to create your first piece of code.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="space-y-6 pr-4">
                      {generatedCodes.map((code) => (
                        <div key={code.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <Badge variant="outline" className="capitalize">
                                {code.language}
                              </Badge>
                              <Badge variant="secondary" className="capitalize">
                                {code.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(code.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyCode(code.code)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => downloadCode(code)}
                                className="h-8 w-8 p-0"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteCode(code.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 break-words">{code.description}</p>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
                            <pre className="text-sm whitespace-pre-wrap break-words">
                              <code>{code.code}</code>
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
