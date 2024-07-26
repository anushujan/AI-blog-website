"use client";
import { useState, useRef, useEffect } from "react";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null); // Reference to the end of the chat container
  const chatBoxRef = useRef(null); // Reference to the chat box container

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add the user's message to the chat
    setMessages([...messages, { type: "user", text: input }]);

    // Simulate sending the message to your server and receiving a response
    const response = await fetch(
      "http://localhost:8000/api/query/find-matching-response",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      }
    ).then((res) => res.json());

    // Add the response from the server to the chat
    setMessages([
      ...messages,
      { type: "user", text: input },
      { type: "bot", text: response.response },
    ]);
    setInput("");
  };

  // Scroll to the bottom of the chat container whenever messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (e.g., form submission)
      handleSendMessage();
    }
  };

  // Close the chat box when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      {/* Chat Floating Button */}
      <div
        onClick={toggleChatBox}
        className="fixed z-50 flex items-center justify-center text-white bg-[#000000] rounded-full shadow-lg cursor-pointer bottom-4 right-4 w-14 h-14 hover:bg-[#1b1b1b]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.6em"
          height="1.6em"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M16 4C9.373 4 4 9.373 4 16c0 2.165.572 4.193 1.573 5.945a1 1 0 0 1 .094.77l-1.439 5.059l5.061-1.44a1 1 0 0 1 .77.094A11.94 11.94 0 0 0 16 28c6.628 0 12-5.373 12-12S22.628 4 16 4M2 16C2 8.268 8.268 2 16 2s14 6.268 14 14s-6.268 14-14 14c-2.368 0-4.602-.589-6.56-1.629l-5.528 1.572A1.5 1.5 0 0 1 2.06 28.09l1.572-5.527A13.94 13.94 0 0 1 2 16m8-3a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H11a1 1 0 0 1-1-1m1 5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2z"
          />
        </svg>
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div
          ref={chatBoxRef}
          className="fixed flex flex-col z-50 md:w-[400px] sm:w-[400px] w-full bg-white border border-gray-300 rounded-lg shadow-lg bottom-20 sm:right-4 h-[400px] sm:h-[500px]"
        >
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.type === "user"
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Reference for scrolling */}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-6 p-4 border-t border-gray-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Add key down handler
              className="block w-full px-3 py-2 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="rounded-full flex items-center gap-2 py-[0px] px-[20px] text-[14px] hover:text-white text-black hover:bg-[#222222] border-[#222222] border-[1px] cursor-pointer"
            >
              Send
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
