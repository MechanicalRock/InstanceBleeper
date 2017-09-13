'use strict';
var expect = require('chai').expect;
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

describe("Template Parser:", () => {

    it('should open the html file', () => {
        var html = templateBuilder.getFileContents(filename)
        expect(html.length).to.be.above(1)
    });

    it("should replace the template variables with the json values", () => {
        var html = templateBuilder.getFileContents(filename)
        var templateData = templateBuilder.buildTemplateObject(mockData);
        var htmlString = templateBuilder.getHTMLString(html, templateData);

        expect(htmlString).to.contain(templateData.instanceId);
        expect(htmlString).to.contain(templateData.launchTime);
        expect(htmlString).to.contain(templateData.region);
    });


});