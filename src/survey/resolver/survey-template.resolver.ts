import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SurveyTemplateService } from '../service/survey-template.service';
import {
  CreateSurveyTemplateDto, findAllSurveyTemplateFilter,
  SurveyTemplate,
  SurveyTemplateList,
  UpdateSurveyTemplateDto
} from '../dto/survey-template.dto';
import { CurrentUserId } from '../../auth/auth.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Pagination } from '../../global/types';

@Resolver(() => SurveyTemplate)
export class SurveyTemplateResolver {
  constructor(private readonly surveyTemplateService: SurveyTemplateService) {}

  @Query(() => SurveyTemplate)
  async surveyTemplate(@Args('id', { type: () => Int }) id: number) {
    return await this.surveyTemplateService.findById(id);
  }

  @Query(() => SurveyTemplateList)
  async surveyTemplates(
    @Args('pagination') pagination: Pagination,
    @Args('filter', { nullable: true }) filter?: findAllSurveyTemplateFilter
  ) {
    const { items, total } = await this.surveyTemplateService.findAll({
      page: pagination.page,
      perPage: pagination.perPage,
      title: filter.title
    });

    return plainToClass(SurveyTemplateList, {
      totalCount: total,
      totalPage: Math.floor(total / pagination.perPage) + 1,
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
}
