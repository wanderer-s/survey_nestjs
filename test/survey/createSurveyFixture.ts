import { SurveyTemplateEntity } from '../../src/survey/entity/survey-template.entity';
import { QuestionEntity } from '../../src/survey/entity/question.entity';
import { ChoiceEntity } from '../../src/survey/entity/choice.entity';

export function createSurveyTemplate(
  title: string = 'title',
  description: string = 'description',
  userId: number = 1
) {
  return new SurveyTemplateEntity({
    title,
    description,
    userId
  });
}

export function createQuestion(title: string = 'title', sequence: number = 1) {
  const createParam = {
    surveyTemplateEntity: createSurveyTemplate(),
    title,
    sequence,
    userId: 1
  };
  return new QuestionEntity(createParam);
}

export function createChoice(
  name: string = 'title',
  sequence: number = 1,
  point: number = 5
) {
  const createParam = {
    name,
    sequence,
    point,
    userId: 1,
    questionEntity: createQuestion()
  };
  return new ChoiceEntity(createParam);
}
