import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ResponseStatus } from '../model/response-status.enum';
import { AnswerEntity } from './answer.entity';
import { RespondentEntity } from './respondent.embedded.entity';

type CreateResponseParam = {
  surveyTitle: string;
  surveyDescription: string;
  respondentName: string;
  respondentEmail?: string;
  respondentMobile?: string;
};

type CreateAnswerParam = {
  questionTitle: string;
  choiceName: string;
  choicePoint: number;
};

@Entity('response')
export class ResponseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  surveyTitle: string;

  @Column()
  surveyDescription: string;

  @Column(() => RespondentEntity, { prefix: 'respondent' })
  respondent: RespondentEntity;

  @Column({
    type: 'enum',
    enum: ResponseStatus,
    default: ResponseStatus.PROGRESS
  })
  status: ResponseStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => AnswerEntity, (answerEntity) => answerEntity.response, {
    cascade: true
  })
  answers: Promise<AnswerEntity[]>;

  constructor(param?: CreateResponseParam) {
    super();

    if (param) {
      this.surveyTitle = param.surveyTitle;
      this.surveyDescription = param.surveyDescription;
      this.respondent = new RespondentEntity({
        name: param.respondentName,
        email: param.respondentEmail,
        mobile: param.respondentMobile
      });
    }
  }

  updateStatus(status: ResponseStatus) {
    this.status = status;
  }

  async sumChoicePoint() {
    const answers = await this.answers;
    return answers.reduce((pre, ele) => pre + ele.choicePoint, 0);
  }

  async addAnswer(param: CreateAnswerParam) {
    const currentAnswers = await this.answers;
    currentAnswers.push(new AnswerEntity({ response: this, ...param }));
  }
}
