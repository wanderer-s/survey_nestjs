import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver
} from '@nestjs/graphql';
import {
  CreateQuestionDto,
  Question,
  UpdateSequenceDto
} from '../dto/question.dto';
import { SurveyTemplateService } from '../service/survey-template.service';
import { QuestionService } from '../service/question.service';
import { CurrentUserId } from '../../auth/auth.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => Question)
export class QuestionResolver {
  constructor(
    private readonly surveyTemplateService: SurveyTemplateService,
    private readonly questionService: QuestionService,
  ) {}

  @Query(() => Question)
  async question(@Args('id', { type: () => Int }) id: number) {
    return await this.questionService.findById(id);
  }

  @Mutation(() => Question)
  async createQuestion(
    @Args() input: CreateQuestionDto,
    @CurrentUserId() userId: number
  ) {
    const surveyTemplateEntity = await this.surveyTemplateService.findById(
      input.surveyTemplateId
    );
    return await this.questionService.create({
      surveyTemplateEntity,
      userId,
      ...input
    });
  }

  @Mutation(() => Question)
  async updateQuestionSequence(
    @Args() input: UpdateSequenceDto,
    @CurrentUserId() userId: number
  ) {
    return await this.questionService.updateSequence({ userId, ...input });
  }
}
