import { RootEntity } from '../../global/root.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { QuestionEntity } from './question.entity';

type CreateChoiceParam = {
  name: string;
  sequence: number;
  point: number;
  questionEntity: QuestionEntity;
  userId: number;
};

@Entity('choice')
export class ChoiceEntity extends RootEntity {
  @Column()
  name: string;

  @Column()
  sequence: number;

  @Column()
  point: number;

  @ManyToOne(() => QuestionEntity)
  question: QuestionEntity;

  constructor(param?: CreateChoiceParam) {
    super();
    if (param) {
      this.name = param.name;
      this.sequence = param.sequence;
      this.point = param.point;
      this.question = param.questionEntity;
      this.createdBy = param.userId;
    }
  }

  updateSequence(sequence: number, userId: number) {
    this.sequence = sequence;
    this.updatedBy = userId;
  }
}
