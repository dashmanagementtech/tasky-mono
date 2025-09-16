import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  AddProjectDocumentDto,
  UpdateProjectDto,
} from './dto/update-project.dto';
import { prisma } from 'config/prisma';
import { getUserFromRequest } from 'utils/helpers';
import { PaginationDto } from 'utils/pagination.dto';

@Injectable()
export class ProjectsService {
  async create(createProjectDto: CreateProjectDto, req: any) {
    try {
      const user = await getUserFromRequest(req);

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

  async fetchAllProjects(pagination: PaginationDto, req: any) {
    try {
      const user = await getUserFromRequest(req);
      let projects: unknown[] = [];
      let count = 0;
      if (user.role === 'ADMIN') {
        const [allProjects, allCount] = await prisma.$transaction([
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
              createdAt: 'desc',
            },
            skip: Number(pagination.page * pagination.size),
            take: Number(pagination.size),
          }),
          prisma.projects.count(),
        ]);

        projects = allProjects;
        count = allCount;
      } else {
        const [allProjects, allCount] = await prisma.$transaction([
          prisma.projects.findMany({
            where: {
              sprints: {
                some: {
                  tasks: {
                    some: {
                      uid: user.id,
                    },
                  },
                },
              },
            },
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
              createdAt: 'desc',
            },
            skip: Number(pagination.page * pagination.size),
            take: Number(pagination.size),
          }),
          prisma.projects.count({
            where: {
              sprints: {
                some: {
                  tasks: {
                    some: {
                      uid: user.id,
                    },
                  },
                },
              },
            },
          }),
        ]);

        projects = allProjects;
        count = allCount;
      }

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
          id,
        },
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
                },
              },
            },
          },
        },
      });

      return { project };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return `This action returns a #${id} project`;
  }

  async findProjectDocuments(id: string) {
    try {
      return await prisma.projects.findUnique({
        where: { id },
        select: {
          documents: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addProjectDocuments(id: string, doc: AddProjectDocumentDto) {
    try {
      const docs = await prisma.projects.findUnique({
        where: { id },
        select: { documents: true },
      });

      const documents = (docs?.documents as any[] | null) ?? [];

      await prisma.projects.update({
        where: { id },
        data: {
          documents: [...documents, { ...doc, uploaded: new Date() }],
        },
      });

      return { message: 'Document added to project' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async projectAnalytics(req: any) {
    try {
      const user = await getUserFromRequest(req);

      let total = 0;
      let active = 0;
      let completed = 0;

      if (user.role === 'ADMIN') {
        const [allTotal, allActive, allCompleted] = await Promise.all([
          prisma.tasks.count(),
          prisma.tasks.count({
            where: {
              status: 'IN_PROGRESS',
            },
          }),
          prisma.tasks.count({
            where: {
              status: 'DONE',
            },
          }),
        ]);

        total = allTotal;
        active = allActive;
        completed = allCompleted;
      } else {
        const [allTotal, allActive, allCompleted] = await Promise.all([
          prisma.tasks.count({
            where: {
              uid: user.id,
            },
          }),
          prisma.tasks.count({
            where: {
              uid: user.id,
              status: 'IN_PROGRESS',
            },
          }),
          prisma.tasks.count({
            where: {
              uid: user.id,
              status: 'DONE',
            },
          }),
        ]);

        total = allTotal;
        active = allActive;
        completed = allCompleted;
      }

      return {
        total,
        completed,
        active,
        productivity: Math.ceil((completed / total) * 100),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async upcomingTasks(req: any) {
    try {
      const user = await getUserFromRequest(req);
      let deadlines: unknown[] = [];

      if (user.role === 'ADMIN') {
        deadlines = await prisma.tasks.findMany({
          where: {
            dueDate: {
              gte: new Date(),
            },
            NOT: {
              status: 'DONE',
            },
          },
          include: {
            sprint: {
              include: {
                project: {
                  select: {
                    title: true,
                    id: true,
                  },
                },
              },
            },
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 3,
        });
      } else {
        deadlines = await prisma.tasks.findMany({
          where: {
            uid: user.id,
            dueDate: {
              gte: new Date(),
            },
            NOT: {
              status: 'DONE',
            },
          },
          include: {
            sprint: {
              include: {
                project: {
                  select: {
                    title: true,
                    id: true,
                  },
                },
              },
            },
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 3,
        });
      }

      return { deadlines };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserTasks(req: any) {
    try {
      const user = await getUserFromRequest(req);
      let tasks: unknown[] = [];

      if (user.role === 'ADMIN') {
        tasks = await prisma.tasks.findMany({
          include: {
            sprint: {
              include: {
                project: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        });
      } else {
        tasks = await prisma.tasks.findMany({
          where: {
            uid: user.id,
          },
          include: {
            sprint: {
              include: {
                project: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        });
      }

      return { tasks };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} project`;
  }
}
