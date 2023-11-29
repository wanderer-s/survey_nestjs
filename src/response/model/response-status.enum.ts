import { registerEnumType } from '@nestjs/graphql';

export enum ResponseStatus {
  PROGRESS = 'PROGRESS',
  COMPLETE = 'COMPLETE'
};

registerEnumType(ResponseStatus, {
  name: 'ResponseStatus'
})