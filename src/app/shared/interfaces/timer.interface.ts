export interface TimerInterface {
    userId: string;
    name: string;
    description: string;
    endedMessage: string;
    location: string;
    startDate: firebase.firestore.Timestamp;
    endDate: firebase.firestore.Timestamp;
    endTime: firebase.firestore.Timestamp;
    units: string;    // Months | Days | Hours
    endAtZero: boolean;
    backGroundUrl: string;
}

export interface TimerInterfaceWithId extends TimerInterface {
    id: string;
}
