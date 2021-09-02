import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { ISecurityGroup, IVpc, SecurityGroup, SubnetType, Vpc } from "@aws-cdk/aws-ec2";

export interface VpcStackProps extends StackProps {
  readonly cidr: string;
  readonly index: number;
}

export class VpcStack extends Stack {
  vpc: IVpc;
  endpointSecurityGroup: ISecurityGroup;
  public index: number;
  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);
    this.index = props.index;
    this.createVpc(props);

    this.endpointSecurityGroup = new SecurityGroup(this, `EndpointSG`, {
      vpc: this.vpc,
      allowAllOutbound: false
    });
  }

  createVpc(props: VpcStackProps): void {
    this.vpc = new Vpc(this, "Vpc", {
      cidr: props.cidr,
      natGateways: 0,
      maxAzs: this.availabilityZones.length,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "test",
          subnetType: SubnetType.ISOLATED
        }
      ]
    });
  }
}
