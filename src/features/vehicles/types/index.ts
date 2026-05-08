export interface Vehicle {
  id: string;
  make: string;
  model: string;
  vin: string;
  status: "ACTIVE" | "IN SERVICE" | "INACTIVE";
  img: string;
}

export interface RecommendedPart {
  id: string;
  name: string;
  description: string;
  price: string;
}
