import { Column } from 'typeorm';

type CreateRepondent = {
  name: string;
  email?: string;
  mobile?: string;
};

export class RespondentEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  mobile?: string;

  constructor(param?: CreateRepondent) {
    if (param) {
      this.name = param.name;
      this.email = param.email;
      this.mobile = param.mobile;
    }
  }
}
