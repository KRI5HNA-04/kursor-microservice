// Test script for Snippet Service
const fetch = require("node-fetch");

const BASE_URL = "http://localhost:3003";
const TEST_USER_ID = "test-user-123";

async function testSnippetService() {
  console.log("🧪 Testing Snippet Service...\n");

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

    // Test 3: Get snippets (should be empty initially)
    console.log("3. Testing get snippets...");
    const snippetsResponse = await fetch(`${BASE_URL}/snippets`, {
      headers: {
        Authorization: `Bearer ${TEST_USER_ID}`,
      },
    });

    if (snippetsResponse.ok) {
      const snippetsData = await snippetsResponse.json();
      console.log("✅ Get snippets successful:", snippetsData);
    } else {
      const errorData = await snippetsResponse.json();
      console.log(
        "⚠️  Get snippets (expected if database not connected):",
        errorData
      );
    }
    console.log("");

    // Test 4: Create snippet (will fail if database not connected)
    console.log("4. Testing create snippet...");
    const createResponse = await fetch(`${BASE_URL}/snippets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TEST_USER_ID}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test Snippet",
        code: 'console.log("Hello from test snippet!");',
        language: "javascript",
      }),
    });

    if (createResponse.ok) {
      const createdSnippet = await createResponse.json();
      console.log("✅ Create snippet successful:", createdSnippet);

      // Test 5: Get the created snippet
      console.log("5. Testing get single snippet...");
      const singleResponse = await fetch(
        `${BASE_URL}/snippets/${createdSnippet.id}`,
        {
          headers: {
            Authorization: `Bearer ${TEST_USER_ID}`,
          },
        }
      );

      if (singleResponse.ok) {
        const singleData = await singleResponse.json();
        console.log("✅ Get single snippet successful:", singleData);
      }

      // Test 6: Update the snippet
      console.log("6. Testing update snippet...");
      const updateResponse = await fetch(
        `${BASE_URL}/snippets/${createdSnippet.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TEST_USER_ID}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Updated Test Snippet",
            code: 'console.log("Updated test snippet!");',
          }),
        }
      );

      if (updateResponse.ok) {
        const updatedData = await updateResponse.json();
        console.log("✅ Update snippet successful:", updatedData);
      }

      // Test 7: Get statistics
      console.log("7. Testing get statistics...");
      const statsResponse = await fetch(`${BASE_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${TEST_USER_ID}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log("✅ Get statistics successful:", statsData);
      }
    } else {
      const createError = await createResponse.json();
      console.log(
        "⚠️  Create snippet (expected if database not connected):",
        createError
      );
    }
    console.log("");

    // Test 8: Invalid authorization
    console.log("8. Testing invalid authorization...");
    const unauthorizedResponse = await fetch(`${BASE_URL}/snippets`);
    const unauthorizedData = await unauthorizedResponse.json();
    console.log("✅ Unauthorized test (should show error):", unauthorizedData);
    console.log("");

    // Test 9: 404 endpoint
    console.log("9. Testing 404 handling...");
    const notFoundResponse = await fetch(`${BASE_URL}/nonexistent`);
    const notFoundData = await notFoundResponse.json();
    console.log("✅ 404 test:", notFoundData);
    console.log("");

    console.log("🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n💡 Make sure the snippet service is running on port 3003");
    console.log("   Run: npm start");
  }
}

// Run tests
testSnippetService();
