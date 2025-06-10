export interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  maxParticipants: number;
  participants?: any[];
  participantCount?: number;
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

export interface EventUpdateRequest {
  id: string;
  title?: string;
  description?: string;
  place?: string;
  startDateTime?: string;
  endDateTime?: string;
  maxParticipants?: number;
  published?: boolean;
}
