// Mapping data for resource
const mappingResources: any = {};

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