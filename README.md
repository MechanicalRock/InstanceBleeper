# InstanceBleeper
Clouformation stack that creates a CloudWatch event and attach it to Lambda to notify user when an EC2 instance is created

The template uses [stack set](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html) to ensure that you can deploy the lambda in all regions

CloudFormation needs some very specific permissions to get a StackSet up and running. First, we need to create an IAM role called AWSCloudFormationStackSetAdministrationRole in what is called the “administrator account”. This is the account from which we create the StackSet and from where we’ll deploy the stacks in other accounts and regions. Next, we have the AWSCloudFormationStackSetExecutionRole IAM role. This role must exist in all accounts where we’re going to provision stacks. The first role will assume the latter role.


## To create a role that can create stack set 

```
aws cloudformation create-stack --stack-name cf-stack-set-role \
	--capabilities CAPABILITY_NAMED_IAM \
	--template-body file://AWSCloudFormationStackSetAdministrationRole.yml

aws cloudformation create-stack --stack-name cf-stack-set-role-trust \
	--parameters ParameterKey=AdministratorAccountId,ParameterValue=YOUR_ACCOUNT_ID \
	--capabilities CAPABILITY_NAMED_IAM \
	--template-body file://AWSCloudFormationStackSetExecutionRole.yml
```

## To create the stack set
```
aws cloudformation create-stack-set --stack-set-name instance-bleeper \
	--capabilities CAPABILITY_IAM --template-body file://stack.yaml \
	--parameters ParameterKey=DestinationEmail,ParameterValue=YOUR_DESTINATION_EMAIL
```

## To actually deploy your stack across regions
```
aws cloudformation create-stack-instances --stack-set-name instance-bleeper --accounts YOUR_ACCOUNT_ID --regions "ap-southeast-1" "ap-southeast-2"
```
