import asyncio
from aiohttp import web
from handlers import handle_fraud_detection, handle_options
from config import SERVER_HOST, SERVER_PORT

async def main():
    """Sets up and starts the aiohttp web server."""
    app = web.Application()

    # Register routes
    app.router.add_post('/', handle_fraud_detection)
    app.router.add_route('OPTIONS', '/', handle_options) # Handle CORS preflight

    # Setup application runner
    runner = web.AppRunner(app)
    await runner.setup()

    # Create TCP site server
    site = web.TCPSite(runner, SERVER_HOST, SERVER_PORT)

    # Start the server
    print(f"Starting server on http://{SERVER_HOST}:{SERVER_PORT}...")
    await site.start()

    # Keep the server running until interrupted
    # Use asyncio.Event().wait() for indefinite running
    # Or use await asyncio.sleep(3600*24) # Example: Run for 1 day
    await asyncio.Event().wait()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped gracefully.")
    except Exception as e:
        print(f"\nAn error occurred during server startup or runtime: {e}")
