import * as aws from 'aws-sdk';
import * as templateBuilder from './emailTemplateBuilder';
import { LambdaEvent, EmailTemplate, Email, Response } from './types';

const templateFilename: string = '../templates/template.html';
const html: string = templateBuilder.getFileContents(templateFilename);

const sendEmail = (event: LambdaEvent, context: any, callback: any): any => {
    const to: Array<string> = [process.env.DestinationEmail];
    const from = process.env.DestinationEmail;
    const templateData: EmailTemplate = templateBuilder.buildTemplateObject(event);
    const emailTemplate: string = templateBuilder.getHTMLString(html, templateData);

    const email: Email = {
        Source: from,
        Destination: {
            ToAddresses: to
        },
        Message: {
            Subject: {
                Data: 'Alert from the Instance Bleeper'
            },
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailTemplate
                }
            }
        }
    }

    const ses = new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });

    ses.sendEmail(email, (err, data) => {
        if (err) throw err
        console.log('Email sent:');
        console.log(data);
    });

    const response: Response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Instance Bleeper executed successfully!',
            input: event,
        }),
    };

    callback(null, response);
}

export default sendEmail;
