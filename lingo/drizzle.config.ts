import "dotenv/config"; 
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./drizzle",
    // driver: "pg",
    dialect: "postgresql", // Specify the dialect you are using (postgresql in your case)
    dbCredentials: {
        // connectionString: process.env.DATABASE_URL!,
        url: process.env.DATABASE_URL!, // Use 'url' instead of 'connectionString'
    },
});
