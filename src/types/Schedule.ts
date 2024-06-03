import { Place } from './Place';
import { Review } from './Review';
import { Event } from './Event';
import { Route } from './Route';

export interface Schedule {

  // previousScheduleId: string | null;
  conflict?: boolean; // optional property to indicate conflicts

  id: string;
  travelPlanId: string;
  name: string
  place: Place | null;
  review: Review;
  isActuallyVisited: boolean;
  travelDate: Date;
  orderOfTravel: number;
  travelStartTimeEstimate: Date;
  travelDepartTimeEstimate: Date;
  inwardRoute: Route;
  outwardRoute: Route;
  events: Event[];
}

export {}