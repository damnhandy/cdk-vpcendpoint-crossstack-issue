import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { VpcStack } from "./vpc-stack";
import { InterfaceVpcEndpointService } from "@aws-cdk/aws-ec2";
import { ARecord, PrivateHostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { InterfaceVpcEndpointTarget } from "@aws-cdk/aws-route53-targets";

export interface EndpointDnsStackProps extends StackProps {
  readonly vpcStack: VpcStack;
  readonly serviceEndpoint: string;
  readonly dnsName: string;
  readonly name: string;
  readonly hostedZone: PrivateHostedZone;
}

export class EndpointDnsStack extends Stack {
  constructor(scope: Construct, id: string, props: EndpointDnsStackProps) {
    super(scope, id, props);

    const vpce = props.vpcStack.vpc.addInterfaceEndpoint(`VpcEndpoint${props.name}`, {
      service: new InterfaceVpcEndpointService(props.serviceEndpoint),
      securityGroups: [props.vpcStack.endpointSecurityGroup],
      privateDnsEnabled: false
    });

    const arecord = new ARecord(this, `ARecord${props.name}`, {
      zone: props.hostedZone,
      recordName: props.dnsName,
      target: RecordTarget.fromAlias(new InterfaceVpcEndpointTarget(vpce))
    });
  }
}
