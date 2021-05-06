import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { DynamoModel } from './DynamoModel';
export const LOOKUP_KEY = 'TENANT';
export const REFERENCE_KEY = 'TENANT:<TENANT_ID>';

export class TenantModel extends DynamoModel {
    @attribute()
    tenant_id: string;

    @attribute()
    username: string;

    @attribute()
    password: string;

    @attribute()
    tenant_key: string;

    @attribute()
    tenant_secret: string;

    @attribute()
    core_key: string;

    @attribute()
    core_secret: string;

    @attribute()
    email: string;

    @attribute()
    mobile: string;
}
