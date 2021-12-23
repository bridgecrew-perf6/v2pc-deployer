import { Construct } from "constructs";
// Resources
import * as ResourceVpc from "../resources/vpc";

export function createVpc(scope: Construct, config: any): void {
  // Create vpc
  const vpc = ResourceVpc.createCfnVpc(scope, config);
  // Get a resource id for created vpc
  const vpcId = vpc.ref;  

  // Create internet gateway
  ResourceVpc.createCfnInternetGateway(scope, config.internetGateway);

  // Create subnets
  for (const elem of config.subnets) {
    ResourceVpc.createCfnSubnet(scope, vpcId, elem);
  }

  // Create networkAcls
  for (const elem of config.networkAcls) {
    ResourceVpc.createCfnNetworkAcl(scope, vpcId, elem);
  }
}