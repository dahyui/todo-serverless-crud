import { Status } from './enums'

export interface TodoType {
  id: string;
  task: string;
  deadline: string;
  taskStatus: Status
}
