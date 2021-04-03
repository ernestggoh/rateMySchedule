export interface SocialModel {
  id?: string;
  eventDate: number;
  eventDescription: string;
  eventImage: string;
  eventLocation: string;
  eventName: string;
  owner: string;
  interested?: {
    [key: string]: boolean;
  };
}
