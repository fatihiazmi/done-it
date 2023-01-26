import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    // create temp array
    let tasks = this.getAllTasks();
    // status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    // search
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    // return final filter
    return tasks;
  }

  getTaskById(id: string): Task {
    // try to find a task by ID
    const findTask = this.tasks.find((task) => task.id === id);
    // if not found then 404
    if (!findTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    // else, return the task by ID
    return findTask;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    const findTask = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== findTask.id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
