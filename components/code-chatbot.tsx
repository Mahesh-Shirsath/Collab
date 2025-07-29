"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Copy, Download, Bot, User, Code, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  codeType?: "jtaf" | "floating" | "general"
}

export default function CodeChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI code generation assistant. I can help you generate code for JTAF and Floating frameworks, create test scripts, configuration files, and more. What would you like me to help you with today?",
      timestamp: new Date(),
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFramework, setSelectedFramework] = useState<"jtaf" | "floating" | "general">("general")
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate API call to chatbot
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(inputMessage, selectedFramework),
        timestamp: new Date(),
        codeType: selectedFramework,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResponse = (prompt: string, framework: string): string => {
    const lowerPrompt = prompt.toLowerCase()

    if (framework === "jtaf") {
      if (lowerPrompt.includes("test") || lowerPrompt.includes("automation")) {
        return `Here's a JTAF test automation example:

\`\`\`java
@Test
public class LoginTest extends BaseTest {
    
    @Test(priority = 1)
    public void testValidLogin() {
        // Navigate to login page
        driver.get(getProperty("app.url"));
        
        // Enter credentials
        WebElement usernameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.id("login-btn"));
        
        usernameField.sendKeys(getProperty("test.username"));
        passwordField.sendKeys(getProperty("test.password"));
        loginButton.click();
        
        // Verify successful login
        WebElement dashboard = driver.findElement(By.id("dashboard"));
        Assert.assertTrue(dashboard.isDisplayed(), "Login failed");
    }
    
    @Test(priority = 2)
    public void testInvalidLogin() {
        driver.get(getProperty("app.url"));
        
        WebElement usernameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.id("login-btn"));
        
        usernameField.sendKeys("invalid@email.com");
        passwordField.sendKeys("wrongpassword");
        loginButton.click();
        
        WebElement errorMessage = driver.findElement(By.className("error-message"));
        Assert.assertTrue(errorMessage.isDisplayed(), "Error message not shown");
    }
}
\`\`\`

This JTAF test class includes:
- Valid login test case
- Invalid login test case
- Proper assertions and error handling
- Page object model integration ready`
      }

      if (lowerPrompt.includes("config")) {
        return `Here's a JTAF configuration example:

\`\`\`json
{
  "framework": {
    "name": "JTAF",
    "version": "2.1.0"
  },
  "execution": {
    "browser": "chrome",
    "headless": false,
    "timeout": 30,
    "parallel": true,
    "threadCount": 3
  },
  "environment": {
    "baseUrl": "https://app.example.com",
    "apiUrl": "https://api.example.com",
    "database": {
      "host": "localhost",
      "port": 5432,
      "name": "testdb"
    }
  },
  "reporting": {
    "enabled": true,
    "format": ["html", "json"],
    "outputDir": "./test-results"
  },
  "testData": {
    "dataProvider": "excel",
    "dataFile": "./data/testdata.xlsx"
  }
}
\`\`\`

This configuration includes all essential JTAF settings for test execution.`
      }
    }

    if (framework === "floating") {
      if (lowerPrompt.includes("task") || lowerPrompt.includes("execute")) {
        return `Here's a Floating framework task example:

\`\`\`javascript
// floating-task.js
const FloatingTask = require('floating-framework');

class DataProcessingTask extends FloatingTask {
    constructor(config) {
        super(config);
        this.taskName = 'data-processing';
        this.timeout = 60000;
    }
    
    async initialize() {
        console.log('Initializing data processing task...');
        this.dataSource = await this.connectToDataSource();
        this.outputBuffer = [];
    }
    
    async execute(inputData) {
        try {
            console.log(\`Processing \${inputData.length} records...\`);
            
            for (const record of inputData) {
                const processedRecord = await this.processRecord(record);
                this.outputBuffer.push(processedRecord);
                
                // Emit progress event
                this.emit('progress', {
                    processed: this.outputBuffer.length,
                    total: inputData.length
                });
            }
            
            return this.outputBuffer;
        } catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
    
    async processRecord(record) {
        // Custom processing logic
        return {
            ...record,
            processed: true,
            timestamp: new Date().toISOString(),
            hash: this.generateHash(record)
        };
    }
    
    async cleanup() {
        console.log('Cleaning up resources...');
        if (this.dataSource) {
            await this.dataSource.disconnect();
        }
    }
}

module.exports = DataProcessingTask;
\`\`\`

This Floating task includes:
- Proper initialization and cleanup
- Progress tracking
- Error handling
- Event emission for monitoring`
      }

      if (lowerPrompt.includes("config")) {
        return `Here's a Floating framework configuration:

\`\`\`yaml
# floating.config.yml
framework:
  name: floating
  version: 1.5.0
  
execution:
  mode: distributed
  workers: 4
  timeout: 120
  retries: 3
  
resources:
  memory: 2GB
  cpu: 2
  storage: 10GB
  
tasks:
  - name: data-processing
    enabled: true
    schedule: "0 */6 * * *"
    priority: high
    
  - name: report-generation
    enabled: true
    schedule: "0 0 * * *"
    priority: medium
    
monitoring:
  enabled: true
  metrics:
    - cpu_usage
    - memory_usage
    - task_duration
    - error_rate
  
logging:
  level: info
  format: json
  output: ./logs/floating.log
  
integrations:
  database:
    type: postgresql
    host: localhost
    port: 5432
    
  messaging:
    type: rabbitmq
    host: localhost
    port: 5672
\`\`\`

This configuration covers all aspects of Floating framework setup.`
      }
    }

    // General responses
    return `I can help you with code generation for both JTAF and Floating frameworks. Here are some things I can assist with:

**For JTAF Framework:**
- Test automation scripts
- Configuration files
- Page object models
- Test data management
- Reporting setup

**For Floating Framework:**
- Task definitions
- Workflow configurations
- Resource management
- Monitoring setup
- Integration scripts

**General Development:**
- Code optimization
- Best practices
- Documentation
- Troubleshooting

Please specify what type of code you'd like me to generate, and I'll provide you with a detailed implementation!`
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Message Copied",
      description: "Message content has been copied to clipboard.",
    })
  }

  const exportChat = () => {
    const chatContent = messages
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "chat-export.txt"
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Framework Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Code Generator</span>
          </CardTitle>
          <CardDescription>Generate framework-specific code using our AI assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Target Framework:</label>
            <Select value={selectedFramework} onValueChange={(value: any) => setSelectedFramework(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="jtaf">JTAF Framework</SelectItem>
                <SelectItem value="floating">Floating Framework</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="capitalize">
              {selectedFramework}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Chat Assistant</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={exportChat}>
              <Download className="w-4 h-4 mr-2" />
              Export Chat
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        {message.role === "user" ? <User className="w-4 h-4 mt-1" /> : <Bot className="w-4 h-4 mt-1" />}
                      </div>
                      <div className="flex-1">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm">{message.content}</pre>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex space-x-2">
            <Textarea
              placeholder="Ask me to generate code for JTAF or Floating frameworks..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1 min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()} className="px-6">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common code generation requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => setInputMessage("Generate a JTAF test automation script for login functionality")}
            >
              <Code className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">JTAF Login Test</div>
                <div className="text-xs text-gray-500">Test automation script</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => setInputMessage("Create a Floating framework task for data processing")}
            >
              <Code className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Floating Data Task</div>
                <div className="text-xs text-gray-500">Data processing task</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => setInputMessage("Generate configuration files for both frameworks")}
            >
              <Code className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Config Files</div>
                <div className="text-xs text-gray-500">Framework configurations</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
