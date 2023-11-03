import { databaseConnector } from "../../database/connector";
import AppError from "../../helpers/appError";
import catchAsync from "../../helpers/catchAsync";
import logger from "../../helpers/logger";
import { CacheService } from "../../services/cache";
import Service from "./vehicle.service";

/**
 * Controller class for handling requests related to vehicle states.
 */
export default class Controller {
    /**
     * Cache service for cache operations.
     */
    cacheService: CacheService

    /**
     * Vehicle service for business logic related to vehicle data.
     */
    vehicleService: Service

    /**
     * Initializes a new instance of the Controller class.
     */

    constructor() {
        this.cacheService = new CacheService({ url: process.env.REDIS_URL });
        this.vehicleService = new Service(databaseConnector, this.cacheService)
    }

    /**
     * Gets the state of a vehicle by ID and timestamp from the cache or the database.
     * @async
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * @param {NextFunction} next - The callback to pass control to the next middleware.
     * @returns {Promise<void>} A promise that resolves when the method has finished execution.
     */
    getStateByIdAndTimestamp = catchAsync(async (req, res, next): Promise<void> => {
        const vehicleId = req.params.id;
        const { timestamp } = req.query as { timestamp: string };

        if (!timestamp) {
            logger.info(`Timestamp query parameter is missing in the request.`);
            return next(new AppError("Timestamp is required", 400));
        }

        const responsePayload = await this.vehicleService.fetchVehicleStateByTimestamp(vehicleId, timestamp);
        // Log the successful retrieval of data
        logger.info(`Data retrieved for vehicle ID: ${vehicleId} at timestamp: ${timestamp}`);

        // Return the fetched data
        res.json({ data: responsePayload });

    })
}