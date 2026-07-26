// Forge uses GitHub OAuth only — email OTP disabled
import { emailOTP } from 'better-auth/plugins'

export const emailOTPPlugin = emailOTP({
  otpLength: 6,
  expiresIn: 600,
  async sendVerificationOTP() {
    // No-op — email auth disabled in Forge
  },
})
