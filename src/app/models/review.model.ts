export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  author?: any;
  place?: any;
  event?: any;
}

export interface ReviewCreateRequest {
  rating: number;
  comment: string;
}
