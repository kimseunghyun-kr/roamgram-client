import { Place } from "../Place";

export interface ScheduleInsertRequest {
    place: Place | null
    previousScheduleId : string
    isActuallyVisited : boolean
    travelDate : Date
    travelStartTimeEstimate : Date
    travelDepartTimeEstimate : Date
}

export {}