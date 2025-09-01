import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSprintDto, CreateSprintTaskDto, EndSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { prisma } from 'config/prisma';
import { getUserFromRequest } from 'utils/helpers';

@Injectable()
export class SprintsService {
  async create(createSprintDto: CreateSprintDto, req: any) {
    const user = await getUserFromRequest(req);

    try {
      await prisma.sprints.create({
        data: {
          ...createSprintDto,
          uid: user.id,
        },
      });

      return { message: 'sprint added' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all sprints`;
  }

  async findSprintsByProjectId(pid: string) {
    try {
      const sprints = await prisma.sprints.findMany({
        where: {
          pid,
        },
        include: {
          tasks: {
            include: {
              assignedTo: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  img: true,
                  role: true,
                },
              },
            },
            orderBy: {
              startDate: 'asc',
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
      });

      return { sprints };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findSprintById(id: string) {
    try {
      const sprint = await prisma.sprints.findUnique({
        where: {
          id,
        },
        include: {
          tasks: {
            where: {
              status: {
                in: ['IN_PROGRESS', 'TO_DO', 'AWAITING_FEEDBACK'],
              },
            },
            include: {
              assignedTo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              }
            },
          },
        },
      });

      return { sprint };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findTask(id: string) {
    try {
      const task = await prisma.tasks.findUnique({
        where: { id },
        include: {
          sprint: {
            include: {
              project: true,
            },
          },
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          watcher: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                  img: true,
                },
              },
            },
          },
        },
      });

      return { task };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateTask(id: string, data: { status: string }) {
    try {
      const task = await prisma.tasks.update({
        where: { id },
        data: {
          ...data,
        },
        include: {
          sprint: {
            include: {
              project: true,
            },
          },
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          watcher: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                  img: true,
                },
              },
            },
          },
        },
      });

      if (task.status !== 'TODO') {
        await prisma.projects.update({
          where: {
            id: task.sprint.pid,
          },
          data: {
            status: 'IN_PROGRESS',
          },
        });

        await prisma.sprints.update({
          where: {
            id: task.sprint.id,
          },
          data: {
            started: true,
          },
        });
      }

      return { task };
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

  async createSprintTask(sid: string, payload: CreateSprintTaskDto, req: any) {
    const user = await getUserFromRequest(req);

    try {
      const { id, sprint } = await prisma.tasks.create({
        data: {
          ...payload,
          createdBy: user.id,
          sid,
        },
        include: {
          sprint: {
            select: {
              pid: true,
            },
          },
        },
      });

      return {
        message: 'Task added to sprint',
        task: { id, sid, pid: sprint.pid },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async startSprint(sid: string) { }
  
  async endSprint(sid: string, payload: EndSprintDto) {
    try {
      const pid = await prisma.sprints.update({
        where: { id: sid },
        data: {
          started: false,
          note: payload.note
        },
        select: {pid: true }
      })

      if (payload.tasks.length !== 0) {
        await prisma.tasks.updateMany({
          where: {
            id: {
              in: payload.tasks,
            },
          },
          data: {
            sid: payload.sid
          },
        })
      }

      return { message: "Sprint ended", pid: pid.pid }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
