import { join } from "path";
import { readFileSync } from "fs";

/**
 * Load configuration file
 * @returns configuration data
 */
export function loadConfigFile(): any {
  try {
    // Load configuration data
    const rawData = readFileSync(join(__dirname, "../config/input.json")).toString();
    // Transform to JSON and return data
    return JSON.parse(rawData);
  } catch (err) {
    // Print error
    console.error(err);
    // Return
    return undefined;
  }
}