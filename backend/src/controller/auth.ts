import axios from "axios";
// import jwt from "jsonwebtoken";
import Member from "../model/member.model.js";
import { Request, Response } from "express";

interface Params {
	client_id: string;
	redirect_uri: string;
	scope: string;
}
export const githubLogin = (req: Request, res: Response): void => {
	const params = new URLSearchParams({
		client_id: process.env.GITHUB_CLIENT_ID || "",
		redirect_uri: process.env.GITHUB_CALLBACK_URL || "",
		scope: "user:email"
	});
	res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

export const githubCallback = async (
	req: Request,
	res: Response
): Promise<Response | undefined> => {
	const { code } = req.query;

	if (!code) {
		return res.status(400).json({ message: "No code provided by GitHub" });
	}

	try {
		// Exchange code for access token
		const tokenResponse = await axios.post(
			"https://github.com/login/oauth/access_token",
			{
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code
			},
			{ headers: { Accept: "application/json" } }
		);

		const accessToken = tokenResponse.data.access_token;

		if (!accessToken) {
			return res.status(401).json({ message: "Failed to obtain access token" });
		}

		// Fetch GitHub user profile
		const [profileRes, emailRes] = await Promise.all([
			axios.get("https://api.github.com/user", {
				headers: { Authorization: `Bearer ${accessToken}` }
			}),
			axios.get("https://api.github.com/user/emails", {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		]);

		const { login } = profileRes.data;

		// GitHub may not expose email publicly — pull from /user/emails
		const primaryEmail =
			emailRes.data.find(
				(e: { primary: boolean; verified: boolean }) => e.primary && e.verified
			)?.email || null;

		// // Upsert user in MongoDB
		const user = await Member.findOneAndUpdate(
			{ name: login, email: primaryEmail },
			{ name: login, email: primaryEmail },
			{ upsert: true, new: true }
		);
		// // Sign JWT
		// const token = jwt.sign(
		// 	{ id: user._id, role: user.role },
		// 	process.env.JWT_SECRET,
		// 	{ expiresIn: "7d" }
		// );
		res.status(201).json(user);
	} catch (error: any) {
		console.error("GitHub OAuth error:", error.message);
		res.status(500).json({ message: "OAuth flow failed" });
	}
};
