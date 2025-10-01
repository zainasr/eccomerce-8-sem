import { JWTPayload } from "shared";
export declare const generateAccessToken: (payload: JWTPayload) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => {
    userId: string;
};
//# sourceMappingURL=jwt.d.ts.map