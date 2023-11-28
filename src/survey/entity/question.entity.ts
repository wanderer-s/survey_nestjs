import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { RootEntity } from '../../global/root.entity';
import { SurveyTemplateEntity } from './survey-template.entity';
import { ChoiceEntity } from './choice.entity';

type CreateQuestion = {
  surveyTemplateEntity: SurveyTemplateEntity;
  title: string;
  sequence: number;
  userId: number;
};

@Entity('question')
export class QuestionEntity extends RootEntity {
  @Column()
  title: string;

  @Column()
  sequence: number;

  @ManyToOne(() => SurveyTemplateEntity)
  surveyTemplate: SurveyTemplateEntity;

  @OneToMany(() => ChoiceEntity, (choiceEntity) => choiceEntity.question)
  choices: Promise<ChoiceEntity[]>;

  constructor(param?: CreateQuestion) {
    super();

    if (param) {
      this.title = param.title;
      this.sequence = param.sequence;
      this.surveyTemplate = param.surveyTemplateEntity;
      this.createdBy = param.userId;
    }
  }

  updateSequence(sequence: number, userId: number) {
    this.sequence = sequence;
    this.updatedBy = userId;
  }
}
