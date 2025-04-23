import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8000/";
const DEMO_EMAILS = ["legit_user@email.com", "suspicious_actor@email.com"];

// Separate components for better organization
const ResultDisplay = ({ result }) => {
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

const DemoEmailButtons = ({ emails, onSelect }) => (
    <span className="demo-emails">
        {emails.map((email) => (
            <button
                type="button"
                key={email}
                className="demo-email-btn"
                onClick={() => onSelect(email)}
            >
                {email}
            </button>
        ))}
    </span>
);

function App() {
    // State management
    const [userId, setUserId] = useState(DEMO_EMAILS[0]);
    const [requestText, setRequestText] = useState("");
    const [result, setResult] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get geolocation on component mount
    useEffect(() => {
        const getGeolocation = () => {
            if (!("geolocation" in navigator)) {
                const errorMsg = "Geolocation is not available in this browser.";
                setLocationError(errorMsg);
                console.error(errorMsg);
                return;
            }

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
        };

        getGeolocation();
    }, []);

    // Using useCallback to memoize the submit handler
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!requestText.trim() || !userId.trim()) return;

        setResult(null);
        setIsLoading(true);

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
            
            const response = await axios.post(API_URL, payload);
            setResult(response.data);
            setRequestText(""); // Clear the form after successful submission
        } catch (error) {
            setResult({error: `Sorry, something went wrong. Please try again. ${error}`});
        } finally {
            setIsLoading(false);
        }
    }, [requestText, userId, location]);

    // Input change handlers
    const handleUserIdChange = (e) => setUserId(e.target.value);
    const handleRequestTextChange = (e) => setRequestText(e.target.value);

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
                            onChange={handleUserIdChange}
                            placeholder="Enter your email"
                            required
                            className="email-input"
                        />
                    </label>
                    <DemoEmailButtons emails={DEMO_EMAILS} onSelect={setUserId} />
                </div>
                <textarea
                    value={requestText}
                    onChange={handleRequestTextChange}
                    placeholder="Enter your support request..."
                    rows={5}
                    required
                    className="request-textarea"
                />
                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
                {locationError && (
                    <p className="location-error">
                        Note: {locationError}
                    </p>
                )}
            </form>

            {result && <div className="result-block"><ResultDisplay result={result} /></div>}
        </div>
    );
}

export default App;