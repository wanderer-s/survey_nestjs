import { SurveyTemplateEntity } from '../../src/survey/entity/survey-template.entity';
import { createSurveyTemplate } from './survey.fixture';

describe('Survey Template Entity Test', () => {
  let surveyTemplate: SurveyTemplateEntity;

  beforeEach(async () => {
    surveyTemplate = createSurveyTemplate();
  });

  describe('update', () => {
    it('survey template 정보 update', () => {
      const updateParam = {
        title: 'update title',
        description: 'update description',
        userId: 1
      };
      surveyTemplate.update(updateParam);
      expect(surveyTemplate.title).toBe(updateParam.title);
      expect(surveyTemplate.description).toBe(updateParam.description);
    });
  });
});
