#!/bin/bash

REGIONS="us-east-1 ap-southeast-1 ap-southeast-2"

# arguments
ACCOUNT_ID=$1
ACCOUNT_ALIAS=$2
DESTINATION_EMAIL=$3
STACK_OWNER=$4

# package lambda function
rm -rf node_modules && rm -rf instance-bleeper-*.zip
npm i --only=production
tsc

# Create Zip file
ZIP_FILE="instance-bleeper-$(date +%s).zip"
zip -r -q ${ZIP_FILE} dist node_modules templates/template.html

BUCKET_NAME="instance-bleeper-$ACCOUNT_ALIAS"

# Create Region buckets for each zip
for REGION in ${REGIONS[@]}
do
    aws s3 mb s3://$BUCKET_NAME-$REGION --region $REGION
    aws s3 cp ./$ZIP_FILE s3://$BUCKET_NAME-$REGION/$ZIP_FILE
done

STACK=$(aws cloudformation describe-stack-set --stack-set-name instance-bleeper --query "StackSet.StackSetName" 2>/dev/null)
if [ -z "$STACK" ]
then
    aws cloudformation create-stack-set --stack-set-name instance-bleeper \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://templates/event_handler_stackset.yml \
    --parameters \
        ParameterKey=DestinationEmail,ParameterValue=$DESTINATION_EMAIL \
        ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
        ParameterKey=BucketKey,ParameterValue=$ZIP_FILE \
        ParameterKey=AccountAlias,ParameterValue=$ACCOUNT_ALIAS \
    --tags Key=Owner,Value="${STACK_OWNER}"

    aws cloudformation create-stack-instances --stack-set-name instance-bleeper \
    --regions $REGIONS \
    --accounts $ACCOUNT_ID
else
    aws cloudformation update-stack-set --stack-set-name instance-bleeper \
    --capabilities CAPABILITY_NAMED_IAM \
    --template-body file://templates/event_handler_stackset.yml \
    --parameters \
        ParameterKey=DestinationEmail,ParameterValue=$DESTINATION_EMAIL \
        ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
        ParameterKey=BucketKey,ParameterValue=$ZIP_FILE \
        ParameterKey=AccountAlias,ParameterValue=$ACCOUNT_ALIAS \
    --tags Key=Owner,Value="${STACK_OWNER}"

aws cloudformation update-stack-instances --stack-set-name instance-bleeper \
--regions $REGIONS \
--accounts $ACCOUNT_ID
fi
