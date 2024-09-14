import "dotenv/config";

// Some environment variables have default values
const envVariables = {
  DATABASE_URL: process.env.DATABASE_URL,
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET!, // Let typescript know that it can't be undefined
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "10m",
};

// All environment variables must have some value
Object.entries(envVariables).forEach(([key, value]) => {
  if (value === undefined || value === "") {
    throw new Error(
      `Environment variable ${key} should be defined in ".env" file`,
    );
  }
});

export default envVariables;
