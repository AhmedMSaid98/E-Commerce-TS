import crypto from "crypto";

/**
 * Hashing password by crypto
 * @param password - Enter plain password
 * @returns password hashed
 */

export function hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString("hex");

    const hash = crypto
        .pbkdf2Sync(
            password,
            salt,
            10000, // iterations
            64, // key lenght
            "sha512" // algorith
        )
        .toString("hex");

    return `${salt}:${hash}`;
}

/**
 * verify password with the plain password and hashed password
 * @param password  - Enter plain password
 * @param hashed    - Enter hashed password
 * @returns returns boolean of the success or failure of the process
 */

export function verifyPassword(password: string, hashed: string) {
    const [salt, originalHash] = hashed.split(":");

    const hash = crypto.pbkdf2Sync(password, salt!, 10000, 64, "sha512").toString("hex");

    return hash === originalHash;
}
