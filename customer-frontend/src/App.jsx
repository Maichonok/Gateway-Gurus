import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8000/";
const DEMO_EMAILS = ["legit_user@email.com", "suspicious_actor@email.com"];

// Header Component
const Header = () => (
  <header className="header">
    <div className="header-container">
      <div className="logo">
        <div className="logo-text">SecureHome<span style={{ color: "#a8dadc" }}>AB</span></div>
      </div>
      <nav className="nav-links">
        <a href="#" className="nav-link">Products</a>
        <a href="#" className="nav-link">Solutions</a>
        <a href="#" className="nav-link">Support</a>
        <a href="#" className="nav-link">Contact</a>
      </nav>
    </div>
  </header>
);

// Hero Component
const Hero = () => (
  <section className="hero">
    <h1>Smart Home Security Solutions</h1>
    <p>
      Protecting what matters most with cutting-edge technology and round-the-clock support.
    </p>
  </section>
);

// Company Description Component
const CompanyDescription = () => (
  <div className="company-description">
    <h2>Welcome to SecureHome AB</h2>
    <p>
      At SecureHome AB, we're committed to keeping your home safe with our premium range of 
      smart security devices. From intelligent doorbells and locks to comprehensive camera systems, 
      our products are designed to give you peace of mind wherever you are.
    </p>
    <p>
      Our innovative platform connects all your security devices in one easy-to-use interface, 
      allowing you to monitor and control your home security from anywhere. With real-time alerts, 
      automatic emergency response, and 24/7 customer support, you can trust SecureHome AB to 
      protect what matters most to you.
    </p>
  </div>
);

// Footer Component
const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-section">
        <h3>SecureHome AB</h3>
        <p>Smart security solutions for the modern home.</p>
      </div>
      <div className="footer-section">
        <h3>Products</h3>
        <ul className="footer-links">
          <li><a href="#">Smart Doorbell</a></li>
          <li><a href="#">Security Cameras</a></li>
          <li><a href="#">Smart Locks</a></li>
          <li><a href="#">Alarm Systems</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Support</h3>
        <ul className="footer-links">
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Installation Guide</a></li>
          <li><a href="#">Troubleshooting</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Contact</h3>
        <p>Email: support@securehome.ab</p>
        <p>Phone: +46 8 123 45 67</p>
        <p>Stockholm, Sweden</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2025 SecureHome AB. All rights reserved.</p>
    </div>
  </footer>
);

// Result Display Component
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

// Demo Email Buttons Component
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

// Support Form Component
const SupportForm = ({ userId, requestText, locationError, isLoading, onUserIdChange, onRequestTextChange, onSubmit, onSelectEmail }) => (
  <form onSubmit={onSubmit} className="support-form">
    <div className="form-row">
      <label>
        <strong>User ID / Email:</strong>
        <input
          type="email"
          value={userId}
          onChange={onUserIdChange}
          placeholder="Enter your email"
          required
          className="email-input"
        />
      </label>
      <DemoEmailButtons emails={DEMO_EMAILS} onSelect={onSelectEmail} />
    </div>
    <textarea
      value={requestText}
      onChange={onRequestTextChange}
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
    <>
      <Header />
      <Hero />
      <div className="main-content">
        <CompanyDescription />
        <div className="form-section">
          <div className="AppContainer">
            <h1 className="support-request-header">Submit a Support Request</h1>
            <p className="subtitle">
              Smart, Secure, and Instant Support — Powered by AI
            </p>

            <SupportForm
              userId={userId}
              requestText={requestText}
              locationError={locationError}
              isLoading={isLoading}
              onUserIdChange={handleUserIdChange}
              onRequestTextChange={handleRequestTextChange}
              onSubmit={handleSubmit}
              onSelectEmail={setUserId}
            />

            {result && <div className="result-block"><ResultDisplay result={result} /></div>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;