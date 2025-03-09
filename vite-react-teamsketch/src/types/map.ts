interface ILocation {
  id: string;
  meetingPlace: string;
  address: string;
  lat: number;
  lng: number;
}

interface ILocationState {
  myLocation: ILocation;
  yourLocation: ILocation;
  endLocation: ILocation;
}

export type { ILocation, ILocationState };
