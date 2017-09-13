var aws = require('aws-sdk');
var templateBuilder = require('./emailTemplateBuilder');

var templateFilename = '../templates/template.html';
var html = templateBuilder.getFileContents(templateFilename);

module.exports.sendEmail = (event, context, callback) => {
    var ses = new aws.SES({
        apiVersion: '2010-12-01',
        region: "us-east-1"
    });

    var to = [process.env.DestinationEmail]
    var from = process.env.DestinationEmail

    var templateData = templateBuilder.buildTemplateObject(event);
    var htmlString = templateBuilder.getHTMLString(html, templateData);

    ses.sendEmail({
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
                    Data: htmlString
                }
            }
        }
    }, function (err, data) {
        if (err) throw err
        console.log('Email sent:');
        console.log(data);
    });

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0! Your function executed successfully!',
            input: event,
        }),
    };
    callback(null, response);
};