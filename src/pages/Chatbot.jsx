import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const DEFAULT_STUDENT_ID = "student_12345";
  const DEFAULT_ORG_ID = "org_001";

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const handleDetect = async () => {
    if (!apiKey.trim()) {
      setMessages(prev => [...prev, { sender: "system", text: "⚠️ Please enter your API key." }]);
      return;
    }
    if (!question.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: question }]);
    setLoading(true);
    setQuestion("");

    try {
      const res = await fetch("https://nova-bot-topaz.vercel.app/detect_topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          question,
          student_id: DEFAULT_STUDENT_ID,
          org_id: DEFAULT_ORG_ID,
        }),
      });

      const data = await res.json();
      const reply = res.status !== 200
        ? data.detail || "❌ Unknown backend error"
        : data.category || "No response detected";

      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "bot", text: "❌ Error connecting to backend" }]);
    }

    setLoading(false);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f0f2f5",
      fontFamily: "sans-serif"
    }}>
      
      {/* Sticky top bar for API key */}
      <div style={{
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 10
      }}>
        <span style={{ fontWeight: "bold" }}>🎓 Chatbot</span>
        <input
          type="text"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Enter API Key"
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 20,
            border: "none",
            outline: "none"
          }}
        />
      </div>

      {/* Chat messages */}
      <div style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div style={{
              maxWidth: "60%",
              padding: "10px 15px",
              borderRadius: 20,
              backgroundColor: msg.sender === "user" ? "#4CAF50" : "#eee",
              color: msg.sender === "user" ? "#fff" : "#000",
              wordBreak: "break-word"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        display: "flex",
        padding: "10px 20px",
        borderTop: "1px solid #ddd",
        backgroundColor: "#fff",
      }}>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleDetect()}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: "12px 15px",
            borderRadius: 20,
            border: "1px solid #ccc",
            marginRight: 10
          }}
        />
        <button
          onClick={handleDetect}
          disabled={loading || !question.trim()}
          style={{
            padding: "12px 20px",
            borderRadius: 20,
            border: "none",
            backgroundColor: loading ? "#aaa" : "#4CAF50",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
