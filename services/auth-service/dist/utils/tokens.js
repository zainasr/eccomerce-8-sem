"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = exports.generateResetToken = exports.generateVerificationToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateVerificationToken = () => {
    return crypto_1.default.randomBytes(32).toString("hex");
};
exports.generateVerificationToken = generateVerificationToken;
const generateResetToken = () => {
    return crypto_1.default.randomBytes(32).toString("hex");
};
exports.generateResetToken = generateResetToken;
const hashToken = (token) => {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
};
exports.hashToken = hashToken;
//# sourceMappingURL=tokens.js.map