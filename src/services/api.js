export const generateOtp = (mobile) => {
    console.log(`OTP generated for mobile: ${mobile}`);
};

export const validateOtp = async (mobile, otp) => {
    console.log(`Validating OTP: ${otp} for mobile: ${mobile}`);
};