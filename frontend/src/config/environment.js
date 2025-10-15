const config = {
  // API Endpoints
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',

  // Third Party
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,

  // Features
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  enableLogs: import.meta.env.VITE_ENABLE_LOGS === 'true',

  // Environment checks
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

console.log("Running in:", config.mode);
console.log("API URL:", config.apiUrl);


// Validate required variables in production
if (config.isProduction) {
  const required = ['googleClientId', 'razorpayKeyId'];
  required.forEach(key => {
    if (!config[key]) {
      console.error(`Missing required environment variable for ${key}`);
    }
  });
}

export default config;
