import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { PrivateHostedZone } from "@aws-cdk/aws-route53";
import { VpcStack } from "./vpc-stack";

export interface HostZoneStackProps extends StackProps {
  readonly vpcStacks: VpcStack[];
  readonly zoneName: string;
}

export class HostedZoneStack extends Stack {
  public targetZone: PrivateHostedZone;

  constructor(scope: Construct, id: string, props: HostZoneStackProps) {
    super(scope, id, props);
    this.targetZone = new PrivateHostedZone(this, "PrivateHostedZone", {
      vpc: props.vpcStacks[0].vpc,
      zoneName: props.zoneName
    });
    // Add each of the VPC to the Zone, excluding the 1st VPC that we already added
    props.vpcStacks.forEach((vpcStack, index) => {
      // Explicitly skip entry 0.
      if (index != 0) {
        this.targetZone.addVpc(vpcStack.vpc);
      }
    });
  }
}
