#!/bin/bash

# Build and test script for deployment
echo "🚀 Building Kursor Microservices for Deployment"

# Function to build and test a service
build_and_test() {
    local service_name=$1
    local service_path=$2
    
    echo "📦 Building $service_name..."
    cd "$service_path"
    
    # Build Docker image
    docker build -t "kursor-$service_name:latest" .
    
    if [ $? -eq 0 ]; then
        echo "✅ $service_name built successfully"
    else
        echo "❌ Failed to build $service_name"
        exit 1
    fi
    
    cd ..
}

# Navigate to microservices directory
cd "$(dirname "$0")"

# Build all services
echo "🏗️  Building all microservices..."

build_and_test "api-gateway" "api-gateway"
build_and_test "execution-service" "services/execution-service"
build_and_test "communication-service" "services/communication-service"
build_and_test "snippet-service" "services/snippet-service"
build_and_test "user-service" "services/user-service"

echo ""
echo "🎉 All services built successfully!"
echo ""
echo "To test locally:"
echo "  docker-compose up -d"
echo ""
echo "To deploy to Railway:"
echo "  railway login"
echo "  railway up"
echo ""
echo "To check status:"
echo "  docker-compose ps"
echo "  docker-compose logs -f api-gateway"
