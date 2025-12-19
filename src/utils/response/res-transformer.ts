/**
 * Builds and returns a standardized API response object while logging the result.
 * @param success       - Whether the operation succeeded
 * @param statusCode    - HTTP status code to send to the client
 * @param logMessage    - Message written to stdout (success) or stderr (failure)
 * @param message       - Readable description returned to the client
 * @param data          - Optional payload attached to the response
 * @returns             - Plain object ready to be sent as JSON
 */

function resTransformer<T>(
    success: boolean,
    statusCode: number,
    logMessage: string,
    message: string,
    data?: T
) {
    if (success) {
        console.log(`Log: ${logMessage}`);
    } else {
        console.error(`Log: ${logMessage}`);
    }

    return { success, statusCode, message, data };
}

export default resTransformer;
