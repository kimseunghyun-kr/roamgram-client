export interface Route {
    id: string;
    outBoundScheduleId: string;
    inBoundScheduleId: string;
    durationOfTravel: string; // Using string to represent LocalTime, which can be parsed as needed
    distanceOfTravel: number; // BigDecimal can be represented as number in TypeScript
    methodOfTravel: string;
    googleEncodedPolyline: string;
  }
  export {}
  