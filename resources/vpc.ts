import { Construct } from "constructs";
// Modules
import { createHashId, getResourceId, setResourceId } from "../modules/support";
// Library
import * as ec2 from "aws-cdk-lib/aws-ec2";

/**
 * Create cloudFormation resource for internet gateway
 * @param scope context scope
 * @param config internet gateway configuration
 * @returns cloudFormation resource for internet gateway
 */
export function createCfnInternetGateway(scope: Construct, config: any) {
  // Set properties for internet gateway
  const props: ec2.CfnInternetGatewayProps = {
    tags: config.tags !== undefined ? config.tags : undefined
  };
  // Create cloudFormation resource for internet gateway
  const cfnInternetGateway = new ec2.CfnInternetGateway(scope, createHashId(config.id), props);
  // Mapping resource id
  setResourceId(config.id, cfnInternetGateway.ref);
  // Return
  return cfnInternetGateway;
}

/**
 * Create cloudFormation resource for networkAcl
 * @param scope context scope
 * @param vpcId vpc resource id
 * @param config networkAcl configuration
 * @returns cloudFormation resource for networkAcl
 */
export function createCfnNetworkAcl(scope: Construct, vpcId: string, config: any): ec2.CfnNetworkAcl {
  // Set parameter for networkAcl
  const props: ec2.CfnNetworkAclProps = {
    tags: config.tags !== undefined ? config.tags : undefined,
    vpcId: vpcId
  };
  // Create cloudFormation resource for networkAcl
  const cfnNetworkAcl = new ec2.CfnNetworkAcl(scope, createHashId(config.id), props);
  // Mapping resource id
  setResourceId(config.id, cfnNetworkAcl.ref);
  // Return
  return cfnNetworkAcl;
}

/**
 * Create cloudFormation resource for network interface
 * @param scope context scope
 * @param config network interface configuration
 * @returns cloudFormation resource for network interface
 */
export function createCfnNetworkInterface(scope: Construct, config: any): ec2.CfnNetworkInterface {
  // Extract a list of security group id
  const securityGroups: string[] = config.securityGroups.map((id: string) => getResourceId(id));
  // Set parameter for network interface
  const props: ec2.CfnNetworkInterfaceProps = {
    description: config.description,
    groupSet: securityGroups,
    ipv6Addresses: config.ipv6Addresses,
    privateIpAddresses: config.privateIpAddresses,
    subnetId: getResourceId(config.subnetId),
    tags: config.tags !== undefined ? config.tags : undefined
  };
  // Create cloudFormation resource for network interface
  const cfnNetworkInterface = new ec2.CfnNetworkInterface(scope, createHashId(config.id), props);
  // Mapping resource id
  setResourceId(config.id, cfnNetworkInterface.ref);
  // Return
  return cfnNetworkInterface;
}

/**
 * Create cloudFormation resource for subnet
 * @param scope context scope
 * @param vpcId vpc resource id
 * @param config subnet configuration
 * @returns cloudFormation resource for subnet
 */
export function createCfnSubnet(scope: Construct, vpcId: string, config: any): ec2.CfnSubnet {
  // Set parameter for subnet
  const props: ec2.CfnSubnetProps = {
    assignIpv6AddressOnCreation: config.assignIpv6AddressOnCreation === true ? config.assignIpv6AddressOnCreation : undefined,
    availabilityZone: config.availabilityZone,
    cidrBlock: config.cidrBlock,
    mapPublicIpOnLaunch: config.mapPublicIpOnLaunch,
    tags: config.tags !== undefined ? config.tags : undefined,
    vpcId: vpcId
  };
  // Create cloudFormation resource for subnet
  const cfnSubnet = new ec2.CfnSubnet(scope, createHashId(config.id), props);
  // Mapping resource id
  setResourceId(config.id, cfnSubnet.ref);
  // Return
  return cfnSubnet;
}

/**
 * Create cloudeFormation resource for vpc
 * @param scope context scope
 * @param config vpc configuration
 * @returns cloudFormation resource for vpc
 */
export function createCfnVpc(scope: Construct, config: any) {
  // Set parameter for vpc
  const props: ec2.CfnVPCProps = {
    cidrBlock: config.cidrBlock,
    enableDnsHostnames: config.enableDnsHostnames,
    enableDnsSupport: config.enableDnsSupport,
    instanceTenancy: config.instanceTenancy === "default" ? ec2.DefaultInstanceTenancy.DEFAULT : ec2.DefaultInstanceTenancy.DEDICATED,
    tags: config.tags !== undefined ? config.tags : undefined
  };
  // Create cloudFormation resource for vpc
  const cfnVpc = new ec2.CfnVPC(scope, createHashId(config.id), props);
  // Mapping resource id
  setResourceId(config.id, cfnVpc.ref);
  // Return
  return cfnVpc;
}

/**
 * Create cloudFormation resource for vpc endpoint
 * @param scope context scope
 * @param vpcId vpc resource id
 * @param config endpoint configuration
 * @returns cloudFormation resource for vpc endpoint
 */
export function createCfnVpcEndpoint(scope: Construct, vpcId: string, config: any): ec2.CfnVPCEndpoint {
  // Extract a list of route table id
  const routeTables = config.routeTableIds.map((id: string) => getResourceId(id));
  // Extract a list of security group
  const securityGroups = config.securityGroupIds.map((id: string) => getResourceId(id));
  // Extract a lisf of subnet id
  const subnets = config.subnetIds.map((id: string) => getResourceId(id));

  // Set properties
  const props: ec2.CfnVPCEndpointProps = {
    policyDocument: JSON.parse(config.policyDocument),
    privateDnsEnabled: config.privateDnsEnabled,
    routeTableIds: routeTables.length > 0 ? routeTables : undefined,
    securityGroupIds: securityGroups.length > 0 ? securityGroups : undefined,
    serviceName: config.serviceName,
    subnetIds: subnets.length > 0 ? subnets : undefined,
    vpcEndpointType: config.type,
    vpcId: vpcId
  };
  // Create cloudFormation resource for vpc endpoint
  const cfnVpcEndpoint = new ec2.CfnVPCEndpoint(scope, createHashId(config.id), props);
  // Mappgin resource id
  setResourceId(config.id, cfnVpcEndpoint.ref);
  // Return
  return cfnVpcEndpoint;
}