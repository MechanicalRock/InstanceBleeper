import * as fs from 'fs';
import * as dot from 'dot';
import { getAWSAccount, getEC2Instance } from './awsUtils';
import { EmailTemplate, LambdaEvent } from './types';

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