import { Construct } from "constructs";
import { getResourceId } from "../modules/support";
// Resources
import * as ResourceVpc from "../resources/vpc";

export function createVpc(scope: Construct, config: any): void {
  // Create vpc
  const vpc = ResourceVpc.createCfnVpc(scope, config);

  // Create basic vpc components
  createBasicVpcComponents(scope, vpc.ref, config);

  // Configure networkAcls
  configureNetworkAcls(scope, config.networkAcls);
  // Configure route tables
  configureRouteTables(scope, config.routeTables);
  // Configure security groups
  configureSecurityGroups(scope, config.securityGroups);

  // Create vpc endpoints
  createVpcEndoints(scope, vpc.ref, config.endpoints);
}

/**
 * Create basic vpc components
 * @param scope context scope
 * @param vpcId vpc resource id
 * @param config vpc configuration
 */
function createBasicVpcComponents(scope: Construct, vpcId: string, config: any) {
  // Create internet gateway
  const igw = ResourceVpc.createCfnInternetGateway(scope, config.internetGateway);
  // Attach a internet gateway for vpc
  ResourceVpc.attachInternetGateway(scope, vpcId, igw.ref);

  // Create networkAcls
  for (const elem of config.networkAcls) {
    ResourceVpc.createCfnNetworkAcl(scope, vpcId, elem);
  }
  // Create route tables
  for (const elem of config.routeTables) {
    ResourceVpc.createCfnRouteTable(scope, vpcId, elem);
  }
  // Create subnets
  for (const elem of config.subnets) {
    ResourceVpc.createCfnSubnet(scope, vpcId, elem);
  }
  // Create security groups
  for (const elem of config.securityGroups) {
    ResourceVpc.createCfnSecurityGroup(scope, vpcId, elem);
  }
}

/**
 * Create vpc endpoints
 * @param scope context scope
 * @param vpcId vpc resource id
 * @param config endpoints configuration
 */
function createVpcEndoints(scope: Construct, vpcId: string, config: any) {
  for (const elem of config) {
    ResourceVpc.createCfnVpcEndpoint(scope, vpcId, elem);
  }
}

/**
 * Configure networkAcl entries and associate for subnet
 * @param scope context scope
 * @param config networkAcls configuration
 */
function configureNetworkAcls(scope: Construct, config: any) {
  for (const elem of config) {
    // Attach entries
    elem.entries.forEach((entry: any, index: number) => {
      if (entry.ruleNumber <= 32766) ResourceVpc.appendNetworkAclEntry(scope, getResourceId(elem.id), index, entry);
    });
    // Associate for subnet
    elem.associations.forEach((association: any) => ResourceVpc.associateNetworkAclForSubnet(scope, getResourceId(elem.id), getResourceId(association.subnetId)));
  }
}

/**
 * Configure egress and ingress for security groups
 * @param scope context scope
 * @param config security groups configuraion
 */
function configureSecurityGroups(scope: Construct, config: any) {
  for (const elem of config) {
    // Configurate egress
    for (const egress of elem.egress) {
      ResourceVpc.setSecurityGroupEgress(scope, getResourceId(elem.id), egress);
    }
    // Configurate ingress
    for (const ingress of elem.ingress) {
      ResourceVpc.setSecurityGroupIngress(scope, getResourceId(elem.id), ingress);
    }
  }
}

/**
 * Configure route tables
 * @param scope context scope
 * @param config route table configuration
 */
function configureRouteTables(scope: Construct, config: any) {
  for (const elem of config) {
    // Associate for subnet
    elem.associations.forEach((association: any) => ResourceVpc.associateRouteTableForSubnet(scope, getResourceId(elem.id), getResourceId(association.subnetId)));
  }
}