import { RegisterRequest, LoginRequest, AuthResponse, UserRole } from "shared";
export declare class AuthService {
    register(data: RegisterRequest): Promise<{
        user: any;
        verificationToken: string;
    }>;
    login(data: LoginRequest): Promise<AuthResponse>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyEmail(token: string): Promise<void>;
    switchRole(userId: string, role: UserRole): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map