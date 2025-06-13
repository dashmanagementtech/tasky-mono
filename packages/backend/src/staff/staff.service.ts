import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

import { prisma } from 'config/prisma';
import * as bcrypt from 'bcryptjs';

import { bcryptSalt, isEmailTaken, findUserById } from 'utils/helpers';
import { PaginationDto } from 'utils/pagination.dto';

@Injectable()
export class StaffService {
  async create(data: CreateStaffDto) {
    const payload = {
      ...data,
      passwordHash: bcrypt.hashSync(data.email, bcryptSalt()),
      username: '',
    };

    try {
      if (await isEmailTaken(data.email))
        throw new ConflictException('user already exist');

      await prisma.users.create({
        data: payload,
      });

      return { message: 'user invite sent' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchAllStaff(pagination: PaginationDto) {
    try {
      const [staff, count] = await prisma.$transaction([
        prisma.users.findMany({
          select: {
            id: true,
            createdAt: true,
            email: true,
            firstName: true,
            lastName: true,
            img: true,
            role: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
          skip: Number(pagination.page * pagination.size),
          take: Number(pagination.size),
        }),
        prisma.users.count(),
      ]);

      return { count, staff };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async fetchStaffById(id: string) {
    try {
      const staff = await findUserById(id);

      const { passwordHash: _ph, ...user } = staff;

      return { staff: user };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
