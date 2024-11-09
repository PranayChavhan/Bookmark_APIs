/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError, } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  
  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);

    // save the new user in db
    try{
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });
    
        delete user.hash;
        // return the user
        return user;
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                throw new ForbiddenException('Credentials taken')
            }
        }
    }
  }

  async signin(dto: AuthDto) {

    // find the user by email

    const user = await this.prisma.user.findUnique({
        where: {
            email: dto.email,
        }
    })

    // If user does not exist throw exception
    if(!user){
        throw new ForbiddenException('Credentials incorrect');
    }

    // Compare password
    const pwMatches = await argon.verify(
        user.hash,
        dto.password,
    );

    // If password incorrect throws exception
    if(!pwMatches){
        throw new ForbiddenException('Credentials incorrect');
    }

    delete user.hash;
    return user;
  }
}
