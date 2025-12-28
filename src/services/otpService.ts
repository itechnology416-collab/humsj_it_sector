import { supabase } from '@/integrations/supabase/client';

export interface OTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
  expiresAt?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  isValid?: boolean;
}

// Generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS using Twilio API
export const sendSMSOTP = async (phoneNumber: string): Promise<OTPResponse> => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database
    const { data, error } = await supabase
      .from('otp_verifications')
      .insert({
        phone_number: phoneNumber,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        type: 'sms',
        is_verified: false
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to store OTP. Please try again.'
      };
    }

    // Send SMS using Twilio API
    const twilioResponse = await fetch('/api/send-sms-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        otp,
        message: `Your HUMSJ verification code is: ${otp}. This code will expire in 10 minutes.`
      }),
    });

    if (!twilioResponse.ok) {
      // Clean up database entry if SMS fails
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('id', data.id);

      return {
        success: false,
        message: 'Failed to send SMS. Please check your phone number and try again.'
      };
    }

    return {
      success: true,
      message: 'OTP sent successfully to your phone number.',
      otpId: data.id,
      expiresAt: expiresAt.toISOString()
    };

  } catch (error) {
    console.error('SMS OTP error:', error);
    return {
      success: false,
      message: 'An error occurred while sending OTP. Please try again.'
    };
  }
};

// Send OTP via Email using SendGrid API
export const sendEmailOTP = async (email: string): Promise<OTPResponse> => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database
    const { data, error } = await supabase
      .from('otp_verifications')
      .insert({
        email: email,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        type: 'email',
        is_verified: false
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to store OTP. Please try again.'
      };
    }

    // Send email using SendGrid API
    const emailResponse = await fetch('/api/send-email-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
        subject: 'HUMSJ Email Verification Code',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">HUMSJ IT Sector</h1>
              <p style="color: white; margin: 5px 0 0 0;">Islamic Community Management</p>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Email Verification</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                Thank you for registering with HUMSJ IT Sector. Please use the verification code below to complete your registration:
              </p>
              <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #10b981; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
              </p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                  © 2024 HUMSJ IT Sector. All rights reserved.
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
        .from('otp_verifications')
        .delete()
        .eq('id', data.id);

      return {
        success: false,
        message: 'Failed to send email. Please check your email address and try again.'
      };
    }

    return {
      success: true,
      message: 'Verification code sent successfully to your email.',
      otpId: data.id,
      expiresAt: expiresAt.toISOString()
    };

  } catch (error) {
    console.error('Email OTP error:', error);
    return {
      success: false,
      message: 'An error occurred while sending verification email. Please try again.'
    };
  }
};

// Verify OTP code
export const verifyOTP = async (
  otpId: string, 
  otpCode: string, 
  type: 'sms' | 'email'
): Promise<VerifyOTPResponse> => {
  try {
    // Get OTP record from database
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('id', otpId)
      .eq('type', type)
      .eq('is_verified', false)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: 'Invalid or expired verification code.',
        isValid: false
      };
    }

    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (now > expiresAt) {
      // Clean up expired OTP
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('id', otpId);

      return {
        success: false,
        message: 'Verification code has expired. Please request a new one.',
        isValid: false
      };
    }

    // Check if OTP code matches
    if (data.otp_code !== otpCode) {
      return {
        success: false,
        message: 'Invalid verification code. Please try again.',
        isValid: false
      };
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('otp_verifications')
      .update({ 
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', otpId);

    if (updateError) {
      console.error('Update error:', updateError);
      return {
        success: false,
        message: 'Failed to verify code. Please try again.',
        isValid: false
      };
    }

    return {
      success: true,
      message: 'Verification successful!',
      isValid: true
    };

  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      message: 'An error occurred during verification. Please try again.',
      isValid: false
    };
  }
};

// Resend OTP
export const resendOTP = async (
  phoneNumber?: string, 
  email?: string
): Promise<OTPResponse> => {
  try {
    // Clean up any existing unverified OTPs for this contact
    if (phoneNumber) {
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('phone_number', phoneNumber)
        .eq('is_verified', false);
      
      return await sendSMSOTP(phoneNumber);
    }
    
    if (email) {
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('email', email)
        .eq('is_verified', false);
      
      return await sendEmailOTP(email);
    }

    return {
      success: false,
      message: 'Please provide either phone number or email address.'
    };

  } catch (error) {
    console.error('Resend OTP error:', error);
    return {
      success: false,
      message: 'Failed to resend verification code. Please try again.'
    };
  }
};

// Clean up expired OTPs (should be called periodically)
export const cleanupExpiredOTPs = async (): Promise<void> => {
  try {
    const now = new Date().toISOString();
    
    await supabase
      .from('otp_verifications')
      .delete()
      .lt('expires_at', now);
      
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

// Get OTP verification status
export const getOTPStatus = async (otpId: string): Promise<{
  exists: boolean;
  isVerified: boolean;
  isExpired: boolean;
  type?: 'sms' | 'email';
}> => {
  try {
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('id', otpId)
      .single();

    if (error || !data) {
      return {
        exists: false,
        isVerified: false,
        isExpired: false
      };
    }

    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    const isExpired = now > expiresAt;

    return {
      exists: true,
      isVerified: data.is_verified,
      isExpired,
      type: data.type
    };

  } catch (error) {
    console.error('Get OTP status error:', error);
    return {
      exists: false,
      isVerified: false,
      isExpired: false
    };
  }
};