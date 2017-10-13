import * as fs from 'fs';
import * as dot from 'dot';
import { Organizations, EC2 } from 'aws-sdk';
import { EmailTemplate, LambdaEvent } from './types';

const getAWSAccount = async(accountId: string): Promise<Organizations.Account> => {
    const request: Organizations.DescribeAccountRequest = {
        AccountId: accountId
    }

    const response: Organizations.DescribeAccountResponse = await new Organizations({ region: 'us-east-1' }).describeAccount(request).promise();

    if(!response.Account) {
        throw new Error(`Failed to fetch data on account with id: ${accountId}`);
    }

    return response.Account;
}

const getEC2Instance = async(instanceId: string): Promise<EC2.Instance> => {
    const request: EC2.DescribeInstancesRequest = {
        InstanceIds: [instanceId]
    }
    
    const response: EC2.DescribeInstancesResult = await new EC2().describeInstances(request).promise();

    if(!response.Reservations || !response.Reservations.length) {
        throw new Error(`No reservations for instances, failed to fetch ec2 instance with id ${instanceId}`);    
    } 

    const reservation: EC2.Reservation = response.Reservations[0];
    
    if(!reservation.Instances || !reservation.Instances.length) {
        throw new Error(`No instances, failed to fetch ec2 instance with id ${instanceId}`);   
    }

    return reservation.Instances[0];
}

const buildTemplateObject = async(event: LambdaEvent): Promise<EmailTemplate> => {
    const instanceId = event.detail['instance-id']; 
    const instance = await getEC2Instance(instanceId);
    const account = await getAWSAccount(event.account); 

    var tags: Array<{name:string, value:string}> = [];
    
    if(instance.Tags) {
        tags = instance.Tags.map(tag => ({name: <string>tag.Key, value: <string>tag.Value}));
    }

    return {
        region: event.region,
        launchTime: new Date(event.time).toLocaleString(),
        instanceId,
        accountName: <string>account.Name,
        tags
    }   
}

const getFileContents = (file: string): string => {
    const filename: string = `${__dirname}/${file}`;
    return fs.readFileSync(filename, 'utf8');
}

const getHTMLString = (html: string, templateData: EmailTemplate): string => {
    const fn: any = dot.template(html);
    return fn(templateData);
}

export {
    getFileContents,
    buildTemplateObject,
    getHTMLString
}