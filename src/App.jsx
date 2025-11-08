// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to /chatbot */}
        <Route path="/" element={<Navigate to="/chatbot" />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
