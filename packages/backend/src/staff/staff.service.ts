import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

import { prisma } from 'config/prisma';
import * as bcrypt from 'bcryptjs';

import { bcryptSalt } from 'utils/helpers';

@Injectable()
export class StaffService {
  async create(data: CreateStaffDto) {
    const payload = {
      ...data,
      passwordHash: bcrypt.hashSync(data.email, bcryptSalt()),
      username: '',
    };

    try {
      await prisma.users.create({
        data: payload,
      });

      return { message: 'user invite sent' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all staff`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
