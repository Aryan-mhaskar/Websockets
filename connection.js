import { Redis } from 'ioredis';

export const publishRedis = new Redis({
    host: 'localhost',
    port: 6379,
})
export const subscribeRedis = new Redis({
    host: 'localhost',
    port: 6379,
})