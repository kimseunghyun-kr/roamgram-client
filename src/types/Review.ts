import { MediaFile } from './MediaFile';

export interface Review {
  id: string;
  scheduleId: string;
  fileList: MediaFile[];
  userDescription: string;
  rating: number;
}

export {}