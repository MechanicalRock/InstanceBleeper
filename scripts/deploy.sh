#!/bin/bash

declare -a regions=('ap-southeast-1' 'ap-southeast-2' 'us-east-1' 'us-east-2' 'us-west-1' 'us-west-2' 'ap-northeast-2' 'ap-south-1' 'ap-northeast-1' 'ca-central-1' 'eu-central-1' 'eu-west-1' 'eu-west-2' 'sa-east-1')

# arguments
ACCOUNT_ID=$1
DESTINATION_EMAIL=$2
CAPABILITY_NAMED_IAM=$3

pip install awscli --upgrade --user

# package lambda function
npm install -g typescript
npm install --only=production
tsc src/*.ts
zip -r instancebleeper.zip src/*.js

# deploy everything
aws cloudformation create-stack --stack-name cf-stack-set-role \
	--capabilities $CAPABILITY_NAMED_IAM \
	--template-body file://templates/AWSCloudFormationStackSetAdministrationRole.yml

aws cloudformation create-stack --stack-name cf-stack-set-role-trust \
	--parameters ParameterKey=AdministratorAccountId,ParameterValue=$ACCOUNT_ID \
	--capabilities $CAPABILITY_NAMED_IAM \
	--template-body file://templates/AWSCloudFormationStackSetExecutionRole.yml

aws cloudformation create-stack-set --stack-set-name instance-bleeper \
	--capabilities $CAPABILITY_IAM --template-body file://templates/stack.yaml \
	--parameters ParameterKey=DestinationEmail,ParameterValue=$DESTINATION_EMAIL

aws cloudformation create-stack-instances --stack-set-name instance-bleeper --accounts $ACCOUNT_ID --regions ${regions[@]}