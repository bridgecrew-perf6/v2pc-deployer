import { Construct } from "constructs";
// Resources
import * as ResourceEc2 from "../resources/ec2";

export function createEc2(scope: Construct, instanceConfig: any[], volumeConfig: any) {
  for (const elem of instanceConfig) {
    // Create ec2 instance
    ResourceEc2.createCfnInstance(scope, elem, volumeConfig);
  }
}