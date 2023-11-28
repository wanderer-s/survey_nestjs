import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChoiceService } from '../service/choice.service';
import { QuestionService } from '../service/question.service';
import { Choice, CreateChoiceDto } from '../dto/choice.dto';
import { CurrentUserId } from '../../auth/auth.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

@Resolver()
export class ChoiceResolver {
  constructor(
    private readonly choiceService: ChoiceService,
    private readonly questionService: QuestionService
  ) {}

  @Query(() => Choice)
  async choice(@Args('id', { type: () => Int }) id: number) {
    return await this.choiceService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Choice)
  async updateChoiceSequence(
    @Args('id', { type: () => Int }) id: number,
    @Args('sequence', { type: () => Int }) sequence: number,
    @CurrentUserId() userId: number
  ) {
    return this.choiceService.updateSequence({
      id,
      sequence,
      userId
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Choice)
  async createChoice(
    @Args() input: CreateChoiceDto,
    @CurrentUserId() userId: number
  ) {
    const { questionId, ...rest } = input;
    const questionEntity = await this.questionService.findById(questionId);
    return this.choiceService.create({ ...rest, userId, questionEntity });
  }
}
