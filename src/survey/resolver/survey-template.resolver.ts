import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { SurveyTemplateService } from '../service/survey-template.service';
import {
  CreateSurveyTemplateDto,
  SurveyTemplate,
  SurveyTemplateList,
  UpdateSurveyTemplateDto
} from '../dto/survey-template.dto';
import { QuestionService } from '../service/question.service';
import { CurrentUserId } from '../../auth/auth.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Resolver(() => SurveyTemplate)
export class SurveyTemplateResolver {
  constructor(
    private readonly surveyTemplateService: SurveyTemplateService,
    private readonly questionService: QuestionService
  ) {}

  @Query(() => SurveyTemplate)
  async surveyTemplate(@Args('id', { type: () => Int }) id: number) {
    return await this.surveyTemplateService.findById(id);
  }

  @Query(() => SurveyTemplateList)
  async surveyTemplates(
    @Args('page', { type: () => Int, defaultValue: 1, nullable: true })
    page?: number,
    @Args('perPage', { type: () => Int, defaultValue: 10, nullable: true })
    perPage?: number,
    @Args('title', { nullable: true }) title?: string
  ) {
    const { items, total } = await this.surveyTemplateService.findAll({
      page,
      perPage,
      title
    });

    return plainToClass(SurveyTemplateList, {
      totalCount: total,
      totalPage: Math.floor(total / perPage) + 1,
      items: items.map((item) => plainToClass(SurveyTemplate, item))
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => SurveyTemplate)
  async createSurveyTemplate(
    @Args() input: CreateSurveyTemplateDto,
    @CurrentUserId() userId: number
  ) {
    return await this.surveyTemplateService.create({ ...input, userId });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => SurveyTemplate)
  async updateSurveyTemplate(
    @Args() input: UpdateSurveyTemplateDto,
    @CurrentUserId() userId: number
  ) {
    return await this.surveyTemplateService.update({ ...input, userId });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteSurveyTemplate(@Args('id') id: number) {
    try {
      await this.surveyTemplateService.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  @ResolveField()
  async questions(@Parent() surveyTemplate: SurveyTemplate) {
    const { id } = surveyTemplate;
    return await this.questionService.findBySurveyTemplateId(id);
  }
}
