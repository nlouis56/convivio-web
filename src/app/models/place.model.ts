export interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  category: string;
  longitude: number;
  latitude: number;
  phoneNumber?: string;
  website?: string;
  imageUrl?: string;
  averageRating?: number;
  visitCount?: number;
}

export interface PlaceCreateRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  category: string;
  longitude: number;
  latitude: number;
  phoneNumber?: string;
  website?: string;
  imageUrl?: string;
}
