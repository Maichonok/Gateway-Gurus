#!/usr/bin/env python3
"""
Simple command-line utility to view stored fraud detection requests.
"""
import argparse
import json
from typing import Dict, Any, List
from storage import get_requests_sync

def print_request(request: Dict[str, Any], detailed: bool = False) -> None:
    """Print a single request in a readable format."""
    print(f"Timestamp: {request['timestamp']}")
    print(f"User ID: {request['request'].get('user_id', 'N/A')}")
    print(f"Request Text: {request['request']['request_text']}")
    
    if request['request'].get('latitude') and request['request'].get('longitude'):
        print(f"Location: {request['request']['latitude']}, {request['request']['longitude']}")
    
    print(f"Fraud: {'Yes' if request['response']['fraud'] else 'No'}")
    print(f"Score: {request['response']['score']}")
    print(f"Comment: {request['response']['comment']}")
    
    if detailed:
        print("\nFull Request Data:")
        print(json.dumps(request['request'], indent=2))
        print("\nFull Response Data:")
        print(json.dumps(request['response'], indent=2))
    
    print("-" * 50)

def main():
    parser = argparse.ArgumentParser(description="View stored fraud detection requests")
    parser.add_argument("--all", action="store_true", help="Show all requests")
    parser.add_argument("--last", type=int, default=5, help="Show last N requests")
    parser.add_argument("--detailed", action="store_true", help="Show detailed request/response data")
    args = parser.parse_args()
    
    requests = get_requests_sync()
    
    if not requests:
        print("No requests stored yet.")
        return
    
    print(f"Total requests: {len(requests)}")
    
    if args.all:
        for req in requests:
            print_request(req, args.detailed)
    else:
        for req in requests[-args.last:]:
            print_request(req, args.detailed)

if __name__ == "__main__":
    main()