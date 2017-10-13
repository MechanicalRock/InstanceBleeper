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
const chai_1 = require("chai");
const AWS = require("aws-sdk-mock");
const templateBuilder = require("../src/emailTemplateBuilder");
const src_1 = require("../src");
const mockEventData = {
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
};
const mockOrgData = {
    Account: {
        Name: 'Blackrock Enterprise'
    }
};
const mockEC2Data = {
    Reservations: [{
            Instances: [
                {
                    InstanceId: 'lx-0009',
                    Tags: [{
                            Key: 'Contact',
                            Value: 'john_doe@hotmail.com'
                        }]
                }
            ]
        }]
};
describe('Template Parser:', () => __awaiter(this, void 0, void 0, function* () {
    beforeEach(() => {
        AWS.mock('Organizations', 'describeAccount', (params, callback) => {
            callback(null, mockOrgData);
        });
        AWS.mock('EC2', 'describeInstances', (params, callback) => {
            callback(null, mockEC2Data);
        });
    });
    afterEach(() => {
        AWS.restore('Organizations', 'describeAccount');
        AWS.restore('EC2', 'describeInstances');
    });
    const filename = '../templates/template.html';
    const html = templateBuilder.getFileContents(filename);
    const templateData = yield templateBuilder.buildTemplateObject(mockEventData);
    it('Get File Contents', () => {
        chai_1.assert(html.length > 1, 'Template is not undefined');
        chai_1.assert.typeOf(html, 'string', 'html is of type string');
    });
    it('Build Template Object', () => {
        chai_1.assert(templateData.region === mockEventData.region);
        chai_1.assert.typeOf(templateData.launchTime, 'string', 'Launch Time is now a string object');
        chai_1.assert(templateData.instanceId === mockEventData.detail['instance-id']);
        chai_1.assert(templateData.accountName === mockOrgData.Account.Name);
    });
    it('Get Html String', () => {
        const emailTemplate = templateBuilder.getHTMLString(html, templateData);
        chai_1.assert.include(emailTemplate, templateData.instanceId);
        chai_1.assert.include(emailTemplate, templateData.launchTime);
        chai_1.assert.include(emailTemplate, templateData.region);
        chai_1.assert.include(emailTemplate, templateData.accountName);
    });
    it('Send Email', () => {
        src_1.sendEmail(mockEventData, {}, ({}, {}) => { });
    });
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2EzMTAxMTE2OS9naXQtcmVwb3NpdG9yaWVzL0luc3RhbmNlQmxlZXBlci90ZXN0L3RlbXBsYXRlUGFyc2VyVGVzdC5zcGVjLnRzIiwic291cmNlcyI6WyIvVXNlcnMvYTMxMDExMTY5L2dpdC1yZXBvc2l0b3JpZXMvSW5zdGFuY2VCbGVlcGVyL3Rlc3QvdGVtcGxhdGVQYXJzZXJUZXN0LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLCtCQUE4QjtBQUM5QixvQ0FBb0M7QUFDcEMsK0RBQStEO0FBRS9ELGdDQUFrQztBQUVsQyxNQUFNLGFBQWEsR0FBZ0I7SUFDL0IsT0FBTyxFQUFFLEdBQUc7SUFDWixFQUFFLEVBQUUsMkJBQTJCO0lBQy9CLGFBQWEsRUFBRSx3Q0FBd0M7SUFDdkQsTUFBTSxFQUFFLFNBQVM7SUFDakIsT0FBTyxFQUFFLG1CQUFtQjtJQUM1QixJQUFJLEVBQUUsc0JBQXNCO0lBQzVCLE1BQU0sRUFBRSxnQkFBZ0I7SUFDeEIsU0FBUyxFQUFFLENBQUMsc0VBQXNFLENBQUM7SUFDbkYsTUFBTSxFQUFFO1FBQ0osYUFBYSxFQUFFLHFCQUFxQjtRQUNwQyxLQUFLLEVBQUUsU0FBUztLQUNuQjtDQUNKLENBQUE7QUFFRCxNQUFNLFdBQVcsR0FBRztJQUNoQixPQUFPLEVBQUU7UUFDTCxJQUFJLEVBQUUsc0JBQXNCO0tBQy9CO0NBQ0osQ0FBQTtBQUVELE1BQU0sV0FBVyxHQUFHO0lBQ2hCLFlBQVksRUFBRSxDQUFDO1lBQ1gsU0FBUyxFQUFFO2dCQUNQO29CQUNJLFVBQVUsRUFBRSxTQUFTO29CQUNyQixJQUFJLEVBQUUsQ0FBQzs0QkFDSCxHQUFHLEVBQUUsU0FBUzs0QkFDZCxLQUFLLEVBQUUsc0JBQXNCO3lCQUNoQyxDQUFDO2lCQUNMO2FBQ0o7U0FDSixDQUFDO0NBQ0wsQ0FBQTtBQUVELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUN6QixVQUFVLENBQUM7UUFDUCxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRO1lBQzFELFFBQVEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRO1lBQ2xELFFBQVEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQztRQUNOLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDaEQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sUUFBUSxHQUFXLDRCQUE0QixDQUFDO0lBQ3RELE1BQU0sSUFBSSxHQUFXLGVBQWUsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0QsTUFBTSxZQUFZLEdBQWtCLE1BQU0sZUFBZSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRTdGLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtRQUNwQixhQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztRQUNyRCxhQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1QkFBdUIsRUFBRTtRQUN4QixhQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsYUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ3ZGLGFBQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxLQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUN4RSxhQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlCQUFpQixFQUFFO1FBQ2xCLE1BQU0sYUFBYSxHQUFXLGVBQWUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRWhGLGFBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2RCxhQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkQsYUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELGFBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxZQUFZLEVBQUU7UUFHYixlQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU0sQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrLW1vY2snO1xuaW1wb3J0ICogYXMgdGVtcGxhdGVCdWlsZGVyIGZyb20gJy4uL3NyYy9lbWFpbFRlbXBsYXRlQnVpbGRlcic7XG5pbXBvcnQgeyBFbWFpbFRlbXBsYXRlLCBMYW1iZGFFdmVudCB9IGZyb20gJy4uL3NyYy90eXBlcyc7XG5pbXBvcnQgeyBzZW5kRW1haWwgfSBmcm9tICcuLi9zcmMnXG5cbmNvbnN0IG1vY2tFdmVudERhdGE6IExhbWJkYUV2ZW50ID0ge1xuICAgIHZlcnNpb246IFwiMFwiLFxuICAgIGlkOiBcImJhMWFiZWMzLTdhYTMtMWQwYy0xMGIwLThcIixcbiAgICAnZGV0YWlsLXR5cGUnOiBcIkVDMiBJbnN0YW5jZSBTdGF0ZS1jaGFuZ2UgTm90aWZpY2F0aW9uXCIsXG4gICAgc291cmNlOiBcImF3cy5lYzJcIixcbiAgICBhY2NvdW50OiBcInNvbWUgcmFuZG9tIHZhbHVlXCIsXG4gICAgdGltZTogXCIyMDE3LTA5LTEyVDAzOjIzOjE4WlwiLFxuICAgIHJlZ2lvbjogXCJhcC1zb3V0aGVhc3QtMlwiLFxuICAgIHJlc291cmNlczogW1wiYXJuOmF3czplYzI6YXAtc291dGhlYXN0LTI6NTg3MzkyNDUzNDUwOmluc3RhbmNlL2ktMDJlYjU5NWQxZWE1NDhiMzFcIl0sXG4gICAgZGV0YWlsOiB7XG4gICAgICAgICdpbnN0YW5jZS1pZCc6IFwiaS0wMmViNTk1ZDFlYTU0OGIzMVwiLFxuICAgICAgICBzdGF0ZTogXCJydW5uaW5nXCJcbiAgICB9XG59XG5cbmNvbnN0IG1vY2tPcmdEYXRhID0ge1xuICAgIEFjY291bnQ6IHtcbiAgICAgICAgTmFtZTogJ0JsYWNrcm9jayBFbnRlcnByaXNlJ1xuICAgIH1cbn1cblxuY29uc3QgbW9ja0VDMkRhdGEgPSB7XG4gICAgUmVzZXJ2YXRpb25zOiBbe1xuICAgICAgICBJbnN0YW5jZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBJbnN0YW5jZUlkOiAnbHgtMDAwOScsXG4gICAgICAgICAgICAgICAgVGFnczogW3tcbiAgICAgICAgICAgICAgICAgICAgS2V5OiAnQ29udGFjdCcsXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlOiAnam9obl9kb2VAaG90bWFpbC5jb20nXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1dXG59XG5cbmRlc2NyaWJlKCdUZW1wbGF0ZSBQYXJzZXI6JywgYXN5bmMoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIEFXUy5tb2NrKCdPcmdhbml6YXRpb25zJywgJ2Rlc2NyaWJlQWNjb3VudCcsIChwYXJhbXMsIGNhbGxiYWNrKSAgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbW9ja09yZ0RhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBBV1MubW9jaygnRUMyJywgJ2Rlc2NyaWJlSW5zdGFuY2VzJywgKHBhcmFtcywgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG1vY2tFQzJEYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgICBBV1MucmVzdG9yZSgnT3JnYW5pemF0aW9ucycsICdkZXNjcmliZUFjY291bnQnKTtcbiAgICAgICAgQVdTLnJlc3RvcmUoJ0VDMicsICdkZXNjcmliZUluc3RhbmNlcycpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmlsZW5hbWU6IHN0cmluZyA9ICcuLi90ZW1wbGF0ZXMvdGVtcGxhdGUuaHRtbCc7XG4gICAgY29uc3QgaHRtbDogc3RyaW5nID0gdGVtcGxhdGVCdWlsZGVyLmdldEZpbGVDb250ZW50cyhmaWxlbmFtZSk7XG4gICAgY29uc3QgdGVtcGxhdGVEYXRhOiBFbWFpbFRlbXBsYXRlID0gYXdhaXQgdGVtcGxhdGVCdWlsZGVyLmJ1aWxkVGVtcGxhdGVPYmplY3QobW9ja0V2ZW50RGF0YSk7XG5cbiAgICBpdCgnR2V0IEZpbGUgQ29udGVudHMnLCAoKTogdm9pZCA9PiB7XG4gICAgICAgIGFzc2VydChodG1sLmxlbmd0aCA+IDEsICdUZW1wbGF0ZSBpcyBub3QgdW5kZWZpbmVkJyk7XG4gICAgICAgIGFzc2VydC50eXBlT2YoaHRtbCwgJ3N0cmluZycsICdodG1sIGlzIG9mIHR5cGUgc3RyaW5nJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnQnVpbGQgVGVtcGxhdGUgT2JqZWN0JywgKCk6IHZvaWQgPT4ge1xuICAgICAgICBhc3NlcnQodGVtcGxhdGVEYXRhLnJlZ2lvbiA9PT0gbW9ja0V2ZW50RGF0YS5yZWdpb24pO1xuICAgICAgICBhc3NlcnQudHlwZU9mKHRlbXBsYXRlRGF0YS5sYXVuY2hUaW1lLCAnc3RyaW5nJywgJ0xhdW5jaCBUaW1lIGlzIG5vdyBhIHN0cmluZyBvYmplY3QnKTtcbiAgICAgICAgYXNzZXJ0KHRlbXBsYXRlRGF0YS5pbnN0YW5jZUlkID09PSBtb2NrRXZlbnREYXRhLmRldGFpbFsnaW5zdGFuY2UtaWQnXSk7XG4gICAgICAgIGFzc2VydCh0ZW1wbGF0ZURhdGEuYWNjb3VudE5hbWUgPT09IG1vY2tPcmdEYXRhLkFjY291bnQuTmFtZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnR2V0IEh0bWwgU3RyaW5nJywgKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBlbWFpbFRlbXBsYXRlOiBzdHJpbmcgPSB0ZW1wbGF0ZUJ1aWxkZXIuZ2V0SFRNTFN0cmluZyhodG1sLCB0ZW1wbGF0ZURhdGEpO1xuXG4gICAgICAgIGFzc2VydC5pbmNsdWRlKGVtYWlsVGVtcGxhdGUsIHRlbXBsYXRlRGF0YS5pbnN0YW5jZUlkKTtcbiAgICAgICAgYXNzZXJ0LmluY2x1ZGUoZW1haWxUZW1wbGF0ZSwgdGVtcGxhdGVEYXRhLmxhdW5jaFRpbWUpO1xuICAgICAgICBhc3NlcnQuaW5jbHVkZShlbWFpbFRlbXBsYXRlLCB0ZW1wbGF0ZURhdGEucmVnaW9uKTtcbiAgICAgICAgYXNzZXJ0LmluY2x1ZGUoZW1haWxUZW1wbGF0ZSwgdGVtcGxhdGVEYXRhLmFjY291bnROYW1lKTtcbiAgICB9KTtcblxuICAgIGl0KCdTZW5kIEVtYWlsJywgKCk6IHZvaWQgPT4ge1xuICAgICAgICAvLyBjaGVjayB0aGluZ3MgYXJlIHJ1bm5pbmdcbiAgICAgICAgLy8gbW9yZSBvZiBhbiBpbnRlZ3JhdGlvbiB0ZXN0XG4gICAgICAgIHNlbmRFbWFpbChtb2NrRXZlbnREYXRhLCB7fSwgKHt9LCB7fSkgPT4ge30pO1xuICAgIH0pO1xufSk7Il19