export interface Route {
    id: string;
    outBoundScheduleId: string;
    inBoundScheduleId: string;
    durationOfTravel: number; // durationOfTravel is in minutes
    distanceOfTravel: number; // BigDecimal can be represented as number in TypeScript
    methodOfTravel: string;
    googleEncodedPolyline: string;
  }
  export {}
  