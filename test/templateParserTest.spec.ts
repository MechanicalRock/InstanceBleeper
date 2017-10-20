
import { assert } from 'chai';
import * as AWS from 'aws-sdk-mock';
import * as templateBuilder from '../src/emailTemplateBuilder';
import { EmailTemplate, LambdaEvent } from '../src/types';
import { sendEmail } from '../src'

const mockEventData: LambdaEvent = {
    version: "0",
    id: "ba1abec3-7aa3-1d0c-10b0-8",
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

const mockOrgData = {
    Account: {
        Name: 'Blackrock Enterprise',
        Email: 'blackrock.enterprise@fakemail.io'
    }
}

const mockEC2Data = {
    Reservations: [{
        Instances: [
            {
                InstanceId: 'ix-1005',
                Tags: [{
                    Key: 'Contact',
                    Value: 'john_doe@hotmail.com'
                }, {
                    Key: 'Stack',
                    Value: 'Dev'
                }]
            }
        ]
    }]
}

suite('Template Parser:', () => {
    const filename: string = '../templates/template.html';
    const html: string = templateBuilder.getFileContents(filename);
    var templateData: EmailTemplate;

    setup(async() => {
        AWS.mock('Organizations', 'describeAccount', (params, callback)  => {
            callback(null, mockOrgData);
        });

        AWS.mock('EC2', 'describeInstances', (params, callback) => {
            callback(null, mockEC2Data);
        });

        templateData = await templateBuilder.buildTemplateObject(mockEventData);
    });

    teardown(() => {
        AWS.restore('Organizations', 'describeAccount');
        AWS.restore('EC2', 'describeInstances');
    });

    test('Get File Contents', (): void => {
        assert(html.length > 1, 'Template is not undefined');
        assert.typeOf(html, 'string', 'html is of type string');
    });

    test('Build Template Object', (): void => {
        assert(templateData.region === mockEventData.region);
        assert(templateData.launchTime, mockEventData.time);
        assert(templateData.instanceId === mockEventData.detail['instance-id']);
        assert(templateData.accountName === mockOrgData.Account.Name);
        
        assert.deepEqual(templateData.tags, mockEC2Data.Reservations[0].Instances[0].Tags.map(tag => ({
            name: tag.Key,
            value: tag.Value
        })));
    });

    test('Get Html String', (): void => {
        const emailTemplate: string = templateBuilder.getHTMLString(html, templateData);

        assert.include(emailTemplate, templateData.instanceId);
        assert.include(emailTemplate, templateData.launchTime);
        assert.include(emailTemplate, templateData.region);
        assert.include(emailTemplate, templateData.accountName);

        mockEC2Data.Reservations[0].Instances[0].Tags.forEach(tag => {
            assert.include(emailTemplate, tag.Key);
            assert.include(emailTemplate, tag.Value)
        });
    });

    test('Send Email', (): void => {
        // check things are running
        // more of an integration test
        sendEmail(mockEventData, {}, ({}, {}) => {});
    });
});