"""
Jenkins Integration Script for Framework Hub
This script handles Jenkins job triggering and management
"""

import json
import sys
import os
import subprocess
import logging
from datetime import datetime
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('jenkins.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

class JenkinsJobTrigger:
    """
    Handles Jenkins job triggering for different framework types
    """
    
    def __init__(self):
        self.jenkins_url = os.getenv('JENKINS_URL', 'http://localhost:8080')
        self.jenkins_user = os.getenv('JENKINS_USER', 'admin')
        self.jenkins_token = os.getenv('JENKINS_TOKEN', 'your-token-here')
        
    def trigger_job(self, build_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Trigger a Jenkins job based on the build data
        
        Args:
            build_data: Dictionary containing build information
            
        Returns:
            Dictionary with job trigger result
        """
        try:
            build_id = build_data.get('build_id')
            job_type = build_data.get('job_type')
            config = build_data.get('config', {})
            command = build_data.get('command', '')
            
            logger.info(f"Triggering Jenkins job for build: {build_id}")
            logger.info(f"Job type: {job_type}")
            
            # Determine Jenkins job name based on framework type
            jenkins_job_name = self._get_jenkins_job_name(job_type)
            
            # Prepare job parameters
            job_params = self._prepare_job_parameters(build_data)
            
            # Log the job trigger attempt
            logger.info(f"Jenkins job: {jenkins_job_name}")
            logger.info(f"Parameters: {json.dumps(job_params, indent=2)}")
            
            # In a real implementation, this would make actual Jenkins API calls
            # For now, we'll simulate the job trigger
            result = self._simulate_jenkins_trigger(jenkins_job_name, job_params)
            
            logger.info(f"Jenkins job triggered successfully: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Failed to trigger Jenkins job: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def _get_jenkins_job_name(self, job_type: str) -> str:
        """Get Jenkins job name based on framework type"""
        job_mapping = {
            "JTAF Framework": "jtaf-execution-pipeline",
            "Floating Framework": "floating-execution-pipeline", 
            "OS Making": "os-builder-pipeline"
        }
        return job_mapping.get(job_type, "default-pipeline")
    
    def _prepare_job_parameters(self, build_data: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare parameters for Jenkins job"""
        config = build_data.get('config', {})
        
        # Common parameters
        params = {
            "BUILD_ID": build_data.get('build_id'),
            "JOB_TYPE": build_data.get('job_type'),
            "COMMAND": build_data.get('command', ''),
            "TIMESTAMP": datetime.now().isoformat()
        }
        
        # Add framework-specific parameters
        job_type = build_data.get('job_type')
        
        if job_type == "JTAF Framework":
            params.update({
                "TEST_SUITE": config.get('testSuite', ''),
                "ENVIRONMENT": config.get('environment', 'dev'),
                "BROWSER": config.get('browser', 'chrome'),
                "PARALLEL_THREADS": config.get('parallel', '1'),
                "TIMEOUT": config.get('timeout', '30'),
                "LOG_LEVEL": config.get('logLevel', 'info'),
                "OUTPUT_DIR": config.get('outputDir', './results')
            })
            
        elif job_type == "Floating Framework":
            params.update({
                "TASK_NAME": config.get('taskName', ''),
                "ENVIRONMENT": config.get('environment', 'dev'),
                "WORKERS": config.get('workers', '1'),
                "TIMEOUT": config.get('timeout', '60'),
                "LOG_LEVEL": config.get('logLevel', 'info'),
                "OUTPUT_DIR": config.get('outputDir', './output')
            })
            
        elif job_type == "OS Making":
            params.update({
                "OS_TYPE": config.get('osType', 'ubuntu'),
                "OS_VERSION": config.get('version', '22.04'),
                "ARCHITECTURE": config.get('architecture', 'x86_64'),
                "PACKAGES": config.get('packages', ''),
                "CUSTOMIZATIONS": config.get('customizations', '')
            })
        
        return params
    
    def _simulate_jenkins_trigger(self, job_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simulate Jenkins job trigger (replace with actual Jenkins API calls)
        """
        # In a real implementation, you would use jenkins-python library:
        # 
        # import jenkins
        # server = jenkins.Jenkins(self.jenkins_url, username=self.jenkins_user, password=self.jenkins_token)
        # queue_id = server.build_job(job_name, params)
        # 
        # For now, we simulate the response
        
        return {
            "success": True,
            "job_name": job_name,
            "queue_id": f"queue-{datetime.now().timestamp()}",
            "build_number": f"build-{datetime.now().timestamp()}",
            "parameters": params,
            "jenkins_url": f"{self.jenkins_url}/job/{job_name}",
            "console_url": f"{self.jenkins_url}/job/{job_name}/lastBuild/console",
            "timestamp": datetime.now().isoformat(),
            "message": f"Jenkins job '{job_name}' triggered successfully"
        }
    
    def get_job_status(self, job_name: str, build_number: str) -> Dict[str, Any]:
        """
        Get status of a Jenkins job
        """
        try:
            # In real implementation, query Jenkins API for job status
            # For now, simulate status response
            return {
                "job_name": job_name,
                "build_number": build_number,
                "status": "SUCCESS",  # or "RUNNING", "FAILED", etc.
                "duration": "2m 30s",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Failed to get job status: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

def main():
    """
    Main function to handle command line execution
    """
    if len(sys.argv) < 2:
        print("Usage: python jenkins.py <build_data_json>")
        sys.exit(1)
    
    try:
        # Parse build data from command line argument
        build_data_json = sys.argv[1]
        build_data = json.loads(build_data_json)
        
        # Create Jenkins job trigger instance
        jenkins_trigger = JenkinsJobTrigger()
        
        # Trigger the job
        result = jenkins_trigger.trigger_job(build_data)
        
        # Output result as JSON
        print(json.dumps(result, indent=2))
        
        # Exit with appropriate code
        sys.exit(0 if result.get('success', False) else 1)
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON data: {str(e)}")
        print(json.dumps({"success": False, "error": "Invalid JSON data"}))
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
