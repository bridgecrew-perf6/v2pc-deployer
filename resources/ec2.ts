import { Construct } from "constructs";
// Modules
import { createHashId, getResourceId, setResourceId } from "../modules/support";
// Library
import * as ec2 from "aws-cdk-lib/aws-ec2";

/**
 * Create block device mappings on inline
 * @param mappingConfig mapping data in instance
 * @param volumeConfig volume configuration
 * @returns block device mappings data
 */
function createBlockDeviceMappingOnInline(mappingConfig: any[], volumeConfig: any): ec2.CfnInstance.BlockDeviceMappingProperty[] {
  // Create array for block device mapping
  const blockDeviceMappings: ec2.CfnInstance.BlockDeviceMappingProperty[] = [];
  // Process
  for (const elem of mappingConfig) {
    if (elem.type === "ebs" && volumeConfig[elem.id]) {
      // Extract data
      const data = volumeConfig[elem.id];
      // Set parameter for iops by volume type
      let iops: number|undefined = undefined;
      if (data.volumeType === "io1" || data.volumeType === "io2") {
        iops = Number(data.iops);
      }
      // Push data
      blockDeviceMappings.push({
        deviceName: data.device,
        ebs: {
          deleteOnTermination: data.deleteOnTermination,
          encrypted: data.encrypted,
          iops: iops,
          volumeSize: data.volumeSize,
          volumeType: data.volumeType
        }
      });
      // Mapping resource id
      setResourceId(elem.id, "true");
    }
  }
  // Return
  return blockDeviceMappings;
}

/**
 * Create a network interface on inline
 * @param mappingConfig mapping data in instance
 * @returns a list of network interface for instance
 */
function createCfnNetworkInterfaceOnInline(mappingConfig: any[]): ec2.CfnInstance.NetworkInterfaceProperty[] {
  // Create array for network interface
  const networkInterfaces: ec2.CfnInstance.NetworkInterfaceProperty[] = [];
  // Process
  for (const elem of mappingConfig) {
    // Get a list of security group id
    const securityGroupIds: string[] = elem.securityGroups.map((id: string) => getResourceId(id));
    // Push data
    networkInterfaces.push({
      deleteOnTermination: elem.deleteOnTermination,
      description: elem.description,
      deviceIndex: elem.deviceIndex.toString(),
      groupSet: securityGroupIds,
      ipv6Addresses: elem.ipv6Addresses,
      privateIpAddresses: elem.privateIpAddresses,
      subnetId: getResourceId(elem.subnetId)
    });
    // Mapping resource id
    setResourceId(elem.id, "true");
  }
  // Return
  return networkInterfaces;
}

/**
 * Create cloudFormation resource for ec2 instance
 * @param scope context scope
 * @param instanceConfig ec2 instance configuration
 * @param volumeConfig ebs volume configuration
 * @returns cloudFormation resource for ec2 instancey
 */
export function createCfnInstance(scope: Construct, instanceConfig: any, volumeConfig: any): ec2.CfnInstance {
  // Set block devices
  const blockDeviceMappings: ec2.CfnInstance.BlockDeviceMappingProperty[] = createBlockDeviceMappingOnInline(instanceConfig.blockDeviceMappings, volumeConfig);
  // Set network interfaces
  const networkInterfaces: ec2.CfnInstance.NetworkInterfaceProperty[] = createCfnNetworkInterfaceOnInline(instanceConfig.networkInterfaces);
  // Set parameter for instance
  const props: any = {
    availabilityZone: instanceConfig.availabilityZone,
    blockDeviceMappings: blockDeviceMappings,
    cpuOptions: {
      coreCount: instanceConfig.cpuOptions.coreCount,
      threadsPerCore: instanceConfig.cpuOptions.threadsPerCore
    },
    ebsOptimized: instanceConfig.ebsOptimized,
    enclaveOptions: {
      enabled: instanceConfig.enclaveOptions.enabled
    },
    hibernationOptions: {
      configured: instanceConfig.hibernationOptions.configured
    },
    imageId: instanceConfig.imageId,
    instanceType: instanceConfig.instanceType,
    keyName: instanceConfig.keyName,
    monitoring: instanceConfig.monitoring,
    networkInterfaces: networkInterfaces,
    sourceDestCheck: instanceConfig.sourceDestCheck,
    propagateTagsToVolumeOnCreation: true,
    tags: instanceConfig.tags !== undefined ? instanceConfig.tags : undefined,
    tenancy: instanceConfig.tenancy
  }

  // Create cloudFormation resource of instance
  const cfnInstance = new ec2.CfnInstance(scope, createHashId(instanceConfig.id), props);
  // Mapping resource id
  setResourceId(instanceConfig.id, cfnInstance.ref);
  // Return
  return cfnInstance;
}