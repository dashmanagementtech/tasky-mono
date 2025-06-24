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
      const { id } = await prisma.projects.create({
        data: {
          uid: user.id,
          status: 'TO_DO',
          ...createProjectDto,
        },
        select: {
          id: true,
        },
      });

      return { message: 'project created', pid: id };
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
              },
            },
            users: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    img: true,
                  },
                },
              },
            },
            createdBy: {
              select: {
                firstName: true,
                lastName: true,
                img: true,
              },
            },
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

  async findOne(id: string) {
    try {
      const project = await prisma.projects.findUnique({
        where: {
          id
        },
        // orderBy: {},
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          users: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      })

      return { project }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
    return `This action returns a #${id} project`;
  }

  async addStaffToProject(id: string, updateProjectDto: UpdateProjectDto[]) {
    try {
      await prisma.projects_Users.createMany({
        data: updateProjectDto.map((item) => ({
          ...item,
          pid: id,
        })),
      });

      return { message: 'users added to project' };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} project`;
  }
}
