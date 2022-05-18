import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

let IP_ALLOWLIST = [
  // Postman Echo API, https://learning.postman.com/docs/developer/echo-api/
  "34.205.194.84/32"
]

export class LambdaPrivateAllowListIp extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let vpc = new cdk.aws_ec2.Vpc(this, "Vpc", {
      cidr: "10.0.0.0/16",
      natGateways: 1,
      maxAzs: 1,
      subnetConfiguration: [
        {
          name: "publicForNatGateway",
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        },
        {
          name: "privateWithNat",
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    });

    let sgLambda = new cdk.aws_ec2.SecurityGroup(this, "PrivateLambdaSG", {
      vpc,
      allowAllOutbound: false,
    });

    for (let ip of IP_ALLOWLIST) {
      sgLambda.addEgressRule(
        cdk.aws_ec2.Peer.ipv4(ip),
        cdk.aws_ec2.Port.allTraffic(),
      )
    }

    let lambda = new cdk.aws_lambda_nodejs.NodejsFunction(this, "PrivateLambda", {
      entry: "./lib/functions/main.ts",
      vpc,
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      },
      securityGroups: [sgLambda],
      vpcSubnets: {
        subnets: vpc.privateSubnets,
      },
    });
  }
}
