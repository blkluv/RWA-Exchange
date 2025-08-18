#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 RWA ExChange Setup');
console.log('============================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Creating .env.local from template...\n');
  
  const envContent = `NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
# Get your client ID from https://thirdweb.com/dashboard/settings/api-keys
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update NEXT_PUBLIC_THIRDWEB_CLIENT_ID with your actual client ID');
} else {
  console.log('✅ .env.local file exists');
}

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('❌ Dependencies not installed');
  console.log('📦 Please run: npm install');
} else {
  console.log('✅ Dependencies installed');
}

console.log('\n🎯 Next Steps:');
console.log('1. Get your Thirdweb client ID from: https://thirdweb.com/dashboard/settings/api-keys');
console.log('2. Update .env.local with your client ID');
console.log('3. Run: npm run dev');
console.log('4. Open: http://localhost:3000');

console.log('\n💡 Features:');
console.log('- Professional landing page with animations');
console.log('- Improved wallet connection (supports MetaMask, WalletConnect, etc.)');
console.log('- Searchable marketplace with filtering');
console.log('- Investor dashboard with portfolio analytics');
console.log('- Mobile-responsive design');
console.log('- Multi-chain support (Avalanche, Polygon, Ethereum)');

console.log('\n🔗 Useful Links:');
console.log('- Homepage: /');
console.log('- About: /landing');
console.log('- Marketplace: /collection');
console.log('- Dashboard: /dashboard');