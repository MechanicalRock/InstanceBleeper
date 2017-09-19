
import { assert } from 'chai';
import * as templateBuilder from '../src/emailTemplateBuilder';
import { EmailTemplate, LambdaEvent } from '../src/types';
import sendEmail from '../src'

const mockData: LambdaEvent = {
    version: "0",
    id: "ba1abec3-7aa3-1d0c-10b0-904559bf1f78",
    'detail-type': "EC2 Instance State-change Notification",
    source: "aws.ec2",
    account: "some random value",
    time: "2017-09-12T03:23:18Z",
    region: "ap-southeast-2",
    resources: ["arn:aws:ec2:ap-southeast-2:587392453450:instance/i-02eb595d1ea548b31"],
    detail: {
        'instance-id': "i-02eb595d1ea548b31",
        state: "running"
    }
}

suite('Template Parser:', (): void => {

    const filename: string = '../templates/template.html';
    const html: string = templateBuilder.getFileContents(filename);
    const templateData: EmailTemplate = templateBuilder.buildTemplateObject(mockData);

    test('Get File Contents', (): void => {
        assert(html.length > 1, 'Template is not undefined');
        assert.typeOf(html, 'string', 'html is of type string');

    });

    test('Build Template Object', (): void => {
        assert(templateData.region === mockData.region);
        assert.typeOf(templateData.launchTime, 'string', 'Launch Time is now a string object');
        assert(templateData.instanceId === mockData.detail['instance-id']);
    });

    test('Get Html String', (): void => {
        const emailTemplate: string = templateBuilder.getHTMLString(html, templateData);

        assert.include(emailTemplate, templateData.instanceId);
        assert.include(emailTemplate, templateData.launchTime);
        assert.include(emailTemplate, templateData.region);
    });

    test('Send Email', (): void => {
        // check things are running
        // more of an integration test
        sendEmail(mockData, {}, ({}, {}) => {});
    });

});