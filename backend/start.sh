# Start MongoDB and FastAPI backend
echo "Starting Framework Hub Backend..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start the services
echo "Starting MongoDB and FastAPI services..."
docker-compose up -d

echo "Services started successfully!"
echo "MongoDB: http://localhost:27017"
echo "FastAPI: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ All services are running successfully!"
    echo ""
    echo "🔗 Useful URLs:"
    echo "   - API Health Check: http://localhost:8000/api/health"
    echo "   - API Documentation: http://localhost:8000/docs"
    echo "   - Interactive API: http://localhost:8000/redoc"
    echo ""
    echo "📊 Database Collections:"
    echo "   - build_logs: Stores all pipeline execution logs"
    echo "   - generated_code: Stores generated code (max 10 entries)"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
fi
