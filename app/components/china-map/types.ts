export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  price: number;
  distance?: number;
  type: "car" | "ebike";
  available: number;
  total: number;
  status: "online" | "offline" | "busy";
}

export interface ChinaMapProps {
  stations?: ChargingStation[];
  onStationClick?: (station: ChargingStation) => void;
  className?: string;
}

export interface MapLevel {
  level: number; // 0: 全国, 1: 省, 2: 市, 3: 区
  name: string;
  adcode: string;
}

export interface GeoFeature {
  type: string;
  properties: {
    name: string;
    adcode: number;
    center: [number, number];
    [key: string]: unknown;
  };
  geometry: unknown;
}

export interface GeoJSON {
  type: string;
  features: GeoFeature[];
}
