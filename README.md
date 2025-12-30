# Pastebin-Lite

A simple "Pastebin"-like application where users can create text pastes and share a link to view them. Pastes can optionally be constrained by a time-to-live (TTL) or a maximum view count.

## How to Run Locally

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd pastebin-lite
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a .env.local file in the root directory and add your Redis connection string.

   For local development (requires a local Redis instance):

   ```bash
   REDIS_URL="redis://localhost:6379"
   ```

4. **Start the Development Server:**

   ```bash
   npm run dev
   ```

5. **Access the application:**
   ```bash
   http://localhost:3000
   ```

### Persistence Layer

choice : Redis (via ioredis)

Reasoning: Redis was chosen because its native Time-To-Live (TTL) feature allows for efficient and precise time-based expiry of pastes without requiring manual cleanup jobs. Additionally, Redis supports atomic increment operations, which ensures that "Max Views" limits are enforced accurately even under concurrent load, preventing race conditions where a paste might be viewed more times than allowed.
