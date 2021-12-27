import { Construct } from "constructs";
// Modules
import { createHashId, getResourceId, setResourceId } from "../modules/support";
// Library
import * as rds from "aws-cdk-lib/aws-rds";

/**
 * Create cloudFormation for db subnet group
 * @param scope context scope
 * @param config db subnet group configuration
 * @returns cloudFormation resource for db subnet group
 */
export function createCfnDBSubnetGroup(scope: Construct, config: any): rds.CfnDBSubnetGroup {
  // Extract a list of subnet id
  const subnetIds: string[] = config.subnetIds.map((id: string) => getResourceId(id));
  // Set properties for db subnet group
  const props: rds.CfnDBSubnetGroupProps = {
    dbSubnetGroupDescription: config.description,
    dbSubnetGroupName: config.name,
    subnetIds: subnetIds,
    tags: config.tags !== undefined ? config.tags : undefined
  };
  // Create cloudFormation resource for db subnet group
  const cfnDBSubnetGroup = new rds.CfnDBSubnetGroup(scope, createHashId(JSON.stringify(props)), props);
  // Mapping resource id
  const name: string = cfnDBSubnetGroup.dbSubnetGroupName ? cfnDBSubnetGroup.dbSubnetGroupName : cfnDBSubnetGroup.ref;
  setResourceId(config.dbSubnetGroupName, name);
  // Return
  return cfnDBSubnetGroup;
}

/**
 * Create cloudFormation resource for db instance
 * @param scope context scope
 * @param config db instance configuration
 * @returns cloudFormation resource for db instance
 */
export function createCfnDBInstance(scope: Construct, config: any): rds.CfnDBInstance {
  // Extract a list of security group id (for dbSecurityGroup)
  const dbSecurityGroups: string[]|undefined = config.dbSecurityGroups !== undefined ? config.dbSecurityGroups.map((id: string) => getResourceId(id)) : undefined;
  // Extract a list of security group id (for vpcSecurityGroup)
  const vpcSecurityGroups: string[]|undefined = config.vpcSecurityGroups !== undefined ? config.vpcSecurityGroups.map((id: string) => getResourceId(id)) : undefined;
  // Set avaliability zone
  let availabilityZone: string|undefined = undefined;
  if (!config.multiAz) {
    availabilityZone = config.availabilityZone;
  }

  // Set properties for db instance by engin [aurora|another]
  let props: rds.CfnDBInstanceProps;
  if (config.engine.includes("aurora")) {
    props = {
      dbClusterIdentifier: config.dbClusterIdentifier,
      dbInstanceClass: config.dbInstanceClass,
      dbInstanceIdentifier: config.dbInstanceIdentifier,
      deleteAutomatedBackups: config.deleteAutomatedBackups,
      enablePerformanceInsights: config.enablePerformanceInsights,
      engine: config.engine,
      monitoringInterval: config.monitoringInterval,
      monitoringRoleArn: config.monitoringInterval !== 0 && config.monitoringInterval !== undefined ? config.monitoringRoleArn : undefined,
      multiAz: config.multiAz,
      port: config.port.toString(),
      promotionTier: Number(config.promotionTier),
      publiclyAccessible: config.publiclyAccessible,
      tags: config.tags
    };
  } else {
    props = {
      allocatedStorage: config.allocatedStorage,
      availabilityZone: availabilityZone,
      backupRetentionPeriod: Number(config.backupRetentionPeriod),
      characterSetName: config.characterSetName,
      copyTagsToSnapshot: config.copyTagsToSnapshot,  // dbSecurityGroup 지정 시, 안보낼수있음
      dbInstanceClass: config.dbInstanceClass,
      dbInstanceIdentifier: config.dbInstanceIdentifier,  // dbSecurityGroup 지정 시, 안보낼수있음
      deleteAutomatedBackups: config.deleteAutomatedBackups,
      deletionProtection: config.deletionProtection,
      dbSecurityGroups: dbSecurityGroups,
      enableCloudwatchLogsExports: config.enableCloudwatchLogsExports,
      engine: config.engine,
      engineVersion: config.engineVersion,
      iops: config.storageType === "io" ? config.iops : undefined,
      kmsKeyId: config.kmsKeyId,
      masterUsername: config.masterUsername,
      maxAllocatedStorage: Number(config.maxAllocatedStorage),
      monitoringInterval: config.monitoringInterval,
      monitoringRoleArn: config.monitoringInterval !== 0 && config.monitoringInterval ? config.monitoringRoleArn : undefined,
      multiAz: config.multiAz,
      port: config.port.toString(),
      preferredBackupWindow: config.preferredBackupWindow,
      preferredMaintenanceWindow: config.preferredMaintenanceWindow,
      publiclyAccessible: config.publiclyAccessible,
      storageType: config.storageType,
      sourceDbInstanceIdentifier: config.sourceDbInstanceIdentifier,
      storageEncrypted: config.snapshotIdentifier !== undefined || config.sourceDBInstanceIdentifier != undefined ? config.storageEncrypted : config.kmsKeyId !== undefined ? true : undefined,
      tags: config.tags,
      vpcSecurityGroups: vpcSecurityGroups
    };
  }
  // Create cloudFormation resource for rds instance
  const cfnDBInstance = new rds.CfnDBInstance(scope, createHashId(config.dbInstanceIdentifier), props);
  // Mapping resource id
  const id: string = cfnDBInstance.dbInstanceIdentifier ? cfnDBInstance.dbInstanceIdentifier : cfnDBInstance.ref;
  setResourceId(config.dbInstanceIdentifier, id);
  // Return
  return cfnDBInstance;
}