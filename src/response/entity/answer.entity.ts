import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ResponseEntity } from './response.entity';
import { ResponseStatus } from '../model/response-status.enum';
import { BadRequestException } from '@nestjs/common';

type CreateAnswerParam = {
  questionTitle: string;
  choiceName: string;
  choicePoint: number;
  response: ResponseEntity;
};

type UpdateAnswerParam = {
  questionTitle?: string;
  choiceName?: string;
  choicePoint?: number;
};

@Entity('answer')
export class AnswerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionTitle: string;

  @Column()
  choiceName: string;

  @Column()
  choicePoint: number;

  @ManyToOne(() => ResponseEntity)
  response: ResponseEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  constructor(param?: CreateAnswerParam) {
    super();
    if (param) {
      this.questionTitle = param.questionTitle;
      this.choiceName = param.choiceName;
      this.choicePoint = param.choicePoint;
      this.response = param.response;
    }
  }

  update(param: UpdateAnswerParam) {
    if (this.response.status === ResponseStatus.COMPLETE) {
      throw new BadRequestException('완료된 응답은 수정할 수 없습니다');
    }

    const { questionTitle, choiceName, choicePoint } = param;
    if (questionTitle) {
      this.questionTitle = questionTitle;
    }
    if (choiceName) {
      this.choiceName = choiceName;
    }
    if (choicePoint) {
      this.choicePoint = choicePoint;
    }
  }
}
