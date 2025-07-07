import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CreateSprintDto, CreateSprintTaskDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  create(@Body() createSprintDto: CreateSprintDto, @Request() req: any) {
    return this.sprintsService.create(createSprintDto, req);
  }

  @Get()
  findAll() {
    return this.sprintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sprintsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    return this.sprintsService.update(+id, updateSprintDto);
  }

  @Post(':id/sprint')
  createSprintTask(
    @Body() createSprintDto: CreateSprintTaskDto,
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.sprintsService.createSprintTask(id, createSprintDto, req);
  }

  @Get('/task/:id')
  findTask(@Param('id') id: string) {
    return this.sprintsService.findTask(id);
  }

  @Patch('/task/:id/status')
  updateTaskStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.sprintsService.updateTask(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sprintsService.remove(+id);
  }
}
