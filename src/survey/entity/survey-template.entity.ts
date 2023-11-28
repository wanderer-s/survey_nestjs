import { RootEntity } from '../../global/root.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { QuestionEntity } from './question.entity';

type CreateSurveyTemplateParam = {
  title: string;
  description: string;
  userId: number;
};

type UpdateSurveyTemplateParam = {
  title?: string;
  description?: string;
  userId: number;
};

@Entity('survey_template')
export class SurveyTemplateEntity extends RootEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(
    () => QuestionEntity,
    (questionEntity) => questionEntity.surveyTemplate
  )
  questions: Promise<QuestionEntity[]>;

  constructor(param?: CreateSurveyTemplateParam) {
    super();

    if (param) {
      this.title = param.title;
      this.description = param.description;
      this.createdBy = param.userId;
    }
  }

  update(param: UpdateSurveyTemplateParam) {
    const { title, description, userId } = param;

    if (title) {
      this.title = title;
    }

    if (description) {
      this.description = description;
    }

    this.updatedBy = userId;
  }
}
