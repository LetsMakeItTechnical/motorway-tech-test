import { Pool } from "pg";
import AppError from "../../helpers/appError";
import logger from "../../helpers/logger";
import { CacheService } from "../../services/cache";


/**
 * Service class for managing vehicle state information.
 */

export default class Service {
    /**
     * Service constructor.
     * @param {Pool} databaseConnector - The database pool connector.
     * @param {CacheService} cacheService - The cache service instance for Redis operations.
     */
    constructor(private databaseConnector: Pool, private cacheService: CacheService) { }

    /**
    * Generates a cache key for a vehicle based on its ID and timestamp.
    * @param {string} vehicleId - The ID of the vehicle.
    * @param {string} timestamp - The timestamp to associate with the vehicle's state.
    * @returns {string} The generated cache key.
    */

    generateVehicleCacheKey(vehicleId: string, timestamp: string) {
        return `vehicle:${vehicleId}:state:${timestamp}`;
    }

    /**
    * Fetches the cached state of a vehicle by its ID and timestamp.
    * @param {string} vehicleId - The ID of the vehicle.
    * @param {string} timestamp - The timestamp to retrieve the state for.
    * @returns {Promise<string | null>} The cached data if found; otherwise, null.
    */
    private async fetchCachedVehicleStateByTimestamp(vehicleId: string, timestamp: string) {
        const cacheKey = this.generateVehicleCacheKey(vehicleId, timestamp);
        logger.info(`Cache key generated: ${cacheKey}`);

        // Check if we have the data in Redis
        const cachedData = await this.cacheService.get(cacheKey);

        logger.info(`Cache hit for key: ${cacheKey}`);
        return cachedData
    }

    /**
    * Fetches vehicle data by its ID.
    * @param {string} vehicleId - The ID of the vehicle.
    * @returns {Promise<QueryResult>} A promise that resolves to the query result of the vehicle data.
    */
    public async fetchVehicleById(vehicleId: string) {
        logger.info('info', `Querying vehicle data for ID: ${vehicleId}`);
        const result = await this.databaseConnector.query<{ id: string }>('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);

        if (result.rowCount === 0) {
            logger.info('warn', `Vehicle with ID: ${vehicleId} not found`);
            throw new AppError('vehicle not found', 404);
        }

        return result
    }


    /**
   * Fetches the latest state log entry for a vehicle based on a timestamp.
   * @param {string} vehicleId - The ID of the vehicle.
   * @param {string} timestamp - The timestamp to retrieve the state for.
   * @returns {Promise<QueryResult>} A promise that resolves to the query result of the state logs.
   */
    public fetchVehicleStatelogs(vehicleId: string, timestamp: string) {
        logger.info('info', `Querying state logs for vehicle ID: ${vehicleId}`);
        return this.databaseConnector.query<{ state: string }>(
            'SELECT state FROM stateLogs WHERE vehicleId = $1 AND timestamp <= $2 ORDER BY timestamp DESC LIMIT 1',
            [vehicleId, timestamp]
        );
    }


    /**
    * Fetches the vehicle state by its ID and a given timestamp, either from the cache or the database.
    * @param {string} vehicleId - The ID of the vehicle.
    * @param {string} timestamp - The timestamp to retrieve the state for.
    * @returns {Promise<object>} A promise that resolves to the vehicle state information.
    */
    public async fetchVehicleStateByTimestamp(vehicleId: string, timestamp: string) {
        const cacheKey = this.generateVehicleCacheKey(vehicleId, timestamp);
        logger.info(`Cache key generated: ${cacheKey}`);

        const cachedData = await this.fetchCachedVehicleStateByTimestamp(vehicleId, timestamp)

        if (cachedData) {
            logger.info(`Cache hit for key: ${cacheKey}`);
            return cachedData
        }

        const vehicleResult = await this.fetchVehicleById(vehicleId)
        const stateResult = await this.fetchVehicleStatelogs(vehicleId, timestamp)

        // Log the successful retrieval of data
        logger.info(`Data retrieved for vehicle ID: ${vehicleId} at timestamp: ${timestamp}`);

        const response = {
            vehicle: vehicleResult.rows[0],
            state: stateResult.rowCount > 0 ? stateResult.rows[0].state : 'unknown',
        };

        // Store the fetched data in Redis, setting an expiration time (e.g., 60 seconds)
        this.cacheService.set(cacheKey, JSON.stringify(response), 60);

        return response;
    }
}