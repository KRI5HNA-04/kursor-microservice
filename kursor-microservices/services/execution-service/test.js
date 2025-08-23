// Simple test script to verify execution service
const testExecutionService = async () => {
  const baseUrl = "http://localhost:3001";

  try {
    // Test health endpoint
    console.log("🏥 Testing health endpoint...");
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health:", healthData);

    // Test languages endpoint
    console.log("\n📝 Testing languages endpoint...");
    const langResponse = await fetch(`${baseUrl}/languages`);
    const langData = await langResponse.json();
    console.log("✅ Languages:", langData);

    // Test code execution
    console.log("\n🚀 Testing code execution...");
    const executeResponse = await fetch(`${baseUrl}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: 'console.log("Hello from microservice!");',
        language: "javascript",
      }),
    });

    const executeData = await executeResponse.json();
    console.log("✅ Execution submitted:", executeData);

    if (executeData.token) {
      // Wait a bit and check status
      console.log("\n⏳ Waiting 3 seconds before checking status...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await fetch(
        `${baseUrl}/execute/${executeData.token}`
      );
      const statusData = await statusResponse.json();
      console.log("✅ Execution result:", statusData);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  testExecutionService();
}

module.exports = { testExecutionService };
