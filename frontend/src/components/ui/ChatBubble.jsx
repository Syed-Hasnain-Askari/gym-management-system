import React, { useState, useEffect, useRef } from "react";

const CHAT_STORAGE_KEY = "gymChatHistory";
const MAX_CHARACTERS = 100;

export function ChatBubble() {
	const [messages, setMessages] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [inputError, setInputError] = useState("");
	const messagesEndRef = useRef(null);

	const characterCount = inputValue.length;
	const isCharacterLimitReached = characterCount > MAX_CHARACTERS;

	useEffect(() => {
		const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
		if (savedMessages) {
			try {
				setMessages(JSON.parse(savedMessages));
			} catch (error) {
				console.error("Failed to parse chat history:", error);
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
	}, [messages]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	useEffect(() => {
		if (!isCharacterLimitReached) {
			setInputError("");
		}
	}, [isCharacterLimitReached]);

	const getReply = async (userMessage) => {
		try {
			const response = await fetch("http://localhost:5000/api/nlQuery/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ question: userMessage })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				return {
					text: data.summary || "I processed your request.",
					payload: data
				};
			}

			if (data.message) {
				return { text: data.message, payload: null };
			}

			return {
				text: "I'm sorry, I couldn't process that request. Please try again.",
				payload: null
			};
		} catch (error) {
			console.error("Error fetching from NLQuery endpoint:", error);
			return {
				text: "I'm experiencing technical difficulties. Please try again later",
				payload: null
			};
		}
	};

	const appendMsg = (text, sender, senderType = "user", payload = null) => {
		setMessages((prev) => [
			...prev,
			{
				text,
				sender,
				senderType,
				payload,
				id: Date.now() + Math.random()
			}
		]);
	};

	const deleteMessage = (messageId) => {
		setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
	};

	const clearHistory = () => {
		setMessages([]);
		localStorage.removeItem(CHAT_STORAGE_KEY);
	};

	const sendMessage = async () => {
		const val = inputValue.trim();
		if (!val) return;

		if (val.length > MAX_CHARACTERS) {
			setInputError(
				`Please keep your message within ${MAX_CHARACTERS} characters.`
			);
			return;
		}

		appendMsg(val, "user", "user");
		setInputValue("");
		setInputError("");
		setIsTyping(true);

		try {
			const reply = await getReply(val);
			setIsTyping(false);
			appendMsg(reply.text, "ai", "ai", reply.payload);
		} catch {
			setIsTyping(false);
			appendMsg(
				"Sorry, I encountered an error processing your request.",
				"ai",
				"ai"
			);
		}
	};

	const sendChip = async (text) => {
		appendMsg(text, "user", "user");
		setIsTyping(true);

		try {
			const reply = await getReply(text);
			setIsTyping(false);
			appendMsg(reply.text, "ai", "ai", reply.payload);
		} catch {
			setIsTyping(false);
			appendMsg(
				"Sorry, I encountered an error processing your request.",
				"ai",
				"ai"
			);
		}
	};

	const _sendAdminMessage = (text, adminName = "Admin") => {
		appendMsg(text, adminName, "admin");
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
		setInputError(
			value.length > MAX_CHARACTERS
				? `Only ${MAX_CHARACTERS} characters are allowed in one message.`
				: ""
		);
	};

	const quickReplies = [
		"Show all unpaid fees",
		"Show inactive members",
		"How many members joined this month?"
	];

	return (
		<>
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full border border-primary-orange/40 bg-gradient-to-br from-primary-orange to-secondary-orange text-white shadow-[0_18px_45px_rgba(249,115,22,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(249,115,22,0.45)]"
					title="Open chat"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
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

			{isOpen && (
				<div className="fixed bottom-4 right-4 z-[9999] flex h-[580px] w-[380px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[28px] border border-border-input/80 bg-card-bg text-text-main shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur">
					<div className="shrink-0 border-b border-border-input bg-gradient-to-r from-primary-orange/20 via-card-bg to-card-bg px-4 py-4">
						<div className="flex items-start justify-between gap-3">
							<div className="flex items-center space-x-3">
								<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-orange to-secondary-orange shadow-lg shadow-primary-orange/20">
									<span className="text-xs font-bold text-white">AI</span>
								</div>
								<div>
									<h3 className="text-base font-bold tracking-tight text-text-title">
										GymPro Assistant
									</h3>
									<p className="text-xs text-text-dim">
										Smart help for members, fees, and reports
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<button
									onClick={() => setIsHistoryOpen((prev) => !prev)}
									className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
										isHistoryOpen
											? "border-primary-orange/60 bg-primary-orange text-white"
											: "border-border-input bg-input-bg text-text-dim hover:border-primary-orange/40 hover:text-text-main"
									}`}
									title="View chat history"
								>
									History
								</button>
								<button
									onClick={clearHistory}
									className="rounded-full border border-border-input bg-input-bg p-2 text-text-dim transition-colors hover:border-primary-orange/40 hover:text-white"
									title="Clear chat"
								>
									<svg
										className="h-[18px] w-[18px]"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="1.6"
											d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
										/>
									</svg>
								</button>
								<button
									onClick={() => setIsOpen(false)}
									className="rounded-full border border-border-input bg-input-bg p-2 text-text-dim transition-colors hover:border-primary-orange/40 hover:text-white"
									title="Close chat"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
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

						<div className="mt-3 flex items-center justify-between rounded-2xl border border-border-input/70 bg-input-bg/70 px-3 py-2 text-xs">
							<span className="text-text-dim">
								{messages.length} saved message
								{messages.length === 1 ? "" : "s"}
							</span>
							<span
								className={`font-semibold ${
									isCharacterLimitReached
										? "text-red-400"
										: "text-primary-orange"
								}`}
							>
								{characterCount}/{MAX_CHARACTERS} characters
							</span>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_38%),linear-gradient(180deg,rgba(20,20,31,0.96),rgba(15,15,26,1))] p-4">
						{isHistoryOpen && (
							<div className="mb-4 rounded-2xl border border-border-input bg-input-bg/95 p-3">
								<div className="mb-3">
									<h4 className="text-sm font-semibold text-text-title">
										Chat history
									</h4>
									<p className="text-xs text-text-dim">
										Review previous messages or delete what you no longer need.
									</p>
								</div>

								<div className="max-h-40 space-y-2 overflow-y-auto pr-1">
									{messages.length === 0 ? (
										<div className="rounded-2xl border border-dashed border-border-input px-3 py-4 text-center text-xs text-text-dim">
											No saved chat history yet.
										</div>
									) : (
										messages.map((msg) => (
											<div
												key={`history-${msg.id}`}
												className="flex items-start justify-between gap-3 rounded-2xl border border-border-input/80 bg-card-bg/80 px-3 py-2"
											>
												<div className="min-w-0">
													<div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-dim">
														{msg.senderType}
													</div>
													<p className="line-clamp-2 text-xs text-text-main">
														{msg.text}
													</p>
												</div>
												<button
													onClick={() => deleteMessage(msg.id)}
													className="shrink-0 rounded-full border border-border-input p-1.5 text-text-dim transition-colors hover:border-red-400/60 hover:text-red-300"
													title="Delete history item"
												>
													<svg
														className="h-3.5 w-3.5"
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
													>
														<path
															stroke="currentColor"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="1.8"
															d="M6 7h12m-8 4v5m4-5v5M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0h10v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7Z"
														/>
													</svg>
												</button>
											</div>
										))
									)}
								</div>
							</div>
						)}

						<div className="space-y-3">
							{messages.map((msg) => {
								const isUser = msg.senderType === "user";
								const isAdmin = msg.senderType === "admin";

								return (
									<div
										key={msg.id}
										className={`flex ${isUser ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[78%] rounded-[22px] px-4 py-3 text-sm shadow-sm ${
												isUser
													? "border border-primary-orange/30 bg-gradient-to-br from-primary-orange to-secondary-orange text-white"
													: isAdmin
														? "border border-blue-400/30 bg-blue-500/90 text-white"
														: "border border-border-input bg-input-bg text-text-main"
											}`}
											title={isAdmin ? "Admin Message" : undefined}
										>
											<div className="whitespace-pre-wrap break-words">
												{msg.text}
											</div>
											{!isUser && msg.sender && (
												<div className="mt-1 text-xs opacity-70">
													<em>From {msg.sender}</em>
												</div>
											)}
										</div>
									</div>
								);
							})}

							{isTyping && (
								<div className="flex justify-start">
									<div className="flex items-center space-x-1 rounded-[20px] border border-border-input bg-input-bg px-4 py-3">
										<div className="h-2 w-2 rounded-full bg-primary-orange animate-bounce" />
										<div className="h-2 w-2 rounded-full bg-primary-orange animate-bounce [animation-delay:0.1s]" />
										<div className="h-2 w-2 rounded-full bg-primary-orange animate-bounce [animation-delay:0.2s]" />
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>
					</div>

					{!inputValue && messages.length === 0 && (
						<div className="shrink-0 px-4 pb-2">
							<p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-dim">
								Try asking
							</p>
							<div className="flex flex-wrap gap-2">
								{quickReplies.map((reply, index) => (
									<button
										key={index}
										onClick={() => sendChip(reply)}
										className="rounded-full border border-border-input bg-input-bg px-3 py-1.5 text-xs text-text-main transition-colors hover:border-primary-orange/50 hover:text-primary-orange"
									>
										{reply}
									</button>
								))}
							</div>
						</div>
					)}

					<div className="shrink-0 border-t border-border-input bg-card-bg px-4 py-4">
						<div className="rounded-[24px] border border-border-input bg-input-bg p-2 shadow-inner shadow-black/10">
							<textarea
								value={inputValue}
								onChange={handleInputChange}
								onKeyDown={handleKeyPress}
								placeholder="Ask about members, fees, or reports..."
								rows={3}
								className="w-full resize-none bg-transparent px-3 py-2 text-sm text-text-main outline-none placeholder:text-text-muted"
							/>

							<div className="flex items-center justify-between gap-3 border-t border-border-input/80 px-2 pt-2">
								<div>
									{inputError ? (
										<p className="text-xs text-red-400">{inputError}</p>
									) : (
										<p className="text-xs text-text-dim">
											Press Enter to send, Shift+Enter for a new line.
										</p>
									)}
								</div>

								<button
									onClick={sendMessage}
									disabled={!inputValue.trim() || isCharacterLimitReached}
									className="rounded-full bg-gradient-to-r from-primary-orange to-secondary-orange px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Send
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
