import { Construct } from "constructs";
// Modules
import { createHashId, getResourceId, setResourceId } from "../modules/support";
// Library
import * as ec2 from "aws-cdk-lib/aws-ec2";

/**
 * Associate route table for subnet
 * @param scope context scope
 * @param routeTableId route table resource id
 * @param subnetId subnet resource id
 */
export function associateRouteTableForSubnet(scope: Construct, routeTableId: string, subnetId: string) {
  // Set properties for association
  const props: ec2.CfnSubnetRouteTableAssociationProps = {
    routeTableId: routeTableId,
    subnetId: subnetId
  };
  // Create association
  new ec2.CfnSubnetRouteTableAssociation(scope, createHashId(`${routeTableId}${subnetId}`), props);
}

/**
 * Associate networkAcl for subnet
 * @param scope context scope
 * @param networkAclId networkAcl resource id
 * @param subnetId subnet resource id
 */
export function associateNetworkAclForSubnet(scope: Construct, networkAclId: string, subnetId: string) {
  // Set properties for association
  const props: ec2.CfnSubnetNetworkAclAssociationProps = {
    networkAclId: networkAclId,
    subnetId: subnetId
  };
  // Create association
  new ec2.CfnSubnetNetworkAclAssociation(scope, createHashId(`${networkAclId}${subnetId}`), props);
}

/**
 * Append networkAcl entry
 * @param scope context scope
 * @param networkAclId networkAcl resource id
 * @param index entry index
 * @param config networkAcl entry configuration
 */
export function appendNetworkAclEntry(scope: Construct, networkAclId: string, index: number, config: any): void {
  // Set parameter for networkAcl entry
  const props: ec2.CfnNetworkAclEntryProps = {
    cidrBlock: config.cidrBlock,
    egress: config.egress,
    networkAclId: networkAclId,
    portRange: config.portRange,
    protocol: Number(config.protocol),
    ruleAction: config.ruleAction,
    ruleNumber: config.ruleNumber
  };
  // Append entry
  new ec2.CfnNetworkAclEntry(scope, createHashId(`${networkAclId}entry${index}`), props);
}

/**
 * Attach internet gateway for vpc
 * @param scope context scope
 * @param vpcId vpc resource id
 * @param internetGatewayId internet gateway resource id
 */
export function attachInternetGateway(scope: Construct, vpcId: string, internetGatewayId: string): ec2.CfnVPCGatewayAttachment {
  // Set properties
  const props: ec2.CfnVPCGatewayAttachmentProps = {
    internetGatewayId: internetGatewayId,
    vpcId: vpcId
  };
  // Attach internet gateway
  return new ec2.CfnVPCGatewayAttachment(scope, createHashId(`${internetGatewayId}${vpcId}`), props);
}

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
  const securityGroupIds: string[] = config.securityGroups.map((id: string) => getResourceId(id));
  // Set parameter for network interface
  const props: ec2.CfnNetworkInterfaceProps = {
    description: config.description,
    groupSet: securityGroupIds,
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
 * Create cloudFormation resource for route table
 * @param scope context scope
 * @param vpcId vpc resource id
 * @param config route table configuration
 * @returns cloudFormation resource for route table
 */
export function createCfnRouteTable(scope: Construct, vpcId: string, config: any): ec2.CfnRouteTable {
  // Set parameter for route table
  const props: ec2.CfnRouteTableProps = {
    tags: config.tags !== undefined ? config.tags : undefined,
    vpcId: vpcId
  };
  // Create cloudFormation resource for route table
  const cfnRouteTable = new ec2.CfnRouteTable(scope, createHashId(config.id), props);
  // Mapping resource id
  setResourceId(config.id, cfnRouteTable.ref);
  // Return
  return cfnRouteTable;
}

/**
 * Create cloudFormation resource for security group
 * @param scope context scope
 * @param vpcId vpc resource id
 * @param config security group configuration
 * @returns cloudFormation resource for security group
 */
export function createCfnSecurityGroup(scope: Construct, vpcId: string, config: any): ec2.CfnSecurityGroup {
  // Set parameter for security group
  const props: ec2.CfnSecurityGroupProps = {
    groupDescription: config.description,
    groupName: config.name,
    tags: config.tags !== undefined ? config.tags : undefined,
    vpcId: vpcId
  };
  // Create cloudFormation resource for security group
  const cfnSecurityGroup = new ec2.CfnSecurityGroup(scope, createHashId(config.id), props);
  // Mapping resource id
  setResourceId(config.id, cfnSecurityGroup.ref);
  // Return
  return cfnSecurityGroup;
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

/**
 * Set a security group egress
 * @param scope context scope
 * @param securityGroupId security group resource id
 * @param config security group egress configuration
 */
export function setSecurityGroupEgress(scope: Construct, securityGroupId: string, config: any) {
  // Set destination
  let cidrIp = undefined;
  let cidrIpv6 = undefined;
  let destinationPrefixListId = undefined;
  let destinationSecurityGroupId = undefined;
  // Set destination by type [ipv4|ipv6|prefixList|securityGroup]
  if (config.type === "ipv4") {
    cidrIp = config.destination;
  } else if (config.type === "ipv6") {
    cidrIpv6 = config.destination;
  } else if (config.type === "prefix") {
    destinationPrefixListId = config.destination;
  } else if (config.type === "securityGroup") {
    destinationSecurityGroupId = getResourceId(config.destination);
  }
  // Set properties for security group egress
  const props: ec2.CfnSecurityGroupEgressProps  = {
    cidrIp: cidrIp,
    cidrIpv6: cidrIpv6,
    description: config.description,
    destinationPrefixListId: destinationPrefixListId,
    destinationSecurityGroupId: destinationSecurityGroupId,
    fromPort: config.fromPort,
    groupId: securityGroupId,
    ipProtocol: config.protocol,
    toPort: config.toPort
  };
  // Append egress for security group
  new ec2.CfnSecurityGroupEgress(scope, createHashId(`${JSON.stringify(props)}`), props);
}

/**
 * Set a security group ingress
 * @param scope context scope
 * @param securityGroupId security group resource id
 * @param config security group ingress configuration
 */
export function setSecurityGroupIngress(scope: Construct, securityGroupId: string, config: any) {
  // Set source
  let cidrIp = undefined;
  let cidrIpv6 = undefined;
  let sourcePrefixListId = undefined;
  let sourceSecurityGroupId = undefined;
  let sourceSecurityGroupOwnerId = undefined;
  // Set destination by type [ipv4|ipv6|prefixList|securityGroup]
  if (config.type === "ipv4") {
    cidrIp = config.source;
  } else if (config.type === "ipv6") {
    cidrIpv6 = config.source;
  } else if (config.type === "prefix") {
    sourcePrefixListId = config.source;
  } else if (config.type === "securityGroup") {
    sourceSecurityGroupId = getResourceId(config.source);
    sourceSecurityGroupOwnerId = config.userId;
  }
  // Set parameter for security group ingress
  const props: ec2.CfnSecurityGroupIngressProps = {
    cidrIp: cidrIp,
    cidrIpv6: cidrIpv6,
    description: config.description,
    fromPort: config.fromPort,
    ipProtocol: config.protocol,
    groupId: securityGroupId,
    sourcePrefixListId: sourcePrefixListId,
    sourceSecurityGroupId: sourceSecurityGroupId,
    sourceSecurityGroupOwnerId: sourceSecurityGroupOwnerId,
    toPort: config.toPort,
  };
  // Append ingress for security group
  new ec2.CfnSecurityGroupIngress(scope, createHashId(`${JSON.stringify(props)}`), props);
}