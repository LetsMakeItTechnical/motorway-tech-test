import { createClient } from 'redis';
import logger from '../../helpers/logger';

export class CacheService {
  private cacheClient: ReturnType<typeof createClient>;

  constructor({ url = process.env.REDIS_URL }: { url?: string }) {
    this.cacheClient = createClient({ url });
    this.initialize();
  }

  private initialize(): void {
    this.cacheClient.on('error', (error: Error) => {
      console.error(error);
      void this.cacheClient.quit();
    });
  }

  public async set(
    key: string | Buffer,
    value: string | Buffer | number,
    EX = 3600
  ): Promise<void> {
    try {
      logger.info(`Data for key: ${key} stored in Redis with expiration of 60 seconds.`);

      await this.cacheClient.connect();
      await this.cacheClient.set(key, value, { EX });
    } finally {
      await this.cacheClient.disconnect();
    }
  }

  public async get(key: string | Buffer): Promise<string | null> {
    let result = null;

    try {
      await this.cacheClient.connect();
      result = await this.cacheClient.get(key);
    } finally {
      await this.cacheClient.disconnect();
    }

    return result;
  }
}
