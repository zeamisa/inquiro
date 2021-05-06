import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { DynamoModel } from './DynamoModel';
import * as randomstring from 'randomstring';
import { Carbon } from '../libs/Carbon';
import { JWT } from '../libs/JWT';

export const LOOKUP_KEY = 'SESSION';
export const REFERENCE_KEY = 'TENANT:<TENANT_ID>:SESSION:<SESSION_ID>';

export interface Token {
    access_token: string;
    refresh_token: string;
    expiration: number;
}
export interface JWTContent {
    tenant_id: string;
}

export class SessionModel extends DynamoModel {
    @attribute()
    tenant_id: string;

    @attribute()
    token: string;

    @attribute()
    refresh_token: string;

    @attribute()
    valid_until: number;

    get session_id(): string {
        return this.id;
    }

    set session_id(uuid: string) {
        this.id = uuid;
        this.lookup_key = LOOKUP_KEY;
        this.reference_key = REFERENCE_KEY.replace('<TENANT_ID>', this.tenant_id).replace('<SESSION_ID>', uuid);
    }

    async generateToken(): Promise<Token> {
        this.refresh_token = randomstring.generate(88);
        this.token = randomstring.generate(18);
        this.valid_until = Carbon.now().add(1, 'month').unix();

        const expiration = Carbon.now().add(1, 'hour').unix();
        const access_token = await JWT.generateToken<JWTContent>({
            tenant_id: this.tenant_id,
        });

        return {
            access_token,
            refresh_token: this.refresh_token,
            expiration,
        };
    }
}
