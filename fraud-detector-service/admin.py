"""
Admin UI handling for the fraud detection service.
Provides a web UI to view stored requests.
"""
from aiohttp import web
import datetime
from storage import load_requests

# HTML template for the admin page
ADMIN_HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fraud Detection Admin</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
            font-size: 18px;
        }}
        h1 {{
            color: #333;
            font-size: 28px;
            margin-bottom: 20px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            font-size: 18px;
        }}
        th {{
            background-color: #444;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }}
        td {{
            padding: 16px;
            border-bottom: 1px solid #ddd;
        }}
        .safe {{
            background-color: #d4edda;
            color: #155724;
        }}
        .warning {{
            background-color: #fff3cd;
            color: #856404;
        }}
        .danger {{
            background-color: #f8d7da;
            color: #721c24;
        }}
        .ellipsis {{
            max-width: 400px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
        }}
        .timestamp {{
            white-space: nowrap;
        }}
        .score {{
            font-weight: bold;
            text-align: center;
        }}
        .refresh {{
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 18px;
            margin-bottom: 20px;
        }}
        .refresh:hover {{
            background-color: #0069d9;
        }}
        .no-data {{
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 4px;
            color: #6c757d;
            font-size: 18px;
        }}
    </style>
</head>
<body>
    <h1>Customer Requests</h1>
    <button class="refresh" onclick="window.location.reload()">Refresh Data</button>
    <div style="margin: 10px 0;">
        <span class="safe" style="padding: 5px 10px; border-radius: 4px;">Safe (0.00-0.33)</span>
        <span class="warning" style="padding: 5px 10px; border-radius: 4px; margin: 0 10px;">Warning (0.33-0.66)</span>
        <span class="danger" style="padding: 5px 10px; border-radius: 4px;">Fraud (0.66-1.00)</span>
    </div>
    
    {table_content}
    
    <script>
        // Auto-refresh the page every 30 seconds
        setTimeout(function() {{
            window.location.reload();
        }}, 30000);
    </script>
</body>
</html>
"""

TABLE_TEMPLATE = """
<table>
    <thead>
        <tr>
            <th>Time</th>
            <th>User ID</th>
            <th>Location</th>
            <th>Request</th>
            <th>Score</th>
            <th>Evaluation</th>
        </tr>
    </thead>
    <tbody>
        {rows}
    </tbody>
</table>
"""

ROW_TEMPLATE = """
<tr class="{row_class}">
    <td class="timestamp">{timestamp}</td>
    <td>{user_id}</td>
    <td>{location}</td>
    <td><span class="ellipsis">{request_text}</span></td>
    <td class="score">{score}</td>
    <td><span class="ellipsis">{comment}</span></td>
</tr>
"""

NO_DATA_TEMPLATE = """
<div class="no-data">
    No requests have been recorded yet. Submit some requests to see them here.
</div>
"""

def format_timestamp(timestamp_str):
    """Format ISO timestamp to a more readable format."""
    try:
        dt = datetime.datetime.fromisoformat(timestamp_str)
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        return timestamp_str

def get_row_class(score):
    """Determine the CSS class based on fraud score."""
    if score < 0.33:
        return "safe"
    elif score < 0.66:
        return "warning"
    else:
        return "danger"

def truncate_text(text, max_length=100):
    """Truncate text and add ellipsis if needed."""
    if not text:
        return "N/A"
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."

async def handle_admin(request):
    """Handler for the admin UI page."""
    requests = await load_requests()
    
    if not requests:
        table_content = NO_DATA_TEMPLATE
    else:
        rows = []
        # Reverse to show newest first
        for req in reversed(requests):
            try:
                timestamp = format_timestamp(req["timestamp"])
                user_id = req["request"].get("user_id", "Unknown")
                
                # Format location
                lat = req["request"].get("latitude", "N/A")
                lng = req["request"].get("longitude", "N/A")
                location = f"{lat}, {lng}" if lat != "N/A" and lng != "N/A" else "N/A"
                
                request_text = truncate_text(req["request"]["request_text"])
                score = req["response"]["score"]
                comment = truncate_text(req["response"]["comment"])
                
                row_class = get_row_class(score)
                
                row = ROW_TEMPLATE.format(
                    row_class=row_class,
                    timestamp=timestamp,
                    user_id=user_id,
                    location=location,
                    request_text=request_text,
                    score=f"{score:.2f}",
                    comment=comment
                )
                rows.append(row)
            except (KeyError, TypeError) as e:
                # Skip malformed entries
                continue
        
        table_content = TABLE_TEMPLATE.format(rows="".join(rows))
    
    html_content = ADMIN_HTML_TEMPLATE.format(table_content=table_content)
    return web.Response(text=html_content, content_type='text/html')