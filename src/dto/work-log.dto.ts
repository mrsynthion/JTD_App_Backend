export interface WorkLogDto {
  id: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface AddWorkLogDto {
  description?: string;
  startDate: Date;
  endDate: Date;
}

export interface EditWorkLogDto {
  description?: string;
  startDate: Date;
  endDate: Date;
}
