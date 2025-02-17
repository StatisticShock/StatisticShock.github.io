"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const API_URL = "https://api.myanimelist.net/v2/users/";
const ACCESS_TOKEN = process.env.MAL_ACCESS_TOKEN; // Store in .env
const allowedOrigins = [
    "https://statisticshock.github.io",
    "http://127.0.0.1:5500", // Allow local testing
    "https://statisticshock-github-io-server.onrender.com"
];
const corsHeaders = {
    origin: (origin, callback) => {
        console.log("Incoming request from:", origin); // Debugging
        if (!origin) {
            console.log("Blocked: Null origin");
            callback(new Error("CORS error: Null origin not allowed"), false);
        }
        else if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("Blocked: Unknown origin", origin);
            callback(new Error("CORS error: Origin not allowed"), false);
        }
    },
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsHeaders));
app.get("/animelist/:username/:offset?", async (req, res) => {
    let { username, offset } = req.params;
    if (!offset)
        offset = 0;
    try {
        const response = await fetch(`${API_URL}${username}/animelist?limit=10&sort=list_updated_at&offset=${offset}&fields=list_status`, {
            headers: {
                "X-MAL-CLIENT-ID": ACCESS_TOKEN,
            },
        });
        if (!response.ok)
            throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
