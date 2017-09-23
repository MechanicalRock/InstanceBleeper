# InstanceBleeper
Clouformation stack that creates a CloudWatch event and attach it to Lambda to notify user when an EC2 instance is created

The template uses [stack set](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html) to ensure that you can deploy the lambda in all regions

CloudFormation needs some very specific permissions to get a StackSet up and running. First, we need to create an IAM role called AWSCloudFormationStackSetAdministrationRole in what is called the “administrator account”. This is the account from which we create the StackSet and from where we’ll deploy the stacks in other accounts and regions. Next, we have the AWSCloudFormationStackSetExecutionRole IAM role. This role must exist in all accounts where we’re going to provision stacks. The first role will assume the latter role.

# To Deploy

```bash
./scripts/deploy.sh ${ACCOUNT_ID} ${DESTINATION_EMAIL} ${CAPABILITY_NAMED_IAM}
```