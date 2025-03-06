interface ILocation {
  id: string;
  name: string;
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
