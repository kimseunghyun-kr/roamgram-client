import {Schedule} from './Schedule'

export interface TravelPlan {
    id: string;
    name: string;
    travelStartDate: string;
    travelEndDate: string;
    isPublic: boolean;
    scheduleList: Schedule[];
}

export {}