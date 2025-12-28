import { supabase } from '@/integrations/supabase/client';

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  verificationId?: string;
  expiresAt?: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  isValid?: boolean;
}

// Generate a secure verification token
const generateVerificationToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Send email verification link
export const sendEmailVerification = async (
  email: string, 
  userId?: string,
  userName?: string
): Promise<EmailVerificationResponse> => {
  try {
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Store verification token in database
    const { data, error } = await supabase
      .from('email_verifications')
      .insert({
        email: email,
        user_id: userId,
        verification_token: verificationToken,
        expires_at: expiresAt.toISOString(),
        is_verified: false
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to create verification record. Please try again.'
      };
    }

    // Create verification URL
    const baseUrl = window.location.origin;
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Send verification email
    const emailResponse = await fetch('/api/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        verificationUrl,
        userName: userName || 'User',
        subject: 'Verify Your HUMSJ Account Email',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">HUMSJ IT Sector</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Islamic Community Management System</p>
            </div>
            
            <div style="padding: 40px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Welcome to HUMSJ!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Assalamu Alaikum ${userName || 'Brother/Sister'},
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Thank you for joining the HUMSJ Islamic Community Management System. To complete your registration and secure your account, please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px;
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  Verify Email Address
                </a>
              </div>
              
              <div style="background: white; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.5;">
                  <strong>Security Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with HUMSJ, please ignore this email.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
                If the button above doesn't work, you can copy and paste this link into your browser:
              </p>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 12px; color: #4b5563;">
                ${verificationUrl}
              </div>
              
              <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 15px;">
                  Once verified, you'll have access to:
                </p>
                <ul style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0; padding-left: 20px;">
                  <li>Islamic educational resources and programs</li>
                  <li>Community events and activities</li>
                  <li>Prayer times and Islamic calendar</li>
                  <li>Volunteer opportunities and community support</li>
                </ul>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © 2024 HUMSJ IT Sector - Islamic Community Management System<br>
                  This email was sent to ${email}
                </p>
              </div>
            </div>
          </div>
        `
      }),
    });

    if (!emailResponse.ok) {
      // Clean up database entry if email fails
      await supabase
        .from('email_verifications')
        .delete()
        .eq('id', data.id);

      return {
        success: false,
        message: 'Failed to send verification email. Please check your email address and try again.'
      };
    }

    return {
      success: true,
      message: 'Verification email sent successfully. Please check your inbox and spam folder.',
      verificationId: data.id,
      expiresAt: expiresAt.toISOString()
    };

  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      message: 'An error occurred while sending verification email. Please try again.'
    };
  }
};

// Verify email using token
export const verifyEmailToken = async (
  token: string, 
  email: string
): Promise<VerifyEmailResponse> => {
  try {
    // Get verification record from database
    const { data, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('verification_token', token)
      .eq('email', email)
      .eq('is_verified', false)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: 'Invalid or expired verification link.',
        isValid: false
      };
    }

    // Check if verification has expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (now > expiresAt) {
      // Clean up expired verification
      await supabase
        .from('email_verifications')
        .delete()
        .eq('id', data.id);

      return {
        success: false,
        message: 'Verification link has expired. Please request a new verification email.',
        isValid: false
      };
    }

    // Mark email as verified
    const { error: updateError } = await supabase
      .from('email_verifications')
      .update({ 
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', data.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return {
        success: false,
        message: 'Failed to verify email. Please try again.',
        isValid: false
      };
    }

    // Update user's email verification status if user_id exists
    if (data.user_id) {
      await supabase
        .from('profiles')
        .update({ 
          email_verified: true,
          email_verified_at: new Date().toISOString()
        })
        .eq('id', data.user_id);
    }

    return {
      success: true,
      message: 'Email verified successfully! You can now access all features.',
      isValid: true
    };

  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      message: 'An error occurred during email verification. Please try again.',
      isValid: false
    };
  }
};

// Resend email verification
export const resendEmailVerification = async (
  email: string,
  userId?: string,
  userName?: string
): Promise<EmailVerificationResponse> => {
  try {
    // Clean up any existing unverified verifications for this email
    await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email)
      .eq('is_verified', false);
    
    return await sendEmailVerification(email, userId, userName);

  } catch (error) {
    console.error('Resend email verification error:', error);
    return {
      success: false,
      message: 'Failed to resend verification email. Please try again.'
    };
  }
};

// Check if email is already verified
export const isEmailVerified = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('email_verifications')
      .select('is_verified')
      .eq('email', email)
      .eq('is_verified', true)
      .single();

    return !error && data?.is_verified === true;

  } catch (error) {
    console.error('Check email verification error:', error);
    return false;
  }
};

// Get email verification status
export const getEmailVerificationStatus = async (email: string): Promise<{
  isVerified: boolean;
  hasPendingVerification: boolean;
  lastSentAt?: string;
  expiresAt?: string;
}> => {
  try {
    // Check for verified email
    const { data: verifiedData } = await supabase
      .from('email_verifications')
      .select('verified_at')
      .eq('email', email)
      .eq('is_verified', true)
      .single();

    if (verifiedData) {
      return {
        isVerified: true,
        hasPendingVerification: false
      };
    }

    // Check for pending verification
    const { data: pendingData } = await supabase
      .from('email_verifications')
      .select('created_at, expires_at')
      .eq('email', email)
      .eq('is_verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (pendingData) {
      const now = new Date();
      const expiresAt = new Date(pendingData.expires_at);
      const isExpired = now > expiresAt;

      if (isExpired) {
        // Clean up expired verification
        await supabase
          .from('email_verifications')
          .delete()
          .eq('email', email)
          .eq('is_verified', false);

        return {
          isVerified: false,
          hasPendingVerification: false
        };
      }

      return {
        isVerified: false,
        hasPendingVerification: true,
        lastSentAt: pendingData.created_at,
        expiresAt: pendingData.expires_at
      };
    }

    return {
      isVerified: false,
      hasPendingVerification: false
    };

  } catch (error) {
    console.error('Get email verification status error:', error);
    return {
      isVerified: false,
      hasPendingVerification: false
    };
  }
};

// Clean up expired email verifications (should be called periodically)
export const cleanupExpiredEmailVerifications = async (): Promise<void> => {
  try {
    const now = new Date().toISOString();
    
    await supabase
      .from('email_verifications')
      .delete()
      .lt('expires_at', now)
      .eq('is_verified', false);
      
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};