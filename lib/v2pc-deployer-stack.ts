import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// Modules
import { loadConfigFile } from '../modules/config';
// Resources
import * as AwsVpc from "../resources/vpc";

export class V2PcDeployerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Load configuration
    const config = loadConfigFile();
    if (config === undefined) {
      return;
    }
  }
}
