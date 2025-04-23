import json
import os
import datetime
from pathlib import Path
import asyncio
from typing import Dict, List, Any

# Constants
DATA_DIR = Path(__file__).parent / "data"
REQUESTS_FILE = DATA_DIR / "requests.json"

# Create data directory if it doesn't exist
DATA_DIR.mkdir(exist_ok=True)

# File lock to prevent concurrent writes
file_lock = asyncio.Lock()

async def load_requests() -> List[Dict[str, Any]]:
    """Load existing requests from the JSON file."""
    try:
        if REQUESTS_FILE.exists():
            async with file_lock:
                with open(REQUESTS_FILE, "r") as f:
                    return json.load(f)
        return []
    except json.JSONDecodeError:
        # If the file is corrupted, return an empty list
        return []

def get_requests_sync() -> List[Dict[str, Any]]:
    """Synchronous version of load_requests for command-line tools."""
    try:
        if REQUESTS_FILE.exists():
            with open(REQUESTS_FILE, "r") as f:
                return json.load(f)
        return []
    except json.JSONDecodeError:
        # If the file is corrupted, return an empty list
        return []

async def save_request(request_data: Dict[str, Any], response_data: Dict[str, Any]) -> None:
    """Save a request and its response to the JSON file."""
    # Add timestamp to the log entry
    log_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "request": request_data,
        "response": response_data
    }
    
    # Load existing requests
    requests = await load_requests()
    
    # Add new request
    requests.append(log_entry)
    
    # Save back to file
    async with file_lock:
        with open(REQUESTS_FILE, "w") as f:
            json.dump(requests, f, indent=2)