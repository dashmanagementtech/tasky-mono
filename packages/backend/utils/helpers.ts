import { prisma } from 'config/prisma';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcryptjs';

export function validateEmail(email: string) {
  try {
    if (isEmpty(email)) {
      throw new Error('Please provide an email');
    }

    if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
        email,
      )
    ) {
      throw new Error('Please provide a valid Email');
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findUserByEmail(email: string) {
  validateEmail(email);

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      tasks: true,
      watching: true,
      projects: true,
      createdProjects: true,
    },
  });

  if (!user) throw { message: 'user not found' } as any;
  return user;
}

export async function findUserById(id: string) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
        watching: true,
        projects: true,
        createdProjects: true,
      },
    });

    if (!user) throw Error('user not found');
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

export function bcryptSalt() {
  return bcrypt.genSaltSync(10);
}
