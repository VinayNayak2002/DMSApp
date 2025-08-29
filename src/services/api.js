export const generateOtp = async (mobile) => {
    try {
        const response = await fetch(
            'https://apis.allsoft.co/api/documentManagement/generateOTP',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobile }),
            }
        );

        const data = await response.json();
        console.log('Generate OTP response:', data);
        return data;
    } catch (error) {
        console.log('Error generating OTP:', error);
        return { status: false, data: 'Failed to generate OTP' };
    }
};

export const validateOtp = async (mobile, otp) => {
    try {
        const response = await fetch(
            'https://apis.allsoft.co/api/documentManagement/validateOTP',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobile, otp }),
            }
        );

        const data = await response.json();
        console.log('Validate OTP response:', data);

        if (data.status && data.data && data.data.token) {
            return { token: data.data.token, user: data.data };
        } else {
            return { token: null, user: null };
        }
    } catch (error) {
        console.log('Error validating OTP:', error);
        return { token: null, user: null };
    }
};
