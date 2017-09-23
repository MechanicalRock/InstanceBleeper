import * as fs from 'fs';
import * as dot from 'dot';
import { EmailTemplate, LambdaEvent } from './types';

const buildTemplateObject = (event: LambdaEvent): EmailTemplate => ({
    region: event.region,
    launchTime: new Date(event.time).toLocaleString(),
    instanceId: event.detail['instance-id']
})

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