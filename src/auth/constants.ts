export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'defaultSecretForDevelopmentOnly',
};

// Ensure you have a proper secret in production
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'defaultSecretForDevelopmentOnly')) {
    console.warn('WARNING: Using default JWT secret in production is insecure. Set a proper JWT_SECRET environment variable.');
}