import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Hardcoded SMTP configuration for now
    const smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mynameiszainmalik@gmail.com",
        pass: "ctdt qgwx ftzb aouy",
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  private getEmailVerificationTemplate(
    token: string,
    firstName?: string
  ): string {
    const verifyUrl = `http://localhost:3000/api/auth/verify/${token}`;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Hello ${firstName || "there"},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `;
  }

  private getPasswordResetTemplate(token: string, firstName?: string): string {
    const resetUrl = `http://localhost:3000/api/auth/reset-password?token=${token}`;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>Hello ${firstName || "there"},</p>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
  }

  async sendVerificationEmail(
    email: string,
    token: string,
    firstName?: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"ECCOMERCE" <mynameiszainmalik@gmail.com>',
        to: email,
        subject: "Verify Your Email Address",
        html: this.getEmailVerificationTemplate(token, firstName),
      });
    } catch (error) {
      console.error("❌ Failed to send verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    firstName?: string
  ): Promise<void> {
    console.log("📧 sendPasswordResetEmail called for:", email);
    try {
      const info = await this.transporter.sendMail({
        from: '"ECCOMERCE" <mynameiszainmalik@gmail.com>',
        to: email,
        subject: "Reset Your Password",
        html: this.getPasswordResetTemplate(token, firstName),
      });

      console.log("✅ Password reset email sent successfully to:", email);
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }
}

export const emailService = new EmailService();
