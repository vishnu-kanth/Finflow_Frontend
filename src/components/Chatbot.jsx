import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CHATBOT_STYLES = {
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#0b1c3e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(11, 28, 62, 0.4)',
    cursor: 'pointer',
    zIndex: 99999,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  window: {
    position: 'fixed',
    bottom: '90px',
    right: '24px',
    width: '360px',
    height: '480px',
    maxHeight: '70vh',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 99999,
  },
  header: {
    background: 'linear-gradient(135deg, #0b1c3e 0%, #162d5a 100%)',
    color: '#ffffff',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
  },
  headerTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  headerSub: {
    margin: 0,
    fontSize: '11px',
    opacity: 0.75,
  },
  messagesArea: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  msgRow: (isUser) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  }),
  msgBubble: (isUser) => ({
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
    fontSize: '13px',
    lineHeight: '1.5',
    backgroundColor: isUser ? '#0b1c3e' : '#ffffff',
    color: isUser ? '#ffffff' : '#334155',
    border: isUser ? 'none' : '1px solid #e2e8f0',
    boxShadow: isUser ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
  }),
  inputBar: {
    padding: '12px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: '999px',
    padding: '10px 16px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  sendBtn: (disabled) => ({
    backgroundColor: disabled ? '#94a3b8' : '#0b1c3e',
    color: '#ffffff',
    padding: '10px',
    borderRadius: '50%',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  }),
};

const Chatbot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am the FinFlow AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      let context = 'User role: ' + (user?.role || 'GUEST');
      if (user?.name) context += ', Name: ' + user.name;

      const response = await api.post('/ai/chat', {
        message: userMessage,
        context: context,
      });

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: response.data.reply || "Sorry, I couldn't process that." },
      ]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: "⚠️ I'm currently offline. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };


  // Chatbot is available on all pages (including Landing, Login, Signup)

  const chatbotUI = (
    <>
      {/* Floating Action Button */}
      <button
        id="finflow-chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        style={CHATBOT_STYLES.fab}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div id="finflow-chatbot-window" style={CHATBOT_STYLES.window}>
          {/* Header */}
          <div style={CHATBOT_STYLES.header}>
            <div style={CHATBOT_STYLES.headerIcon}>
              <Bot size={18} />
            </div>
            <div>
              <h3 style={CHATBOT_STYLES.headerTitle}>FinFlow AI</h3>
              <p style={CHATBOT_STYLES.headerSub}>Online • Powered by Gemini</p>
            </div>
          </div>

          {/* Messages */}
          <div style={CHATBOT_STYLES.messagesArea}>
            {messages.map((msg, idx) => (
              <div key={idx} style={CHATBOT_STYLES.msgRow(msg.sender === 'user')}>
                <div style={CHATBOT_STYLES.msgBubble(msg.sender === 'user')}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={CHATBOT_STYLES.msgRow(false)}>
                <div style={{ ...CHATBOT_STYLES.msgBubble(false), display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ color: '#64748b' }}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={CHATBOT_STYLES.inputBar}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              style={CHATBOT_STYLES.input}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={CHATBOT_STYLES.sendBtn(loading || !input.trim())}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Spinner keyframes injected once */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );

  // Use React Portal to render directly into document.body
  // This guarantees no parent CSS can clip or hide it
  return ReactDOM.createPortal(chatbotUI, document.body);
};

export default Chatbot;
