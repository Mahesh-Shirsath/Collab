const db = db.getSiblingDB("framework_hub")

// Create collections
db.createCollection("build_logs")
db.createCollection("generated_code")

// Create indexes
db.build_logs.createIndex({ build_id: 1 }, { unique: true })
db.build_logs.createIndex({ start_time: -1 })
db.build_logs.createIndex({ type: 1 })
db.build_logs.createIndex({ status: 1 })

db.generated_code.createIndex({ created_at: -1 })
db.generated_code.createIndex({ language: 1 })
db.generated_code.createIndex({ type: 1 })

print("Database initialized successfully")
