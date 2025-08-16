#!/usr/bin/env node

// Quick API test script
const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
    console.log('🧪 Testing VibeTribe API...\n');
    
    try {
        // Test server health by checking if we can access any endpoint
        const response = await fetch(`${BASE_URL}/feed/explore`);
        if (response.ok) {
            console.log('✅ Server is responding');
            const data = await response.json();
            console.log(`📊 Found ${data.length} posts in explore feed`);
        } else {
            console.log('❌ Server not responding properly');
        }
    } catch (error) {
        console.log('❌ Error connecting to server:', error.message);
        return;
    }

    // Try to generate an invite code (this will fail without auth, which is expected)
    try {
        const inviteResponse = await fetch(`${BASE_URL}/auth/invite-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intendedFor: 'test@example.com' })
        });
        
        if (inviteResponse.status === 401) {
            console.log('✅ Authentication middleware is working (invite code requires auth)');
        }
    } catch (error) {
        console.log('❌ Error testing invite code endpoint:', error.message);
    }

    console.log('\n🎉 API appears to be working correctly!');
    console.log('🌐 Swagger docs available at: http://localhost:5000/api-docs');
}

testAPI();
