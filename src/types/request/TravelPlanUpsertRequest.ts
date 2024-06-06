import { TravelPlan } from '../TravelPlan';

export interface TravelPlanUpsertRequest {
    uuid: string;
    name: string;
    startDate: string;
    endDate: string;
}

export class TravelPlanUpsertRequestImpl implements TravelPlanUpsertRequest {
    constructor(
        public uuid: string,
        public name: string,
        public startDate: string,
        public endDate: string
    ) {}

    static fromTravelPlan(travelPlan: TravelPlan): TravelPlanUpsertRequest {
        return new TravelPlanUpsertRequestImpl(
            travelPlan.id,
            travelPlan.name,
            travelPlan.travelStartDate,
            travelPlan.travelEndDate
        );
    }
}
