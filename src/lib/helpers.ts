import { redis } from "@/lib/redis";

export async function lpushWithRetry(key: string, value: string, retries = 3, timeoutMs = 2000): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Redis operation timed out")), timeoutMs);
            });

            await Promise.race([
                redis.lpush(key, value),
                timeoutPromise
            ]);
            return true;
        } catch (error) {
            console.warn(`Redis lpush attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error;
        }
    }
    return false;
}
