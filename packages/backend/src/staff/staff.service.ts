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
import { PaginationDto, SearchDto } from 'utils/pagination.dto';

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
      const [users, count] = await prisma.$transaction([
        prisma.users.findMany({
          select: {
            id: true,
            createdAt: true,
            email: true,
            firstName: true,
            lastName: true,
            img: true,
            role: true,
            passwordHash: true,
          },
          where: {
            role: {
              not: 'CLIENT',
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
          skip: Number(pagination.page * pagination.size),
          take: Number(pagination.size),
        }),
        prisma.users.count(),
      ]);

      const staff = users.map((user) => {
        return {
          ...user,
          isActive: !bcrypt.compareSync(user.email, user.passwordHash),
        };
      });

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
  }

  async searchStaffByQuery(query: SearchDto) {
    const page = parseInt(query.page, 10);
    const size = parseInt(query.size, 10);
    const skip = page * size;

    try {
      const [users, total] = await prisma.$transaction([
        prisma.users.findMany({
          where: {
            OR: [
              { firstName: { contains: query.query, mode: 'insensitive' } },
              { lastName: { contains: query.query, mode: 'insensitive' } },
              { username: { contains: query.query, mode: 'insensitive' } },
              { email: { contains: query.query, mode: 'insensitive' } },
              { id: { contains: query.query, mode: 'insensitive' } },
            ],
            role: {
              not: 'CLIENT',
            },
          },
          skip,
          take: size,
          select: {
            id: true,
            createdAt: true,
            email: true,
            firstName: true,
            lastName: true,
            img: true,
            role: true,
          },
        }),
        prisma.users.count({
          where: {
            OR: [
              { firstName: { contains: query.query, mode: 'insensitive' } },
              { lastName: { contains: query.query, mode: 'insensitive' } },
              { username: { contains: query.query, mode: 'insensitive' } },
              { email: { contains: query.query, mode: 'insensitive' } },
              { id: { contains: query.query, mode: 'insensitive' } },
            ],
          },
        }),
      ]);

      return {
        users,
        total,
        totalPages: Math.ceil(total / size),
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
