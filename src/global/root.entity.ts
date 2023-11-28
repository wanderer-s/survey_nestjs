import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Field, Int, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class RootEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column()
  @Field(() => Int)
  createdBy: number;

  @UpdateDateColumn({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  updatedBy?: number;

  @DeleteDateColumn({ nullable: true })
  @Field({ nullable: true })
  deletedAt?: Date;
}
