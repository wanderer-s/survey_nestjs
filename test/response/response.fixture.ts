import { ResponseEntity } from '../../src/response/entity/response.entity';
import { AnswerEntity } from '../../src/response/entity/answer.entity';

export function createResponse(
  surveyTitle: string = 'title',
  surveyDescription: string = 'description',
  respondentName: string = 'respondentName',
  respondentEmail: string = 'respondentName',
  respondentMobile: string = 'respondentMobile'
) {
  return new ResponseEntity({
    surveyTitle,
    surveyDescription,
    respondentName,
    respondentEmail,
    respondentMobile
  });
}

export function createAnswer(
  response: ResponseEntity = createResponse(),
  questionTitle: string = 'questionTitle',
  choiceName: string = 'choiceName',
  choicePoint: number = 5
) {
  return new AnswerEntity({
    response,
    questionTitle,
    choiceName,
    choicePoint
  });
}
