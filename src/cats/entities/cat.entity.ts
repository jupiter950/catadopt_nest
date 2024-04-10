import { Favorite } from "../../favorites/entities/favorite.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cat {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    age: number

    @Column()
    breed: string

    @OneToMany(() => Favorite, (favorite) => favorite.cat)
    @JoinTable()
    favorites: Favorite[]
}