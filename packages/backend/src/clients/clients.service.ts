import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import * as bcrypt from 'bcryptjs';
import { prisma } from 'config/prisma';
import { bcryptSalt, isEmailTaken } from 'utils/helpers';

@Injectable()
export class ClientsService {
  async create(createClientDto: CreateClientDto) {
    try {
      if (await isEmailTaken(createClientDto.email)) {
        throw new ConflictException('user already exist');
      }

      await prisma.users.create({
        data: {
          ...createClientDto,
          passwordHash: bcrypt.hashSync(createClientDto.email, bcryptSalt()),
          username: createClientDto.email,
          role: 'CLIENT',
        },
      });

      return { message: 'Client created' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return 'This action adds a new client';
  }

  async searchClientByString({ query }: any) {
    try {
      const clients = await prisma.users.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
            { id: { contains: query, mode: 'insensitive' } },
          ],
          role: 'CLIENT',
        },
      });

      return { clients };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
