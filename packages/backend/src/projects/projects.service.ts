import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { prisma } from 'config/prisma';
import { getUserFromRequest } from 'utils/helpers';
import { PaginationDto } from 'utils/pagination.dto';

@Injectable()
export class ProjectsService {
  async create(createProjectDto: CreateProjectDto, req: any) {
    const user = await getUserFromRequest(req);

    try {
      await prisma.projects.create({
        data: {
          uid: user.id,
          status: 'TO_DO',
          ...createProjectDto,
        },
      });

      return { message: 'project created' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchAllProjects(pagination: PaginationDto) {
    try {
      const [projects, count] = await prisma.$transaction([
        prisma.projects.findMany({
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
              }
            },
            users: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    img: true
                  }
                }
              }
            },
            createdBy: {
              select: {
                firstName: true,
                lastName: true,
                img: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc',
          },
          skip: Number(pagination.page * pagination.size),
          take: Number(pagination.size),
        }),
        prisma.projects.count(),
      ]);

      return { count, projects };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
