import { createHash } from "crypto";
// Mapping data for resource
const mappingResources: any = {};

/**
 * Create a hash id for use in cdk
 * @param origin origin id
 * @returns created hash id
 */
export function createHashId(origin: string) {
  return `TOV-${createHash("sha256").update(origin).digest("hex")}`;
}

/**
 * Set mapping for the previous resource id with the current resource id
 * @param prevResourceId previous resource id
 * @param curResourceId current resource id
 */
export function setResourceId(prevResourceId: string, curResourceId: string): void {
  mappingResources[prevResourceId] = curResourceId;
}

/**
 * Get current resource id for previous resource id
 * @param prevResourceId previous resource id
 * @returns current resource id
 */
export function getResourceId(prevResourceId: string): string {
  return mappingResources[prevResourceId];
}