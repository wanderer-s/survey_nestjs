import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class Pagination {
  @Field(() => Int, { defaultValue: 1 })
  page?: number;
  @Field(() => Int, { defaultValue: 10 })
  perPage?: number;
}
