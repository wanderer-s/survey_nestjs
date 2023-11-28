import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChoiceEntity } from '../entity/choice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from '../entity/question.entity';

type CreateChoiceParam = {
  name: string;
  sequence: number;
  point: number;
  questionEntity: QuestionEntity;
  userId: number;
};

type updateSequenceParam = {
  id: number;
  sequence: number;
  userId: number;
};

@Injectable()
export class ChoiceService {
  constructor(
    @InjectRepository(ChoiceEntity)
    private readonly choiceRepository: Repository<ChoiceEntity>
  ) {}

  async create(param: CreateChoiceParam) {
    const choice = new ChoiceEntity(param);
    await this.choiceRepository.save(choice);
    return choice;
  }

  async findByQuestionId(questionId: number) {
    return await this.choiceRepository
      .createQueryBuilder('choice')
      .where('choice.question.id = :id', { id: questionId })
      .orderBy('choice.sequence', 'ASC')
      .getMany();
  }

  async findById(id: number) {
    const foundChoice = await this.choiceRepository.findOneBy({ id });
    if (!foundChoice) {
      throw new NotFoundException();
    }
    return foundChoice;
  }

  async updateSequence(param: updateSequenceParam) {
    const { id, sequence, userId } = param;
    const foundChoice = await this.findById(id);
    foundChoice.updateSequence(sequence, userId);
    await this.choiceRepository.save(foundChoice);
    return foundChoice;
  }
}
