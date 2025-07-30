import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ApplicantEntity } from "./applicant.entity";

@Entity()
export class UserApplicantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: string;

  @Column({ type: "tinyint", unsigned: true, nullable: true })
  ranking!: number | null;     

  @Column()
  comment: string;

  @Column()
  selected: boolean;

  @ManyToOne(() => UserEntity, (lecturer) => lecturer.userApplicants)
  lecturer: UserEntity;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.userapplicants)
  applicant: ApplicantEntity;
}
