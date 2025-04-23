import { useState } from "react";
import axios from "axios";
import "./App.css";

const DEMO_EMAILS = ["legit_user@email.com", "suspicious_actor@email.com"];

function App() {
  const [userId, setUserId] = useState(DEMO_EMAILS[0]);
  const [requestText, setRequestText] = useState("");
  const [messages, setMessages] = useState([]); // [{role, text, risk_score, reasons}]

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestText.trim() || !userId.trim()) return;

    // Add the user's message to the history
    setMessages((prev) => [...prev, { role: "user", text: requestText }]);

    try {
      const response = await axios.post("http://localhost:8000/support-check", {
        user_id: userId,
        request_text: requestText,
      });

      // It is assumed that the backend returns reply, risk_score, and reasons
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.reply,
          risk_score: response.data.risk_score,
          reasons: response.data.reasons,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
    setRequestText("");
  };

  return (
    <div className="AppContainer">
      <h1>SecureHome AB - Submit Support Request</h1>
      <p className="subtitle">
        Smart, Secure, and Instant Support — Powered by AI
      </p>
      {messages.length > 0 && (
        <div className="chat-thread">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.role === "user" ? "msg-user" : "msg-assistant"}
            >
              <div className="msg-text">{msg.text}</div>
              {msg.role === "assistant" && msg.risk_score !== undefined && (
                <div className="fraud-info">
                  <span>Risk Score: {msg.risk_score}</span>
                  {msg.reasons && (
                    <ul>
                      {msg.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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
            Demo:
            {DEMO_EMAILS.map((demo) => (
              <button
                type="button"
                key={demo}
                style={{
                  marginLeft: 6,
                  padding: "2px 8px",
                  fontSize: "0.9em",
                  cursor: "pointer",
                }}
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
    </div>
  );
}

export default App;
