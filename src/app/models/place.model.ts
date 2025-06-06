export interface PlaceDto {
  id?: string;
  name: string;
  description: string;
  address: string;
  category: string;
  photoUrls: string[];
  amenities: string[];
  averageRating?: number;
  reviewCount?: number;
  visitCount?: number;
  location: number[];
  createdAt?: string;
  updatedAt?: string;
}
