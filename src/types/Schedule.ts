import { Place } from './Place';
import { Review } from './Review';
import { Event } from './Event';
import { Route } from './Route';

export interface Schedule {
  id: string;
  travelPlanId: string;
  place: Place;
  review: Review;
  isActuallyVisited: boolean;
  travelDate: string;
  orderOfTravel: number;
  travelStartTimeEstimate: string;
  travelDepartTimeEstimate: string;
  inwardRoute: Route;
  outwardRoute: Route;
  events: Event[];
}

export {}