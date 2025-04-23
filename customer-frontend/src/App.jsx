import {useState, useEffect} from "react";
import axios from "axios";
import "./App.css";

const DEMO_EMAILS = ["legit_user@email.com", "suspicious_actor@email.com"];

function App() {
    const [userId, setUserId] = useState(DEMO_EMAILS[0]);
    const [requestText, setRequestText] = useState("Hi there! Can I get access to my motorbike?");
    const [result, setResult] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setLocationError(null);
                },
                (error) => {
                    let errorMessage;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "User denied the request for geolocation.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "The request to get user location timed out.";
                            break;
                        default:
                            errorMessage = "An unknown error occurred.";
                    }
                    setLocationError(errorMessage);
                    console.error(errorMessage);
                }
            );
        } else {
            setLocationError("Geolocation is not available in this browser.");
            console.error("Geolocation is not available in this browser.");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!requestText.trim() || !userId.trim()) return;

        setResult(null);

        try {
            const payload = {
                user_id: userId,
                request_text: requestText,
            };
            
            // Add location data if available
            if (location) {
                payload.latitude = location.latitude;
                payload.longitude = location.longitude;
            }
            
            const response = await axios.post("http://localhost:8000/", payload);
            setResult(response.data);
        } catch (error) {
            setResult({error: `Sorry, something went wrong. Please try again. ${error}`});
        }

        setRequestText("");
    };

    // Helper to render different outcomes
    const renderResult = () => {
        if (!result) return null;
        if (result.error) {
            return <div className="error">{result.error}</div>;
        }

        return (
            <div className={result.fraud ? "warning" : "success"}>
                <div>
                    <strong>AI reply:</strong> {result.fraud ? 'FRAUD!' : 'Not fraud'}
                </div>
                <div>
                    <strong>Risk score:</strong> {result.score}
                </div>
                <div>
                    <strong>Comment:</strong> {result.comment}
                </div>
                {result.reasons && result.reasons.length > 0 && (
                    <div>
                        <strong>Reasons:</strong>
                        <ul>
                            {result.reasons.map((reason, i) => (
                                <li key={i}>{reason}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="good-message">
                    Your request has been submitted successfully and is considered
                    safe.
                </div>
            </div>
        );
    };

    return (
        <div className="AppContainer">
            <h1>SecureHome AB - Submit Support Request</h1>
            <p className="subtitle">
                Smart, Secure, and Instant Support — Powered by AI
            </p>

            <form onSubmit={handleSubmit} className="support-form">
                <div className="form-row">
                    <label>
                        <strong>User ID / Email:</strong>{" "}
                        <input
                            type="email"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="email-input"
                        />
                    </label>
                    <span className="demo-emails">
            {DEMO_EMAILS.map((demo) => (
                <button
                    type="button"
                    key={demo}
                    className="demo-email-btn"
                    onClick={() => setUserId(demo)}
                >
                    {demo}
                </button>
            ))}
          </span>
                </div>
                <textarea
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Enter your support request..."
                    rows={5}
                    required
                    className="request-textarea"
                />
                <button type="submit" className="submit-btn">
                    Send
                </button>
                {locationError && (
                    <p className="location-error">
                        Note: {locationError}
                    </p>
                )}
            </form>

            {result && <div className="result-block">{renderResult()}</div>}
        </div>
    );
}

export default App;
