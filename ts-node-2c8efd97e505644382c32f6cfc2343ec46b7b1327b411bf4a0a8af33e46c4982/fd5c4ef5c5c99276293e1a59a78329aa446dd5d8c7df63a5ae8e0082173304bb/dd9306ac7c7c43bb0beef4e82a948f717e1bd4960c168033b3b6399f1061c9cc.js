"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws = require("aws-sdk");
const templateBuilder = require("./emailTemplateBuilder");
const templateFilename = '../templates/template.html';
const html = templateBuilder.getFileContents(templateFilename);
exports.sendEmail = (event, context, callback) => __awaiter(this, void 0, void 0, function* () {
    const to = [process.env.DestinationEmail];
    const from = process.env.DestinationEmail;
    try {
        const templateData = yield templateBuilder.buildTemplateObject(event);
        const emailTemplate = templateBuilder.getHTMLString(html, templateData);
        const email = {
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
        };
        const ses = new aws.SES({
            apiVersion: '2010-12-01',
            region: 'us-east-1'
        });
        ses.sendEmail(email, (err, data) => {
            if (err)
                throw err;
            console.log('Email sent:');
            console.log(data);
        });
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Instance Bleeper executed successfully!',
                input: event,
            }),
        };
        callback(null, response);
    }
    catch (err) {
        callback(JSON.stringify(err));
    }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2EzMTAxMTE2OS9naXQtcmVwb3NpdG9yaWVzL0luc3RhbmNlQmxlZXBlci9zcmMvaW5kZXgudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hMzEwMTExNjkvZ2l0LXJlcG9zaXRvcmllcy9JbnN0YW5jZUJsZWVwZXIvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFDL0IsMERBQTBEO0FBRzFELE1BQU0sZ0JBQWdCLEdBQVcsNEJBQTRCLENBQUM7QUFDOUQsTUFBTSxJQUFJLEdBQVcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRTFELFFBQUEsU0FBUyxHQUFHLENBQU0sS0FBa0IsRUFBRSxPQUFZLEVBQUUsUUFBYTtJQUMxRSxNQUFNLEVBQUUsR0FBa0IsQ0FBUyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDakUsTUFBTSxJQUFJLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztJQUVsRCxJQUFJLENBQUM7UUFDRCxNQUFNLFlBQVksR0FBa0IsTUFBTSxlQUFlLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckYsTUFBTSxhQUFhLEdBQVcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFaEYsTUFBTSxLQUFLLEdBQVU7WUFDakIsTUFBTSxFQUFFLElBQUk7WUFDWixXQUFXLEVBQUU7Z0JBQ1QsV0FBVyxFQUFFLEVBQUU7YUFDbEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFO29CQUNMLElBQUksRUFBRSxpQ0FBaUM7aUJBQzFDO2dCQUNELElBQUksRUFBRTtvQkFDRixJQUFJLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLE9BQU87d0JBQ2hCLElBQUksRUFBRSxhQUFhO3FCQUN0QjtpQkFDSjthQUNKO1NBQ0osQ0FBQTtRQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQztZQUNwQixVQUFVLEVBQUUsWUFBWTtZQUN4QixNQUFNLEVBQUUsV0FBVztTQUN0QixDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxNQUFNLEdBQUcsQ0FBQTtZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBYTtZQUN2QixVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNqQixPQUFPLEVBQUUseUNBQXlDO2dCQUNsRCxLQUFLLEVBQUUsS0FBSzthQUNmLENBQUM7U0FDTCxDQUFDO1FBRUYsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUU3QixDQUFDO0lBQUEsS0FBSyxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNULFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztBQUNMLENBQUMsQ0FBQSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXdzIGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0ICogYXMgdGVtcGxhdGVCdWlsZGVyIGZyb20gJy4vZW1haWxUZW1wbGF0ZUJ1aWxkZXInO1xuaW1wb3J0IHsgTGFtYmRhRXZlbnQsIEVtYWlsVGVtcGxhdGUsIEVtYWlsLCBSZXNwb25zZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCB0ZW1wbGF0ZUZpbGVuYW1lOiBzdHJpbmcgPSAnLi4vdGVtcGxhdGVzL3RlbXBsYXRlLmh0bWwnO1xuY29uc3QgaHRtbDogc3RyaW5nID0gdGVtcGxhdGVCdWlsZGVyLmdldEZpbGVDb250ZW50cyh0ZW1wbGF0ZUZpbGVuYW1lKTtcblxuZXhwb3J0IGNvbnN0IHNlbmRFbWFpbCA9IGFzeW5jKGV2ZW50OiBMYW1iZGFFdmVudCwgY29udGV4dDogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgY29uc3QgdG86IEFycmF5PHN0cmluZz4gPSBbPHN0cmluZz5wcm9jZXNzLmVudi5EZXN0aW5hdGlvbkVtYWlsXTtcbiAgICBjb25zdCBmcm9tID0gPHN0cmluZz5wcm9jZXNzLmVudi5EZXN0aW5hdGlvbkVtYWlsO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGVEYXRhOiBFbWFpbFRlbXBsYXRlID0gYXdhaXQgdGVtcGxhdGVCdWlsZGVyLmJ1aWxkVGVtcGxhdGVPYmplY3QoZXZlbnQpO1xuICAgICAgICBjb25zdCBlbWFpbFRlbXBsYXRlOiBzdHJpbmcgPSB0ZW1wbGF0ZUJ1aWxkZXIuZ2V0SFRNTFN0cmluZyhodG1sLCB0ZW1wbGF0ZURhdGEpO1xuXG4gICAgICAgIGNvbnN0IGVtYWlsOiBFbWFpbCA9IHtcbiAgICAgICAgICAgIFNvdXJjZTogZnJvbSxcbiAgICAgICAgICAgIERlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgVG9BZGRyZXNzZXM6IHRvXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTWVzc2FnZToge1xuICAgICAgICAgICAgICAgIFN1YmplY3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgRGF0YTogJ0FsZXJ0IGZyb20gdGhlIEluc3RhbmNlIEJsZWVwZXInXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBCb2R5OiB7XG4gICAgICAgICAgICAgICAgICAgIEh0bWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENoYXJzZXQ6IFwiVVRGLThcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGE6IGVtYWlsVGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlcyA9IG5ldyBhd3MuU0VTKHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICcyMDEwLTEyLTAxJyxcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VzLnNlbmRFbWFpbChlbWFpbCwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRW1haWwgc2VudDonKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXNwb25zZTogUmVzcG9uc2UgPSB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ0luc3RhbmNlIEJsZWVwZXIgZXhlY3V0ZWQgc3VjY2Vzc2Z1bGx5IScsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IGV2ZW50LFxuICAgICAgICAgICAgfSksXG4gICAgICAgIH07XG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpO1xuICAgIFxuICAgIH1jYXRjaChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkoZXJyKSk7XG4gICAgfVxufVxuIl19