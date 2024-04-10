import { 
    BeforeInsert,
    Column,
    Entity, 
    JoinTable, 
    ManyToMany, 
    OneToMany, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { UserRole } from "../dto/create-user.dto";
import { Cat } from "../../cats/entities/cat.entity";

import * as bcrypt from 'bcrypt';
import { Favorite } from "../../favorites/entities/favorite.entity";



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column()
    role: UserRole;

    @OneToMany(() => Favorite, (favorite) => favorite.user)
    @JoinTable()
    favorites: Favorite[]    
}
