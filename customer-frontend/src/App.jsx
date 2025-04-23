import { useState } from "react";
import axios from "axios";
import "./App.css";

const DEMO_EMAILS = ["legit_user@email.com", "suspicious_actor@email.com"];

function App() {
  const [userId, setUserId] = useState(DEMO_EMAILS[0]);
  const [requestText, setRequestText] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestText.trim() || !userId.trim()) return;

    setResult(null);

    try {
      const response = await axios.post("http://localhost:8000/support-check", {
        user_id: userId,
        request_text: requestText,
      });
      setResult(response.data);
    } catch {
      setResult({ error: "Sorry, something went wrong. Please try again." });
    }

    setRequestText("");
  };

  // Helper to render different outcomes
  const renderResult = () => {
    if (!result) return null;
    if (result.error) {
      return <div className="error">{result.error}</div>;
    }

    switch (result.action) {
      case "allow":
        return (
          <div className="success">
            <div>
              <strong>AI Reply:</strong> {result.reply}
            </div>
            <div>
              <strong>Risk Score:</strong> {result.risk_score}
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
      case "warn":
        return (
          <div className="warning">
            <div>
              <strong>AI Reply:</strong> {result.reply}
            </div>
            <div>
              <strong>Risk Score:</strong> {result.risk_score}
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
            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <strong>Recommendations:</strong>
                <ul>
                  {result.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="warn-message">
              Warning: Your request contains suspicious content. Please review
              the recommendations above.
            </div>
          </div>
        );
      case "block":
        return (
          <div className="block">
            <div>
              <strong>AI Reply:</strong> {result.reply}
            </div>
            <div>
              <strong>Risk Score:</strong> {result.risk_score}
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
            <div className="block-message">
              <strong>
                Your account has been temporarily suspended due to a high-risk
                or malicious request.
              </strong>
              <br />
              If you believe this is a mistake, please contact support.
            </div>
          </div>
        );
      default:
        return (
          <div>
            <div>
              <strong>AI Reply:</strong> {result.reply}
            </div>
            <div>
              <strong>Risk Score:</strong> {result.risk_score}
            </div>
          </div>
        );
    }
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
      </form>

      {result && <div className="result-block">{renderResult()}</div>}
    </div>
  );
}

export default App;
