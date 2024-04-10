import { Cat } from "../../cats/entities/cat.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.favorites)
    // @JoinTable()
    user: User;

    @ManyToOne(() => Cat, cat => cat.favorites)
    // @JoinTable()
    cat: Cat;
}
