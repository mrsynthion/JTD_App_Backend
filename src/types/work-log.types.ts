export interface AddWorkLogType {
  description?: string;
  startDate: Date;
  endDate: Date;
  task: {
    id: string;
  };
}
