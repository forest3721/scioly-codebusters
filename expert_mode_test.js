// Expert Mode Test - Run in browser console
console.log('🧪 Testing Expert Mode for all cipher types...');

const testSentence = 'Practice makes perfect.';

// All cipher types
const ciphers = ['caesar', 'atbash', 'keyword', 'vigenere', 'morse', 'binary', 'aristocrats', 'affine', 'baconian', 'polybius'];

// Test each cipher
ciphers.forEach(cipherType => {
    console.log(`\n📝 Testing ${cipherType.toUpperCase()}:`);
    try {
        // Set cipher and generate code
        window.debugApp.currentCipher = cipherType;
        
        // Encode the test sentence
        const encoded = window.debugApp.encodeText(testSentence);
        console.log(`  Original: "${testSentence}"`);
        console.log(`  Encoded:  "${encoded}"`);
        
        if (encoded && encoded !== testSentence) {
            console.log(`  Status: ✅ PASS - Encoding successful`);
        } else if (['morse', 'binary', 'baconian', 'polybius'].includes(cipherType) && encoded) {
            console.log(`  Status: ✅ PASS - Special encoding format`);
        } else {
            console.log(`  Status: ❌ FAIL - Encoding issue`);
        }
        
    } catch (error) {
        console.log(`  Status: ❌ ERROR - ${error.message}`);
    }
});

console.log('\n🎯 Expert mode test completed. Check individual results above.');

// Instructions
console.log('\n📋 Manual Test Instructions:');
console.log('1. Set difficulty to "Expert (Full sentences)"');
console.log('2. Try each cipher type and click "Generate New Code"');
console.log('3. Verify sentences are encoded properly');
console.log('4. Check that spaces and punctuation are preserved/handled correctly');