import { Place } from './Place';
import { Review } from './Review';
import { Event } from './Event';
import { Route } from './Route';

export interface Schedule {
  // previousScheduleId: string | null;
  conflict?: boolean; // optional property to indicate conflicts

  id: string;
  travelPlanId: string;
  name: string;
  place: Place | null;
  review: Review;
  isActuallyVisited: boolean;
  orderOfTravel: number;
  travelStartTimeEstimate: Date | [number, number, number, number, number];
  travelDepartTimeEstimate: Date | [number, number, number, number, number];
  inwardRoute: Route;
  outwardRoute: Route;
  events: Event[];
}
