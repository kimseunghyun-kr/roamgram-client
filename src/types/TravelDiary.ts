import {Schedule} from './Schedule'

export interface TravelDiary {
    id: string;
    name: string;
    travelStartDate: string;
    travelEndDate: string;
    isPublic: boolean;
    scheduleList: Schedule[];
}

export {}