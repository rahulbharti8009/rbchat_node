import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'live';

dotenv.config({
  path: `.env.${env}`,
});

console.log(`Running in ${env} mode`);
