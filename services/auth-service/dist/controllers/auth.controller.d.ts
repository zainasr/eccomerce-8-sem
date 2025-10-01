import { Request, Response } from "express";
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const switchRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map