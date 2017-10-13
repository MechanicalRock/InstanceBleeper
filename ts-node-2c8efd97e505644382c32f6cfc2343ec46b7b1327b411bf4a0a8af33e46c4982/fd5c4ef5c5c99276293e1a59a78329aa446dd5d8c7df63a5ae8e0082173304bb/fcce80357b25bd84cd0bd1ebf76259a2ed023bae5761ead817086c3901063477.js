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
const fs = require("fs");
const dot = require("dot");
const aws_sdk_1 = require("aws-sdk");
const getAWSAccount = (accountId) => __awaiter(this, void 0, void 0, function* () {
    const request = {
        AccountId: accountId
    };
    const response = yield new aws_sdk_1.Organizations({ region: 'us-east-1' }).describeAccount(request).promise();
    if (!response.Account) {
        throw new Error(`Failed to fetch data on account with id: ${accountId}`);
    }
    return response.Account;
});
const getEC2Instance = (instanceId) => __awaiter(this, void 0, void 0, function* () {
    const request = {
        InstanceIds: [instanceId]
    };
    const response = yield new aws_sdk_1.EC2().describeInstances(request).promise();
    if (!response.Reservations || !response.Reservations.length) {
        throw new Error(`No reservations for instances, failed to fetch ec2 instance with id ${instanceId}`);
    }
    const reservation = response.Reservations[0];
    if (!reservation.Instances || !reservation.Instances.length) {
        throw new Error(`No instances, failed to fetch ec2 instance with id ${instanceId}`);
    }
    return reservation.Instances[0];
});
const buildTemplateObject = (event) => __awaiter(this, void 0, void 0, function* () {
    const instanceId = event.detail['instance-id'];
    const account = yield getAWSAccount(event.account);
    const instance = yield getEC2Instance(instanceId);
    var tags = [];
    if (instance.Tags) {
        tags = instance.Tags.map(tag => ({ name: tag.Key, value: tag.Value }));
    }
    return {
        region: event.region,
        launchTime: new Date(event.time).toLocaleString(),
        instanceId,
        accountName: account.Name,
        tags
    };
});
exports.buildTemplateObject = buildTemplateObject;
const getFileContents = (file) => {
    const filename = `${__dirname}/${file}`;
    return fs.readFileSync(filename, 'utf8');
};
exports.getFileContents = getFileContents;
const getHTMLString = (html, templateData) => {
    const fn = dot.template(html);
    return fn(templateData);
};
exports.getHTMLString = getHTMLString;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2EzMTAxMTE2OS9naXQtcmVwb3NpdG9yaWVzL0luc3RhbmNlQmxlZXBlci9zcmMvZW1haWxUZW1wbGF0ZUJ1aWxkZXIudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hMzEwMTExNjkvZ2l0LXJlcG9zaXRvcmllcy9JbnN0YW5jZUJsZWVwZXIvc3JjL2VtYWlsVGVtcGxhdGVCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsMkJBQTJCO0FBQzNCLHFDQUE2QztBQUc3QyxNQUFNLGFBQWEsR0FBRyxDQUFNLFNBQWlCO0lBQ3pDLE1BQU0sT0FBTyxHQUF5QztRQUNsRCxTQUFTLEVBQUUsU0FBUztLQUN2QixDQUFBO0lBRUQsTUFBTSxRQUFRLEdBQTBDLE1BQU0sSUFBSSx1QkFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRTVJLEVBQUUsQ0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDNUIsQ0FBQyxDQUFBLENBQUE7QUFFRCxNQUFNLGNBQWMsR0FBRyxDQUFNLFVBQWtCO0lBQzNDLE1BQU0sT0FBTyxHQUFpQztRQUMxQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7S0FDNUIsQ0FBQTtJQUVELE1BQU0sUUFBUSxHQUFnQyxNQUFNLElBQUksYUFBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFbkcsRUFBRSxDQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsdUVBQXVFLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDekcsQ0FBQztJQUVELE1BQU0sV0FBVyxHQUFvQixRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlELEVBQUUsQ0FBQSxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRCxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDLENBQUEsQ0FBQTtBQUVELE1BQU0sbUJBQW1CLEdBQUcsQ0FBTSxLQUFrQjtJQUNoRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVsRCxJQUFJLElBQUksR0FBdUMsRUFBRSxDQUFDO0lBRWxELEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVELE1BQU0sQ0FBQztRQUNILE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtRQUNwQixVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRTtRQUNqRCxVQUFVO1FBQ1YsV0FBVyxFQUFVLE9BQU8sQ0FBQyxJQUFJO1FBQ2pDLElBQUk7S0FDUCxDQUFBO0FBQ0wsQ0FBQyxDQUFBLENBQUE7QUFjRyxrREFBbUI7QUFadkIsTUFBTSxlQUFlLEdBQUcsQ0FBQyxJQUFZO0lBQ2pDLE1BQU0sUUFBUSxHQUFXLEdBQUcsU0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ2hELE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUE7QUFRRywwQ0FBZTtBQU5uQixNQUFNLGFBQWEsR0FBRyxDQUFDLElBQVksRUFBRSxZQUEyQjtJQUM1RCxNQUFNLEVBQUUsR0FBUSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDNUIsQ0FBQyxDQUFBO0FBS0csc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBkb3QgZnJvbSAnZG90JztcbmltcG9ydCB7IE9yZ2FuaXphdGlvbnMsIEVDMiB9IGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0IHsgRW1haWxUZW1wbGF0ZSwgTGFtYmRhRXZlbnQgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgZ2V0QVdTQWNjb3VudCA9IGFzeW5jKGFjY291bnRJZDogc3RyaW5nKTogUHJvbWlzZTxPcmdhbml6YXRpb25zLkFjY291bnQ+ID0+IHtcbiAgICBjb25zdCByZXF1ZXN0OiBPcmdhbml6YXRpb25zLkRlc2NyaWJlQWNjb3VudFJlcXVlc3QgPSB7XG4gICAgICAgIEFjY291bnRJZDogYWNjb3VudElkXG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2U6IE9yZ2FuaXphdGlvbnMuRGVzY3JpYmVBY2NvdW50UmVzcG9uc2UgPSBhd2FpdCBuZXcgT3JnYW5pemF0aW9ucyh7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSkuZGVzY3JpYmVBY2NvdW50KHJlcXVlc3QpLnByb21pc2UoKTtcblxuICAgIGlmKCFyZXNwb25zZS5BY2NvdW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGZldGNoIGRhdGEgb24gYWNjb3VudCB3aXRoIGlkOiAke2FjY291bnRJZH1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuQWNjb3VudDtcbn1cblxuY29uc3QgZ2V0RUMySW5zdGFuY2UgPSBhc3luYyhpbnN0YW5jZUlkOiBzdHJpbmcpOiBQcm9taXNlPEVDMi5JbnN0YW5jZT4gPT4ge1xuICAgIGNvbnN0IHJlcXVlc3Q6IEVDMi5EZXNjcmliZUluc3RhbmNlc1JlcXVlc3QgPSB7XG4gICAgICAgIEluc3RhbmNlSWRzOiBbaW5zdGFuY2VJZF1cbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZTogRUMyLkRlc2NyaWJlSW5zdGFuY2VzUmVzdWx0ID0gYXdhaXQgbmV3IEVDMigpLmRlc2NyaWJlSW5zdGFuY2VzKHJlcXVlc3QpLnByb21pc2UoKTtcblxuICAgIGlmKCFyZXNwb25zZS5SZXNlcnZhdGlvbnMgfHwgIXJlc3BvbnNlLlJlc2VydmF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyByZXNlcnZhdGlvbnMgZm9yIGluc3RhbmNlcywgZmFpbGVkIHRvIGZldGNoIGVjMiBpbnN0YW5jZSB3aXRoIGlkICR7aW5zdGFuY2VJZH1gKTsgICAgXG4gICAgfSBcblxuICAgIGNvbnN0IHJlc2VydmF0aW9uOiBFQzIuUmVzZXJ2YXRpb24gPSByZXNwb25zZS5SZXNlcnZhdGlvbnNbMF07XG4gICAgXG4gICAgaWYoIXJlc2VydmF0aW9uLkluc3RhbmNlcyB8fCAhcmVzZXJ2YXRpb24uSW5zdGFuY2VzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGluc3RhbmNlcywgZmFpbGVkIHRvIGZldGNoIGVjMiBpbnN0YW5jZSB3aXRoIGlkICR7aW5zdGFuY2VJZH1gKTsgICBcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzZXJ2YXRpb24uSW5zdGFuY2VzWzBdO1xufVxuXG5jb25zdCBidWlsZFRlbXBsYXRlT2JqZWN0ID0gYXN5bmMoZXZlbnQ6IExhbWJkYUV2ZW50KTogUHJvbWlzZTxFbWFpbFRlbXBsYXRlPiA9PiB7XG4gICAgY29uc3QgaW5zdGFuY2VJZCA9IGV2ZW50LmRldGFpbFsnaW5zdGFuY2UtaWQnXTsgXG4gICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IGdldEFXU0FjY291bnQoZXZlbnQuYWNjb3VudCk7ICAgXG4gICAgY29uc3QgaW5zdGFuY2UgPSBhd2FpdCBnZXRFQzJJbnN0YW5jZShpbnN0YW5jZUlkKTtcblxuICAgIHZhciB0YWdzOiBBcnJheTx7bmFtZTpzdHJpbmcsIHZhbHVlOnN0cmluZ30+ID0gW107XG4gICAgXG4gICAgaWYoaW5zdGFuY2UuVGFncykge1xuICAgICAgICB0YWdzID0gaW5zdGFuY2UuVGFncy5tYXAodGFnID0+ICh7bmFtZTogPHN0cmluZz50YWcuS2V5LCB2YWx1ZTogPHN0cmluZz50YWcuVmFsdWV9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVnaW9uOiBldmVudC5yZWdpb24sXG4gICAgICAgIGxhdW5jaFRpbWU6IG5ldyBEYXRlKGV2ZW50LnRpbWUpLnRvTG9jYWxlU3RyaW5nKCksXG4gICAgICAgIGluc3RhbmNlSWQsXG4gICAgICAgIGFjY291bnROYW1lOiA8c3RyaW5nPmFjY291bnQuTmFtZSxcbiAgICAgICAgdGFnc1xuICAgIH0gICBcbn1cblxuY29uc3QgZ2V0RmlsZUNvbnRlbnRzID0gKGZpbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmlsZW5hbWU6IHN0cmluZyA9IGAke19fZGlybmFtZX0vJHtmaWxlfWA7XG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKTtcbn1cblxuY29uc3QgZ2V0SFRNTFN0cmluZyA9IChodG1sOiBzdHJpbmcsIHRlbXBsYXRlRGF0YTogRW1haWxUZW1wbGF0ZSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZm46IGFueSA9IGRvdC50ZW1wbGF0ZShodG1sKTtcbiAgICByZXR1cm4gZm4odGVtcGxhdGVEYXRhKTtcbn1cblxuZXhwb3J0IHtcbiAgICBnZXRGaWxlQ29udGVudHMsXG4gICAgYnVpbGRUZW1wbGF0ZU9iamVjdCxcbiAgICBnZXRIVE1MU3RyaW5nXG59Il19