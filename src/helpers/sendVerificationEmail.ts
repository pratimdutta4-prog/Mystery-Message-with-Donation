import { resend } from '@/lib/resend';  //npm install @react-email/render
import VerificationEmail from '../email/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery message | verification code',
            react: VerificationEmail({ username, otp: verifyCode }),            
        });
        return {
            success: true,
            message: 'Verification email send successfully.'
        };
    } catch (errorEmail) {
        console.error('>> Error in sending verification email: ', errorEmail);
        return {
            success: false,
            message: 'Error to send verification email.'
        };
    }
}
