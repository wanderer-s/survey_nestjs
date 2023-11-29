import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ResponseService } from '../service/response.service';
import {
  CreateAnswerDto,
  CreateResponseDto,
  findAllResponseFilter,
  Response,
  ResponseList
} from '../dto/response.dto';
import { ResponseStatus } from '../model/response-status.enum';
import { Pagination } from '../../global/types';
import { plainToClass } from 'class-transformer';

@Resolver(() => Response)
export class ResponseResolver {
  constructor(private readonly responseService: ResponseService) {}

  @Query(() => Response)
  async response(@Args('id', { type: () => Int }) id: number) {
    return await this.responseService.findById(id);
  }

  @Query(() => ResponseList)
  async responseList(
    @Args('pagination') pagination: Pagination,
    @Args('filter', { nullable: true }) filter?: findAllResponseFilter
  ) {
    const { items, total } = await this.responseService.findAll(
      pagination,
      filter
    );

    return plainToClass(ResponseList, {
      totalCount: total,
      totalPage: Math.floor(total / pagination.perPage) + 1,
      items: items.map((item) => plainToClass(Response, item))
    });
  }

  @Mutation(() => Int)
  async createResponse(@Args() input: CreateResponseDto) {
    const { id } = await this.responseService.create(input);
    return id;
  }

  @Mutation(() => Response)
  async updateResponseStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status', { type: () => ResponseStatus }) status: ResponseStatus
  ) {
    return await this.responseService.updateStatus(id, status);
  }

  @Mutation(() => Boolean)
  async createAnswer(@Args() input: CreateAnswerDto) {
    await this.responseService.addAnswer(input);
    return true;
  }

  @Query(() => Int)
  async sumAnswerPoints(@Args('responseId', { type: () => Int }) id: number) {
    return await this.responseService.sumPoint(id);
  }
}
