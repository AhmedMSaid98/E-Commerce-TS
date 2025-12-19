/**
 * Transforms paginated data into a unified API response structure.
 * @param success           - Indicates whether the request was successfully processed.
 * @param statusCode        - HTTP status code returned to the client.
 * @param logMessage        - Message used for internal logging (success or error logs).
 * @param message           - User-facing message describing the result of the operation.
 * @param currentPage       - The current page number in the pagination system.
 * @param totalPages        - The total number of available pages.
 * @param totalDataCount    - Total count of all records available (before pagination).
 * @param data              - (Optional) The actual payload/data returned for the current page.
 *
 * @returns An object containing the standardized paginated response structure.
 */

function paginateResTransformer<T>(
    success: boolean,
    statusCode: number,
    logMessage: string,
    message: string,
    currentPage: number,
    totalPages: number,
    totalDataCount: number,
    data?: T[]
) {
    if (success) {
        console.log(`LOG: ${logMessage}`);
    } else {
        console.error(`LOG: ${logMessage}`);
    }

    return { success, statusCode, message, currentPage, totalPages, totalDataCount, data };
}

export default paginateResTransformer;
