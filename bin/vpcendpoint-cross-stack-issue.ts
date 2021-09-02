#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { VpcStack } from "../lib/vpc-stack";
import { HostedZoneStack } from "../lib/hosted-zone-stack";
import { EndpointDnsStack } from "../lib/endpoint-dns-stack";

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const cidrs = ["10.0.0.0/21", "10.1.0.0/21"];

const app = new cdk.App();
const vpcStacks = new Array<VpcStack>();

cidrs.forEach((cidr, index) => {
  const vpcStack = new VpcStack(app, `VpcStack${index}`, {
    env: env,
    cidr: cidr,
    index: index
  });
  vpcStacks.push(vpcStack);
});

const hostedZoneStack = new HostedZoneStack(app, "HostedZoneStack", {
  env: env,
  zoneName: "example.com",
  vpcStacks: vpcStacks
});
vpcStacks.forEach(stack => {
  hostedZoneStack.addDependency(stack);

  const endpointStack = new EndpointDnsStack(app, `EndpointStack-${stack.index}`, {
    env: env,
    dnsName: "things.example.com",
    hostedZone: hostedZoneStack.targetZone,
    name: "things",
    serviceEndpoint: "com.amazonaws.vpce.us-east-1.vpce-svc-1234567890AbcdEfg",
    vpcStack: stack
  });
});
