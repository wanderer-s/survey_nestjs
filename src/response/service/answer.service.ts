import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AnswerEntity } from '../entity/answer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseService } from './response.service';

type UpdateAnswerParam = {
  id: number;
  questionTitle?: string;
  choiceName?: string;
  choicePoint?: number;
};

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
  ) {}

  async findById(id: number) {
    const answer = await this.answerRepository.findOneBy({ id });
    if (!answer) {
      throw new NotFoundException();
    }
    return answer;
  }

  async update(param: UpdateAnswerParam) {
    const { id, ...rest } = param;
    const answer = await this.findById(id);
    answer.update(rest);
    await this.answerRepository.save(answer);
    return answer;
  }
}
