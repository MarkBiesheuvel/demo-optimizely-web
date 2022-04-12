#!/usr/bin/env python3
import os
from constructs import Construct
from aws_cdk import (
    App,
    Environment,
    Stack,
    Duration,
    aws_certificatemanager as acm,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_route53 as route53,
    aws_route53_targets as targets,
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
    aws_synthetics_alpha as synthetics,
)

class OptimizelyWebStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        domain_name = self.node.try_get_context('domainName')

        subdomain = 'web.{}'.format(domain_name)

        zone = route53.HostedZone.from_lookup(
            self, 'Zone',
            domain_name=domain_name,
        )

        bucket = s3.Bucket(self, 'Storage')

        s3_deployment.BucketDeployment(
            self, 'Deployment',
            sources=[
                s3_deployment.Source.asset('./src/html'),
            ],
            destination_bucket=bucket,
        )

        origin_identity = cloudfront.OriginAccessIdentity(self, 'Identity')

        bucket.grant_read(origin_identity.grant_principal)

        certificate = acm.DnsValidatedCertificate(
            self, 'Certificate',
            domain_name=subdomain,
            hosted_zone=zone,
            region='us-east-1',
        )

        distribution = cloudfront.Distribution(
            self, 'CDN',
            default_root_object='index.html',
            domain_names=[subdomain],
            certificate=certificate,
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3Origin(
                    bucket=bucket,
                    origin_access_identity=origin_identity,
                ),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            )
        )

        target = route53.RecordTarget.from_alias(
            alias_target=targets.CloudFrontTarget(distribution)
        )

        route53.AaaaRecord(
            self, 'DnsRecordIpv6',
            record_name=subdomain,
            target=target,
            zone=zone,
        )

        route53.ARecord(
            self, 'DnsRecordIpv4',
            record_name=subdomain,
            target=target,
            zone=zone,
        )

        canary = synthetics.Canary(self, 'Canary',
            schedule=synthetics.Schedule.rate(Duration.minutes(1)),
            success_retention_period=Duration.days(1),
            failure_retention_period=Duration.days(7),
            test=synthetics.Test.custom(
                code=synthetics.Code.from_asset('./src/canary'),
                handler='index.handler'
            ),
            runtime=synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_5,
            environment_variables={
                'URL': 'https://{}'.format(subdomain)
            }
        )


app = App()
OptimizelyWebStack(app, 'OptimizelyWeb',
    env=Environment(
        account=os.getenv('CDK_DEFAULT_ACCOUNT'),
        region=os.getenv('CDK_DEFAULT_REGION')
    ),
)
app.synth()
