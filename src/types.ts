interface EventDetail {
    'instance-id': string,
    state: string
}

interface Destination {
    ToAddresses: Array<string>
}

interface Subject {
    Data: string
}

interface Html {
    Charset: string,
    Data: string
}

interface Body {
    Html: Html
}

interface Message {
    Subject: Subject,
    Body: Body
}

interface LambdaEvent {
    version: string,
    id: string,
    'detail-type': string,
    source: string,
    account: string,
    time: string,
    region: string,
    resources: Array<string>,
    detail: EventDetail
}

interface EmailTemplate {
    region: string,
    launchTime: string,
    instanceId: string
}

interface Email {
    Source: string,
    Destination: Destination,
    Message: Message
}

interface Response {
    statusCode: number,
    body: string
}

export {
    LambdaEvent,
    EmailTemplate,
    Email,
    Response
}