import { QuestionEntity } from '../../src/survey/entity/question.entity';
import { createQuestion } from './createSurveyFixture';

describe('Question Entity Test', () => {
  let question: QuestionEntity;

  beforeEach(async () => {
    question = createQuestion();
  });

  describe('update sequence', () => {
    it('sequence 가 업데이트', () => {
      const updateSequence = 3;
      question.updateSequence(updateSequence, 1);

      expect(question.sequence).toBe(updateSequence);
    });
  });
});
