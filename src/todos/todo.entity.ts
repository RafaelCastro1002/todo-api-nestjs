import { User } from "src/users/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('todo')
export class Todo {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({ length: 500 })
    description: string;

    @Column({ type: "boolean", default: false })
    completed: boolean;

    @Column('datetime')
    dueDate: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdOn: string;

    @Column({ name: "updated_at", nullable: true, type: "datetime" })
    updatedAt: Date;

    @Column({ name: "finished_in", nullable: true, type: "datetime" })
    finishedIn: Date;

    @BeforeUpdate()
    public setUpdatedAt() {
        if(!this.completed) this.updatedAt = new Date();
        
        if(this.completed) this.finishedIn = new Date();
    }

    @ManyToOne(type => User) owner?: User;


}
