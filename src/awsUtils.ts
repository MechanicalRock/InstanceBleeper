import { EC2 } from 'aws-sdk';

const getEC2Instance = async(instanceId: string): Promise<EC2.Instance> => {
    const request: EC2.DescribeInstancesRequest = {
        InstanceIds: [instanceId]
    }

    const response: EC2.DescribeInstancesResult = await new EC2().describeInstances(request).promise();

    if(!response.Reservations || !response.Reservations.length) {
        throw new Error(`No reservations for instances, failed to fetch ec2 instance with id ${instanceId}`);
    }

    const reservation: EC2.Reservation = response.Reservations[0];

    if(!reservation.Instances || !reservation.Instances.length) {
        throw new Error(`No instances, failed to fetch ec2 instance with id ${instanceId}`);
    }

    return reservation.Instances[0];
}

export {
    getEC2Instance
}
