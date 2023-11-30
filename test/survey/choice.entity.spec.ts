import { ChoiceEntity } from '../../src/survey/entity/choice.entity';
import { createChoice } from './survey.fixture';

describe('Choice Entity Test', () => {
  let choice: ChoiceEntity;

  beforeEach(async () => {
    choice = createChoice();
  });

  describe('update sequence', () => {
    it('sequence 가 업데이트', () => {
      const updateSequence = 3;
      choice.updateSequence(updateSequence, 1);

      expect(choice.sequence).toBe(updateSequence);
    });
  });
});
