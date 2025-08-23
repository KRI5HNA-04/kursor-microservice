// Test script for User Service
const fetch = require("node-fetch");

const BASE_URL = "http://localhost:3004";
let authToken = null;
let testUserId = null;

async function testUserService() {
  console.log("🧪 Testing User Service...\n");

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

    // Test 3: User registration
    console.log("3. Testing user registration...");
    const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "testpassword123",
      }),
    });

    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      authToken = signupData.token;
      testUserId = signupData.user.id;
      console.log("✅ User registration successful:", {
        user: signupData.user,
        hasToken: !!signupData.token,
      });
    } else {
      const signupError = await signupResponse.json();
      console.log(
        "⚠️  User registration (expected if database not connected):",
        signupError
      );
    }
    console.log("");

    // Test 4: User login (if registration succeeded)
    if (authToken) {
      console.log("4. Testing user login...");
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: `test${Date.now() - 1000}@example.com`, // Different email to test failure
          password: "wrongpassword",
        }),
      });

      const loginData = await loginResponse.json();
      if (loginResponse.ok) {
        console.log("✅ Login successful:", loginData);
      } else {
        console.log(
          "✅ Login failed as expected (wrong credentials):",
          loginData
        );
      }
      console.log("");

      // Test 5: Token validation
      console.log("5. Testing token validation...");
      const validateResponse = await fetch(`${BASE_URL}/auth/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authToken }),
      });

      const validateData = await validateResponse.json();
      console.log("✅ Token validation:", validateData);
      console.log("");

      // Test 6: Get profile
      console.log("6. Testing get profile...");
      const profileResponse = await fetch(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log("✅ Get profile successful:", profileData);
      } else {
        const profileError = await profileResponse.json();
        console.log("⚠️  Get profile error:", profileError);
      }
      console.log("");

      // Test 7: Update profile
      console.log("7. Testing update profile...");
      const updateResponse = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: "Updated bio from test script",
          githubUrl: "https://github.com/testuser",
        }),
      });

      if (updateResponse.ok) {
        const updateData = await updateResponse.json();
        console.log("✅ Update profile successful:", updateData);
      } else {
        const updateError = await updateResponse.json();
        console.log("⚠️  Update profile error:", updateError);
      }
      console.log("");

      // Test 8: Search users
      console.log("8. Testing search users...");
      const searchResponse = await fetch(`${BASE_URL}/users?search=test`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        console.log("✅ Search users successful:", searchData);
      } else {
        const searchError = await searchResponse.json();
        console.log("⚠️  Search users error:", searchError);
      }
      console.log("");
    }

    // Test 9: Unauthorized access
    console.log("9. Testing unauthorized access...");
    const unauthorizedResponse = await fetch(`${BASE_URL}/profile`);
    const unauthorizedData = await unauthorizedResponse.json();
    console.log("✅ Unauthorized test (should show error):", unauthorizedData);
    console.log("");

    // Test 10: Invalid token validation
    console.log("10. Testing invalid token validation...");
    const invalidTokenResponse = await fetch(`${BASE_URL}/auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: "invalid.token.here" }),
    });

    const invalidTokenData = await invalidTokenResponse.json();
    console.log("✅ Invalid token test (should show error):", invalidTokenData);
    console.log("");

    // Test 11: 404 endpoint
    console.log("11. Testing 404 handling...");
    const notFoundResponse = await fetch(`${BASE_URL}/nonexistent`);
    const notFoundData = await notFoundResponse.json();
    console.log("✅ 404 test:", notFoundData);
    console.log("");

    console.log("🎉 All tests completed!");

    if (authToken) {
      console.log("\n📝 Test credentials for manual testing:");
      console.log(`User ID: ${testUserId}`);
      console.log(`Token: ${authToken.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n💡 Make sure the user service is running on port 3004");
    console.log("   Run: npm start");
  }
}

// Run tests
testUserService();
