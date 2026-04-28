import rateLimit from "express-rate-limit";

// General API limit — all routes
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: 429,
		message: "Too many requests. Please try again after 15 minutes."
	}
});

// Strict limit — AI routes (expensive Gemini calls)
export const aiLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: 429,
		message: "AI query limit reached. Please wait a moment before trying again."
	}
});

// Insight limit — dashboard auto-refresh protection
export const insightLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: 429,
		message:
			"Insight refresh limit reached. Data is cached — try again shortly."
	}
});
