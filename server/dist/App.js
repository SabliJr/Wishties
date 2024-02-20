"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const constants_1 = require("./constants");
const appRoutes_1 = __importDefault(require("./routes/appRoutes"));
//For env File 
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    credentials: true,
    origin: constants_1.CLIENT_URL,
    optionsSuccessStatus: 204,
    exposedHeaders: ['set-cookie', 'ajax_redirect'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'XMLHttpRequest'],
};
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.options('/api/verify-email/', (0, cors_1.default)()); // Respond to preflight requests
// Routes
app.use('/api', appRoutes_1.default);
app.listen(constants_1.PORT, () => {
    console.log(`Server is Fire at http://localhost:${constants_1.PORT}`);
});
