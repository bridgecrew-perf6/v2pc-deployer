import { Construct } from "constructs";
// Modules
import { createHashId, getResourceId, setResourceId } from "../modules/support";
// Library
import * as rds from "aws-cdk-lib/aws-rds";

/**
 * Create cloudFormation for db subnet group
 * @param scope context scope
 * @param config db subnet group configuration
 */
export function createCfnDBSubnetGroup(scope: Construct, config: any) {
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
  new rds.CfnDBSubnetGroup(scope, createHashId(JSON.stringify(props)), props);
}

export function createCfnDBInstance(scope: Construct, config: any) {
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
      engine: config.engine
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
      enableCloudwatchLogsExports: config.enableCloudwatchLogsExports,
      engine: config.engine,
      engineVersion: config.engineVersion,
      iops: config.iops,
      masterUsername: config.masterUsername,
      maxAllocatedStorage: Number(config.maxAllocatedStorage),
      monitoringInterval: config.monitoringInterval,
      preferredBackupWindow: config.preferredBackupWindow
    };
  }

  // // Set properties for db instance
  // const props: rds.CfnDBInstanceProps = {
  //   allocatedStorage: allocatedStorage,
  //   associatedRoles: config.associatedRoles,
  //   autoMinorVersionUpgrade: config.autoMinorVersionUpgrade,
  //   availabilityZone: availabilityZone,
  //   backupRetentionPeriod: backupRetentionPeriod,
  //   characterSetName: characterSetName,
  //   // cACertificateIdentifier: config.cACertificateIdentifier,
  //   // copyTagsToSnapshot: config.copyTagsToSnapshot,
  //   dbClusterIdentifier: dbClusterIdentifier,
  //   // dbInstanceClass: config.dbInstanceClass,
  //   // deletionProtection: config.deletionProtection,
  //   // masterUsername: config.masterUsername,
  //   // maxAllocatedStorage: config.maxAllocatedStorage,
  //   // monitoringInterval: config.monitoringInterval,
  //   // multiAz: config.multiAz,
  //   // preferredBackupWindow: preferredBackupWindow,
  //   // storageEncrypted: config.storageEncrypted,
  //   // storageType: config.storageType
  // };
}

export function createCfnDBParameterGroup(scope: Construct, config: any): rds.CfnDBParameterGroup {
  // Set properties for db parameter group
  const props: rds.CfnDBParameterGroupProps = {
    description: config.description,
  };
}

// export function createCfnDBCluster(scope: Construct, config: any) {
//   // Set properties for db security group
//   const props: rds.CfnDBCluster = {
//     availabilityZones: [""],
//     engine: "",
//   };
// }