const fs = require('fs');
const path = require('path');

console.log('🚀 Pre-deployment checks...\n');

// Check if all required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  '.env.local',
  'app/layout.tsx',
  'app/page.tsx'
];

let allFilesExist = true;

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check environment variables
console.log('\n🔧 Checking environment variables...');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'JWT_SECRET',
    'NEXTAUTH_URL'
  ];

  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ ${envVar} - MISSING`);
      allFilesExist = false;
    }
  });
} else {
  console.log('❌ .env.local file not found');
  allFilesExist = false;
}

// Check build
console.log('\n🏗️  Testing build...');
const { exec } = require('child_process');

exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Build failed:', error.message);
    return;
  }
  
  console.log('✅ Build successful!');
  
  if (allFilesExist) {
    console.log('\n🎉 All checks passed! Ready for deployment.');
    console.log('\nNext steps:');
    console.log('1. Run: vercel login');
    console.log('2. Run: npm run deploy:preview (for testing)');
    console.log('3. Run: npm run deploy (for production)');
    console.log('4. Set up your custom domain in Vercel dashboard');
  } else {
    console.log('\n❌ Some checks failed. Please fix the issues above before deploying.');
  }
});
