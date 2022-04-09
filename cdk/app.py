#!/usr/bin/env python3
import os
from constructs import Construct
from aws_cdk import (
    App,
    Environment,
    Stack,
    Duration,
    aws_cloudfront as cloudfront,
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
)

class OptimizelyWebStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

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

        origin = cloudfront.SourceConfiguration(
            s3_origin_source=cloudfront.S3OriginConfig(
                s3_bucket_source=bucket,
                origin_access_identity=origin_identity,
            ),
            behaviors=[
                cloudfront.Behavior(
                    default_ttl=Duration.days(0),
                    min_ttl=Duration.days(0),
                    max_ttl=Duration.days(0),
                    is_default_behavior=True,
                )
            ]
        )

        distribution = cloudfront.CloudFrontWebDistribution(
            self, 'CDN',
            price_class=cloudfront.PriceClass.PRICE_CLASS_ALL,
            origin_configs=[origin],
            # alias_configuration=cloudfront.AliasConfiguration(
            #     acm_cert_ref=certificate.certificate_arn,
            #     names=[subdomain],
            # )
        )


app = App()
OptimizelyWebStack(app, 'OptimizelyWeb',
    env=Environment(
        account=os.getenv('CDK_DEFAULT_ACCOUNT'),
        region=os.getenv('CDK_DEFAULT_REGION')
    ),
)
app.synth()
