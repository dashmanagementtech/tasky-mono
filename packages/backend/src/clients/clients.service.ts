import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { prisma } from 'config/prisma';
import { getUserFromRequest } from 'utils/helpers';
import { PaginationDto } from 'utils/pagination.dto';

@Injectable()
export class ClientsService {
  async create(createClientDto: CreateClientDto, req: any) {
    try {
      const { id: uid } = await getUserFromRequest(req);

      await prisma.clients.create({
        data: {
          ...createClientDto,
          uid,
        },
      });

      return { message: 'Client created' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchClientByString({ query }: any) {
    try {
      const clients = await prisma.clients.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { phoneNumber: { contains: query, mode: 'insensitive' } },
            { id: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          projects: true,
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
              img: true,
            },
          },
        },
      });

      return { clients };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const [clients, count] = await prisma.$transaction([
        prisma.clients.findMany({
          include: {
            projects: true,
            createdBy: {
              select: {
                firstName: true,
                lastName: true,
                img: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: Number(pagination.page * pagination.size),
          take: Number(pagination.size),
        }),
        prisma.projects.count(),
      ]);

      return { count, clients };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return `This action returns all clients`;
  }

  async findOne(id: string) {
    try {
      const client = await prisma.clients.findUnique({
        where: {
          id
        },
        include: {
          projects: true,
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
              img: true,
            },
          },
        },
      })

      return { client }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
