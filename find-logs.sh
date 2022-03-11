#!/usr/bin/env bash

FUNCTION_NAME=ctv-proxy-server
for region in $(aws --output text  ec2 describe-regions | cut -f 4) 
do
    for loggroup in $(aws --output text  logs describe-log-groups --log-group-name "/aws/lambda/us-east-1.$FUNCTION_NAME" --region $region --query 'logGroups[].logGroupName')
    do
        echo $region $loggroup
    done
done
