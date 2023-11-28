import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
export interface IPagniatedType<T> {
  totalCount: number;
  totalPage: number;
  items: T[];
}
export function Paginated<T>(classRef: Type<T>): Type<IPagniatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPagniatedType<T> {
    @Field(() => [classRef])
    items: T[];

    @Field(() => Int)
    totalCount: number;

    @Field(() => Int)
    totalPage: number;
  }

  return PaginatedType as Type<IPagniatedType<T>>;
}
