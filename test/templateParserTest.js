'use strict';

var assert = require('chai').assert;
var templateBuilder = require('../src/emailTemplateBuilder');

var mockData = {
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

var filename = '../templates/template.html';

suite('Template Parser:', () => {

    var html = templateBuilder.getFileContents(filename);
    var templateData = templateBuilder.buildTemplateObject(mockData);

    test('Get File Contents', () => {
        assert(html.length > 1, 'Template is not undefined');
        assert.typeOf(html, 'string', 'html is of type string');
    }); 

    test('Build Template Object', () => {
        assert(templateData.region === mockData.region);
        assert.typeOf(templateData.launchTime, 'string', 'Launch Time is now a string object');
        assert(templateData.instanceId === mockData.detail['instance-id']);
    });

    test('Get Html String', () => {
        var htmlString = templateBuilder.getHTMLString(html, templateData);

        assert.include(htmlString, templateData.instanceId);
        assert.include(htmlString, templateData.launchTime);
        assert.include(htmlString, templateData.region);
    });

});