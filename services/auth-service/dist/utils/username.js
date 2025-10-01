"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsernameFromEmail = exports.generateUsername = void 0;
const generateUsername = (firstName, lastName) => {
    const base = `${firstName}_${lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");
    const randomSuffix = Math.floor(Math.random() * 9999) + 1;
    return `${base}_${randomSuffix}`;
};
exports.generateUsername = generateUsername;
const generateUsernameFromEmail = (email) => {
    const base = email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");
    const randomSuffix = Math.floor(Math.random() * 9999) + 1;
    return `${base}_${randomSuffix}`;
};
exports.generateUsernameFromEmail = generateUsernameFromEmail;
//# sourceMappingURL=username.js.map