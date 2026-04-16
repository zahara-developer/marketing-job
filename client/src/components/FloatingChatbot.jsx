import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const starterMessages = [
  {
    role: 'bot',
    text: 'Hi, I can help with marketing roles, sales jobs, skills, interviews, and applying.'
  }
];

const getBotReply = (message) => {
  const normalizedMessage = message.trim().toLowerCase();

  if (!normalizedMessage) {
    return 'Ask me anything about marketing and sales careers.';
  }

  if (normalizedMessage.includes('apply') || normalizedMessage.includes('job')) {
    return 'Go to the Contact page, choose the role you want, and submit the application form with your details.';
  }

  if (normalizedMessage.includes('marketing')) {
    return 'Marketing roles usually focus on SEO, content, campaigns, social media, analytics, and brand growth.';
  }

  if (normalizedMessage.includes('sales')) {
    return 'Sales roles are great if you enjoy communication, lead generation, persuasion, client handling, and closing.';
  }

  if (normalizedMessage.includes('skill') || normalizedMessage.includes('learn')) {
    return 'Start with communication, CRM basics, SEO, analytics, presentation, audience research, and campaign thinking.';
  }

  if (normalizedMessage.includes('interview') || normalizedMessage.includes('resume')) {
    return 'Prepare a short introduction, role-specific examples, measurable outcomes, and a clear reason for wanting the role.';
  }

  if (normalizedMessage.includes('fresher') || normalizedMessage.includes('start')) {
    return 'Freshers often start with digital marketing, SEO, content support, business development, and inside sales roles.';
  }

  return 'I can help with roles, skills, interviews, freshers, and how to apply. Try asking one of those.';
};

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmedInput },
      { role: 'bot', text: getBotReply(trimmedInput) }
    ]);
    setInput('');
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-fab"
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="chatbot-float-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chatbot-header">
              <span className="section-eyebrow">Career Chatbot</span>
              <h3>Ask a quick question</h3>
            </div>

            <div className="chatbot-panel">
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : ''}`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>

              <form className="chatbot-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about jobs, skills, or interviews"
                />
                <button type="submit" className="primary-button">
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default FloatingChatbot;
