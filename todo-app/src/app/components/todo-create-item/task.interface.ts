export interface Task {
  id: number;
  text: string;
  description: string;
  status?: boolean | null;
}
