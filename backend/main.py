from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
import os
import json
import subprocess
import asyncio
from contextlib import asynccontextmanager

# Database connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "framework_hub"

# Global database client
db_client: AsyncIOMotorClient = None
database = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global db_client, database
    db_client = AsyncIOMotorClient(MONGODB_URL)
    database = db_client[DATABASE_NAME]
    
    # Create indexes
    await database.build_logs.create_index("build_id", unique=True)
    await database.generated_code.create_index("created_at")
    
    yield
    
    # Shutdown
    db_client.close()

app = FastAPI(
    title="Framework Hub API",
    description="Backend API for Framework Hub platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class BuildLog(BaseModel):
    build_id: str
    type: str  # "JTAF Framework", "Floating Framework", "OS Making"
    status: str  # "running", "completed", "failed"
    start_time: datetime
    end_time: Optional[datetime] = None
    config: Dict[str, Any]
    command: Optional[str] = None
    jenkins_job: str
    output_log: Optional[str] = None

class BuildLogResponse(BaseModel):
    id: str = Field(alias="_id")
    build_id: str
    type: str
    status: str
    start_time: datetime
    end_time: Optional[datetime] = None
    config: Dict[str, Any]
    command: Optional[str] = None
    jenkins_job: str
    output_log: Optional[str] = None
    
    class Config:
        populate_by_name = True

class GeneratedCode(BaseModel):
    language: str
    type: str  # "function", "class", "api", "component", etc.
    code: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GeneratedCodeResponse(BaseModel):
    id: str = Field(alias="_id")
    language: str
    type: str
    code: str
    description: str
    created_at: datetime
    
    class Config:
        populate_by_name = True

class UpdateBuildStatus(BaseModel):
    status: str
    end_time: Optional[datetime] = None
    output_log: Optional[str] = None

class JenkinsJobRequest(BaseModel):
    build_id: str
    job_type: str
    config: Dict[str, Any]
    command: str

# Dependency to get database
async def get_database():
    return database

# Jenkins Integration endpoints
@app.post("/api/jenkins/trigger", response_model=dict)
async def trigger_jenkins_job(job_request: JenkinsJobRequest):
    """Trigger a Jenkins job via jenkins.py script"""
    try:
        # Prepare data for jenkins.py script
        build_data = {
            "build_id": job_request.build_id,
            "job_type": job_request.job_type,
            "config": job_request.config,
            "command": job_request.command
        }
        
        # Convert to JSON string for command line argument
        build_data_json = json.dumps(build_data)
        
        # Execute jenkins.py script
        result = await execute_jenkins_script(build_data_json)
        
        return {
            "success": True,
            "message": "Jenkins job triggered successfully",
            "jenkins_result": result,
            "build_id": job_request.build_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to trigger Jenkins job: {str(e)}")

async def execute_jenkins_script(build_data_json: str) -> dict:
    """Execute the jenkins.py script asynchronously"""
    try:
        # Run jenkins.py script with build data
        process = await asyncio.create_subprocess_exec(
            "python3", "jenkins.py", build_data_json,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode == 0:
            # Parse JSON output from jenkins.py
            result = json.loads(stdout.decode())
            return result
        else:
            error_msg = stderr.decode() if stderr else "Unknown error"
            raise Exception(f"Jenkins script failed: {error_msg}")
            
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse Jenkins script output: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to execute Jenkins script: {str(e)}")

# Build Logs endpoints
@app.post("/api/build-logs", response_model=dict)
async def create_build_log(build_log: BuildLog, db=Depends(get_database)):
    """Create a new build log entry"""
    try:
        build_log_dict = build_log.model_dump()
        result = await db.build_logs.insert_one(build_log_dict)
        return {"id": str(result.inserted_id), "message": "Build log created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create build log: {str(e)}")

@app.get("/api/build-logs", response_model=List[BuildLogResponse])
async def get_build_logs(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    type: Optional[str] = None,
    db=Depends(get_database)
):
    """Get build logs with optional filtering"""
    try:
        query = {}
        if status:
            query["status"] = status
        if type:
            query["type"] = type
            
        cursor = db.build_logs.find(query).sort("start_time", -1).skip(skip).limit(limit)
        build_logs = []
        
        async for log in cursor:
            log["_id"] = str(log["_id"])
            build_logs.append(BuildLogResponse(**log))
            
        return build_logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch build logs: {str(e)}")

@app.get("/api/build-logs/{build_id}", response_model=BuildLogResponse)
async def get_build_log(build_id: str, db=Depends(get_database)):
    """Get a specific build log by build_id"""
    try:
        log = await db.build_logs.find_one({"build_id": build_id})
        if not log:
            raise HTTPException(status_code=404, detail="Build log not found")
        
        log["_id"] = str(log["_id"])
        return BuildLogResponse(**log)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch build log: {str(e)}")

@app.put("/api/build-logs/{build_id}", response_model=dict)
async def update_build_log(build_id: str, update_data: UpdateBuildStatus, db=Depends(get_database)):
    """Update build log status and other fields"""
    try:
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
        
        result = await db.build_logs.update_one(
            {"build_id": build_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Build log not found")
            
        return {"message": "Build log updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update build log: {str(e)}")

@app.delete("/api/build-logs/{build_id}", response_model=dict)
async def delete_build_log(build_id: str, db=Depends(get_database)):
    """Delete a build log"""
    try:
        result = await db.build_logs.delete_one({"build_id": build_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Build log not found")
            
        return {"message": "Build log deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete build log: {str(e)}")

@app.delete("/api/build-logs", response_model=dict)
async def clear_all_build_logs(db=Depends(get_database)):
    """Clear all build logs"""
    try:
        result = await db.build_logs.delete_many({})
        return {"message": f"Deleted {result.deleted_count} build logs"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear build logs: {str(e)}")

# Generated Code endpoints
@app.post("/api/generated-code", response_model=dict)
async def create_generated_code(code: GeneratedCode, db=Depends(get_database)):
    """Create a new generated code entry"""
    try:
        # Check if we have more than 10 entries, remove oldest if needed
        count = await db.generated_code.count_documents({})
        if count >= 10:
            # Remove oldest entries to keep only 9, so we can add 1 more
            oldest_entries = await db.generated_code.find().sort("created_at", 1).limit(count - 9).to_list(length=None)
            oldest_ids = [entry["_id"] for entry in oldest_entries]
            await db.generated_code.delete_many({"_id": {"$in": oldest_ids}})
        
        code_dict = code.model_dump()
        result = await db.generated_code.insert_one(code_dict)
        return {"id": str(result.inserted_id), "message": "Generated code saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save generated code: {str(e)}")

@app.get("/api/generated-code", response_model=List[GeneratedCodeResponse])
async def get_generated_code(skip: int = 0, limit: int = 10, db=Depends(get_database)):
    """Get generated code entries (limited to 10 most recent)"""
    try:
        cursor = db.generated_code.find().sort("created_at", -1).skip(skip).limit(limit)
        code_entries = []
        
        async for entry in cursor:
            entry["_id"] = str(entry["_id"])
            code_entries.append(GeneratedCodeResponse(**entry))
            
        return code_entries
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch generated code: {str(e)}")

@app.get("/api/generated-code/{code_id}", response_model=GeneratedCodeResponse)
async def get_generated_code_by_id(code_id: str, db=Depends(get_database)):
    """Get a specific generated code entry by ID"""
    try:
        if not ObjectId.is_valid(code_id):
            raise HTTPException(status_code=400, detail="Invalid code ID format")
            
        entry = await db.generated_code.find_one({"_id": ObjectId(code_id)})
        if not entry:
            raise HTTPException(status_code=404, detail="Generated code not found")
        
        entry["_id"] = str(entry["_id"])
        return GeneratedCodeResponse(**entry)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch generated code: {str(e)}")

@app.delete("/api/generated-code/{code_id}", response_model=dict)
async def delete_generated_code(code_id: str, db=Depends(get_database)):
    """Delete a specific generated code entry"""
    try:
        if not ObjectId.is_valid(code_id):
            raise HTTPException(status_code=400, detail="Invalid code ID format")
            
        result = await db.generated_code.delete_one({"_id": ObjectId(code_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Generated code not found")
            
        return {"message": "Generated code deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete generated code: {str(e)}")

@app.delete("/api/generated-code", response_model=dict)
async def clear_all_generated_code(db=Depends(get_database)):
    """Clear all generated code entries"""
    try:
        result = await db.generated_code.delete_many({})
        return {"message": f"Deleted {result.deleted_count} generated code entries"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear generated code: {str(e)}")

# Statistics endpoint
@app.get("/api/stats", response_model=dict)
async def get_stats(db=Depends(get_database)):
    """Get platform statistics"""
    try:
        # Build logs stats
        total_builds = await db.build_logs.count_documents({})
        running_builds = await db.build_logs.count_documents({"status": "running"})
        completed_builds = await db.build_logs.count_documents({"status": "completed"})
        failed_builds = await db.build_logs.count_documents({"status": "failed"})
        
        # Generated code stats
        total_generated_code = await db.generated_code.count_documents({})
        
        # Build types stats
        jtaf_builds = await db.build_logs.count_documents({"type": "JTAF Framework"})
        floating_builds = await db.build_logs.count_documents({"type": "Floating Framework"})
        os_builds = await db.build_logs.count_documents({"type": "OS Making"})
        
        return {
            "build_logs": {
                "total": total_builds,
                "running": running_builds,
                "completed": completed_builds,
                "failed": failed_builds,
                "by_type": {
                    "jtaf": jtaf_builds,
                    "floating": floating_builds,
                    "os_making": os_builds
                }
            },
            "generated_code": {
                "total": total_generated_code,
                "limit": 10
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
