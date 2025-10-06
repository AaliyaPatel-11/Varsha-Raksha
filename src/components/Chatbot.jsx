// src/components/Chatbot.jsx

import { useState, useEffect, useRef } from 'react';

// --- Helper function to format the AI's markdown response into HTML ---
const formatResponse = (text) => {
  // Convert bold text (**text**) to <strong>text</strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert unordered list items (* item) to <li>item</li>
  // and wrap the whole list in a <ul>
  if (formattedText.includes('* ')) {
    const listItems = formattedText.split('* ').slice(1);
    const htmlList = listItems.map(item => `<li>${item.trim()}</li>`).join('');
    formattedText = `<ul>${htmlList}</ul>`;
  }

  // Convert newlines to <br> tags for spacing
  formattedText = formattedText.replace(/\n/g, '<br />');

  return formattedText;
};


const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  // --- UPDATED: More friendly intro message ---
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi there! I’m Raksha Mitra, your guide to monsoon safety. Let’s make sure you’re ready for anything the rain brings!" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = { from: 'user', text: userInput.trim() };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiApiKey) {
      const aiMessage = { from: 'ai', text: "Sorry, the AI assistant is not configured correctly." };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      return;
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;
    // --- UPDATED: New system prompt with the bot's name and personality ---
    const systemPrompt = "You are Raksha Mitra, a friendly and reassuring AI assistant for the VarshaRaksha app. Your purpose is to provide clear, simple, and practical advice on monsoon safety in India. Always be encouraging and helpful. Use markdown formatting (bolding for emphasis, and unordered lists for steps or items) to make your answers easy to read. Do not answer questions outside of this safety context.";
    
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage.text }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
        })
      });

      if (!response.ok) throw new Error("API request failed.");
      
      const result = await response.json();
      const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const aiMessage = { from: 'ai', text: aiResponse || "Sorry, I couldn't process that. Please try again." };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const aiMessage = { from: 'ai', text: "Sorry, I'm having trouble connecting. Please check your connection and try again." };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
        🤖
      </button>
      
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Raksha Mitra</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from}`}>
                {/* --- UPDATED: Render formatted HTML for AI messages --- */}
                {msg.from === 'ai' ? (
                  <div dangerouslySetInnerHTML={{ __html: formatResponse(msg.text) }} />
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isLoading && <div className="message ai typing"><span>.</span><span>.</span><span>.</span></div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a safety question..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;

