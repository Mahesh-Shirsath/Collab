"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Copy, Download, Sparkles, Code, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([])
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockCode = generateMockCode(prompt, selectedLanguage, selectedType)

    const newCode: GeneratedCode = {
      id: Date.now().toString(),
      language: selectedLanguage,
      type: selectedType,
      code: mockCode,
      description: prompt,
      timestamp: new Date(),
    }

    setGeneratedCodes((prev) => [newCode, ...prev])
    setPrompt("")
    setIsGenerating(false)

    toast({
      title: "Code Generated",
      description: `${selectedLanguage} ${selectedType} has been generated successfully.`,
    })
  }

  const generateMockCode = (prompt: string, language: string, type: string): string => {
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

      if (type === "api") {
        return `// Generated Express.js API endpoint based on: "${prompt}"
const express = require('express');
const router = express.Router();

// Middleware for validation
const validateRequest = (req, res, next) => {
    const { body } = req;
    
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            error: 'Request body is required'
        });
    }
    
    next();
};

// Main API endpoint
router.post('/api/process', validateRequest, async (req, res) => {
    try {
        const { data } = req.body;
        
        // Process the request
        const processedData = {
            id: Date.now(),
            originalData: data,
            processed: true,
            timestamp: new Date().toISOString()
        };
        
        // Simulate async processing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        res.status(200).json({
            success: true,
            data: processedData
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

module.exports = router;`
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

      if (type === "class") {
        return `# Generated Python class based on: "${prompt}"
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

class DataProcessor:
    """
    A class for processing and managing data operations.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the DataProcessor.
        
        Args:
            config: Optional configuration dictionary
        """
        self.config = config or {}
        self.processed_items: List[Dict[str, Any]] = []
        self.logger = logging.getLogger(__name__)
        
    def add_item(self, item: Dict[str, Any]) -> bool:
        """
        Add an item to be processed.
        
        Args:
            item: Dictionary containing item data
            
        Returns:
            True if item was added successfully
        """
        try:
            validated_item = self._validate_item(item)
            self.processed_items.append(validated_item)
            self.logger.info(f"Added item: {validated_item.get('id', 'unknown')}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to add item: {e}")
            return False
    
    def process_all(self) -> List[Dict[str, Any]]:
        """
        Process all added items.
        
        Returns:
            List of processed items
        """
        results = []
        for item in self.processed_items:
            processed_item = self._process_item(item)
            results.append(processed_item)
        
        return results
    
    def _validate_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and prepare item for processing."""
        if not isinstance(item, dict):
            raise ValueError("Item must be a dictionary")
        
        return {
            **item,
            "added_at": datetime.now().isoformat(),
            "status": "pending"
        }
    
    def _process_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single item."""
        return {
            **item,
            "processed_at": datetime.now().isoformat(),
            "status": "completed"
        }

# Usage example
if __name__ == "__main__":
    processor = DataProcessor({"debug": True})
    processor.add_item({"id": 1, "name": "test item"})
    results = processor.process_all()
    print(results)`
      }
    }

    if (language === "java") {
      if (type === "class") {
        return `// Generated Java class based on: "${prompt}"
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Logger;

public class DataProcessor {
    private static final Logger logger = Logger.getLogger(DataProcessor.class.getName());
    private final Map<String, Object> config;
    private final List<Map<String, Object>> processedItems;
    
    public DataProcessor() {
        this(new HashMap<>());
    }
    
    public DataProcessor(Map<String, Object> config) {
        this.config = config;
        this.processedItems = new ArrayList<>();
    }
    
    public boolean addItem(Map<String, Object> item) {
        try {
            Map<String, Object> validatedItem = validateItem(item);
            processedItems.add(validatedItem);
            logger.info("Added item: " + validatedItem.getOrDefault("id", "unknown"));
            return true;
        } catch (Exception e) {
            logger.severe("Failed to add item: " + e.getMessage());
            return false;
        }
    }
    
    public List<Map<String, Object>> processAll() {
        List<Map<String, Object>> results = new ArrayList<>();
        for (Map<String, Object> item : processedItems) {
            Map<String, Object> processedItem = processItem(item);
            results.add(processedItem);
        }
        return results;
    }
    
    private Map<String, Object> validateItem(Map<String, Object> item) {
        if (item == null) {
            throw new IllegalArgumentException("Item cannot be null");
        }
        
        Map<String, Object> validatedItem = new HashMap<>(item);
        validatedItem.put("addedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        validatedItem.put("status", "pending");
        
        return validatedItem;
    }
    
    private Map<String, Object> processItem(Map<String, Object> item) {
        Map<String, Object> processedItem = new HashMap<>(item);
        processedItem.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        processedItem.put("status", "completed");
        
        return processedItem;
    }
    
    // Usage example
    public static void main(String[] args) {
        DataProcessor processor = new DataProcessor();
        
        Map<String, Object> item = new HashMap<>();
        item.put("id", 1);
        item.put("name", "test item");
        
        processor.addItem(item);
        List<Map<String, Object>> results = processor.processAll();
        
        System.out.println(results);
    }
}`
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

  const downloadCode = (code: GeneratedCode) => {
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
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              AI Ready
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Generation Panel */}
          <div className="lg:col-span-1 space-y-6">
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
              <CardContent>
                <div className="space-y-2">
                  {quickPrompts.map((quickPrompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 text-xs"
                      onClick={() => setPrompt(quickPrompt)}
                    >
                      {quickPrompt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Code Display */}
          <div className="lg:col-span-2">
            <Card className="h-[800px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Generated Code</span>
                  {generatedCodes.length > 0 && <Badge variant="outline">{generatedCodes.length} items</Badge>}
                </CardTitle>
                <CardDescription>Your generated code will appear here</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
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
                  <ScrollArea className="flex-1">
                    <div className="space-y-6">
                      {generatedCodes.map((code) => (
                        <div key={code.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="capitalize">
                                {code.language}
                              </Badge>
                              <Badge variant="secondary" className="capitalize">
                                {code.type}
                              </Badge>
                              <span className="text-xs text-gray-500">{code.timestamp.toLocaleString()}</span>
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
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{code.description}</p>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre className="text-sm">
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
