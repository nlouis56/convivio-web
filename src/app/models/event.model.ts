export interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  maxParticipants: number;
  currentParticipants?: number;
  published: boolean;
  imageUrl?: string;
  place?: any;
  creator?: any;
  group?: any;
}

export interface EventCreateRequest {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  maxParticipants: number;
  published: boolean;
  imageUrl?: string;
}
