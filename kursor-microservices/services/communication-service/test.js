const fetch = require("node-fetch");

// Test configuration
const BASE_URL = "http://localhost:3002";

async function testCommunicationService() {
  console.log("🧪 Testing Communication Service...\n");

  try {
    // Test 1: Health check
    console.log("1. Testing health endpoint...");
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);
    console.log("");

    // Test 2: Service info
    console.log("2. Testing service info...");
    const infoResponse = await fetch(`${BASE_URL}/info`);
    const infoData = await infoResponse.json();
    console.log("✅ Service info:", infoData);
    console.log("");

    // Test 3: Contact form (this will require valid Resend API key)
    console.log("3. Testing contact form...");
    const contactResponse = await fetch(`${BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message:
          "This is a test message from the communication service test script.",
      }),
    });

    const contactData = await contactResponse.json();

    if (contactResponse.ok) {
      console.log("✅ Contact form test successful:", contactData);
    } else {
      console.log(
        "⚠️  Contact form test (expected if no valid API key):",
        contactData
      );
    }
    console.log("");

    // Test 4: Invalid contact form data
    console.log("4. Testing contact form validation...");
    const invalidContactResponse = await fetch(`${BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        // Missing email and message
      }),
    });

    const invalidContactData = await invalidContactResponse.json();
    console.log("✅ Validation test (should show error):", invalidContactData);
    console.log("");

    // Test 5: 404 endpoint
    console.log("5. Testing 404 handling...");
    const notFoundResponse = await fetch(`${BASE_URL}/nonexistent`);
    const notFoundData = await notFoundResponse.json();
    console.log("✅ 404 test:", notFoundData);
    console.log("");

    console.log("🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log(
      "\n💡 Make sure the communication service is running on port 3002"
    );
    console.log("   Run: npm start");
  }
}

// Run tests
testCommunicationService();
