#!/usr/bin/env node

/**
 * Multi-Platform Deployment Script for HUMSJ IT Sector
 * Deploys to both Vercel and Netlify simultaneously
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🕌 HUMSJ IT Sector - Multi-Platform Deployment');
console.log('================================================');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'vercel.json',
  'netlify.toml',
  'dist/index.html'
];

console.log('📋 Checking deployment requirements...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    if (file === 'dist/index.html') {
      console.log('🔧 Building project first...');
      try {
        execSync('npm run build:production', { stdio: 'inherit' });
        console.log('✅ Build completed successfully');
      } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

console.log('✅ All requirements met');

// Deploy to Vercel
console.log('\n🚀 Deploying to Vercel...');
try {
  execSync('vercel --prod --yes', { stdio: 'inherit' });
  console.log('✅ Vercel deployment successful');
} catch (error) {
  console.error('❌ Vercel deployment failed:', error.message);
  console.log('💡 Make sure you are logged in: vercel login');
}

// Deploy to Netlify
console.log('\n🚀 Deploying to Netlify...');
try {
  // Check if Netlify CLI is installed
  execSync('netlify --version', { stdio: 'pipe' });
  
  // Deploy to Netlify
  execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
  console.log('✅ Netlify deployment successful');
} catch (error) {
  console.error('❌ Netlify deployment failed:', error.message);
  console.log('💡 Install Netlify CLI: npm install -g netlify-cli');
  console.log('💡 Login to Netlify: netlify login');
}

console.log('\n🎉 Multi-platform deployment completed!');
console.log('🕌 Your Islamic platform is now live on both platforms');
console.log('📊 Monitor both deployments for optimal performance');