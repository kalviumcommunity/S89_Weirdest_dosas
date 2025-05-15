// Test script to check if .env is loaded correctly
require('dotenv').config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All environment variables:', process.env);
