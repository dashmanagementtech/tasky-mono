import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { prisma } from 'config/prisma';

@Injectable()
export class SprintsService {
  create(createSprintDto: CreateSprintDto) {
    return 'This action adds a new sprint';
  }

  findAll() {
    return `This action returns all sprints`;
  }

  async findOne(pid: string) {
    try {
      const sprints = await prisma.sprints.findMany({
        where: {
          pid,
        },
        include: {
          tasks: {
            include: {
              assignedTo: true,
            },
          },
        },
      });

      return { sprints };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  update(id: number, updateSprintDto: UpdateSprintDto) {
    return `This action updates a #${id} sprint`;
  }

  remove(id: number) {
    return `This action removes a #${id} sprint`;
  }
}
