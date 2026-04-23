import React, { useState, useEffect, useRef } from "react";

export function ChatBubble() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getReply = () => {
    const replies = [
      "Hello! How can I help you today?",
      "That's interesting! Tell me more.",
      "I understand. What would you like to do next?",
      "Great question! Let me think about that.",
      "Thanks for sharing! Is there anything else?",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const appendMsg = (text, sender) => {
    setMessages((prev) => [
      ...prev,
      { text, sender, id: Date.now() + Math.random() },
    ]);
  };

  const sendMessage = () => {
    const val = inputValue.trim();
    if (!val) return;

    appendMsg(val, "user");
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      appendMsg(getReply(), "ai");
    }, 900);
  };

  const sendChip = (text) => {
    appendMsg(text, "user");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      appendMsg(getReply(), "ai");
    }, 900);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const quickReplies = ["Hello", "How are you?", "What can you do?", "Help me", "Thanks!"];

  return (
    <>
      {/* Chat Icon — visible when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-[9999] w-12 h-12 bg-primary-orange rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-yellow/90 transition-colors transform hover:-translate-y-1"
          title="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Full Chat Interface — visible when open */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-[9999] w-[320px] h-[500px] max-w-xs shadow-2xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-orange to-primary-yellow rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  GymPro Assistant
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ready to help</p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setMessages([])}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Clear chat"
              >
          <svg className="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
</svg>


              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4.293A1 1 0 014.414 4.293L10 9.879l5.586-5.586a1 1 0 111.414 1.414L11.414 11.293l5.586 5.586a1 1 0 01-1.414 1.414L10 12.707l-5.586 5.586a1 1 0 01-1.414-1.414l5.586-5.586-5.586-5.586A1 1 0 013 4.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-primary-orange text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {!inputValue && messages.length === 0 && (
            <div className="flex flex-wrap gap-2 px-3 pb-2 shrink-0">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => sendChip(reply)}
                  className="px-3 py-1.5 text-xs rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="ml-2 px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-yellow/90 transition-colors disabled:opacity-50 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}