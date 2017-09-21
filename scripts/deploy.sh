#!/bin/bash

declare -a regions=('ap-southeast-1' 'ap-southeast-2' 'us-east-1' 'us-east-2' 'us-west-1' 'us-west-2' 'ap-northeast-2' 'ap-south-1' 'ap-northeast-1' 'ca-central-1' 'eu-central-1' 'eu-west-1' 'eu-west-2' 'sa-east-1')

# arguments
ACCOUNT_ID=$1
DESTINATION_EMAIL=$2
STACK_OWNER=$3

pip install awscli --upgrade --user

package lambda function
sudo npm i -g typescript
rm -rf node_modules
npm i --only=production
tsc
zip -r instancebleeper.zip dist node_modules templates/template.html

# value of stack will be empty string if this command fails
for region in ${regions[@]}
do
	stack=$(aws cloudformation describe-stacks --stack-name cf-instance-bleeper --region "$region" --query 'Stacks[0]')
	bucket_name="instance-bleeper-$region"

	if [ -z "$stack" ]; then
		aws cloudformation create-stack --stack-name cf-instance-bleeper \
		--capabilities CAPABILITY_NAMED_IAM \
		--template-body file://templates/s3_bucket.yml \
		--parameters ParameterKey=BucketName,ParameterValue=$bucket_name \
		--region $region \
		--tags Key=Owner,Value="${STACK_OWNER}" \

		aws cloudformation wait stack-create-complete --stack-name cf-instance-bleeper --region $region
	fi

	aws s3 cp ./instancebleeper.zip s3://${bucket_name}/instancebleeper.zip

	aws cloudformation update-stack --stack-name cf-instance-bleeper \
	--capabilities CAPABILITY_NAMED_IAM \
	--template-body file://templates/event_handler.yml \
	--parameters \
		ParameterKey=DestinationEmail,ParameterValue=$DESTINATION_EMAIL \
		ParameterKey=BucketName,ParameterValue=$bucket_name \
	--region $region \
	--tags Key=Owner,Value="${STACK_OWNER}"
done