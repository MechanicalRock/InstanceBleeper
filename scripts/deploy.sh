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
zip -r ${ZIP_FILE} dist node_modules templates/template.html

# value of stack will be empty string if this command fails
for REGION in ${REGIONS[@]}
do
	STACK=$(aws cloudformation describe-stacks --stack-name cf-instance-bleeper --region "$REGION" --query 'Stacks[0]')
	BUCKET_NAME="instance-bleeper-$ACCOUNT_ALIAS-$REGION"

	if [ -z "$STACK" ]; then
		aws cloudformation create-stack --stack-name cf-instance-bleeper \
		--capabilities CAPABILITY_NAMED_IAM \
		--template-body file://templates/s3_bucket.yml \
		--parameters \
			ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
		--region $REGION \
		--tags Key=Owner,Value="${STACK_OWNER}" \

		aws cloudformation wait stack-create-complete --stack-name cf-instance-bleeper --region $REGION
	fi

	aws s3 cp ./${ZIP_FILE} s3://${BUCKET_NAME}/${ZIP_FILE}

	aws cloudformation update-stack --stack-name cf-instance-bleeper \
	--capabilities CAPABILITY_NAMED_IAM \
	--template-body file://templates/event_handler.yml \
	--parameters \
		ParameterKey=DestinationEmail,ParameterValue=$DESTINATION_EMAIL \
		ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
		ParameterKey=BucketKey,ParameterValue=$ZIP_FILE \
        ParameterKey=AccountAlias,ParameterValue=$ACCOUNT_ALIAS \
	--region $REGION \
	--tags Key=Owner,Value="${STACK_OWNER}"
done
