import { Construct } from "constructs";
// Resources
import * as ResourceRds from "../resources/rds";

export function createRds(scope: Construct, config: any) {
  // Create db subnet groups
  for (const elem of config.dbSubnetGroups) {
    ResourceRds.createCfnDBSubnetGroup(scope, elem);
  }
  // Create db instances
  for (const elem of config.instances) {
    ResourceRds.createCfnDBInstance(scope, elem);
  }
}