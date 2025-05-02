
/**
 * Utility functions for interacting with Cal.com API v2
 */

export interface CalEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  organizer: {
    name: string;
    email: string;
    timeZone?: string;
  };
  attendees: {
    name: string;
    email: string;
    timeZone?: string;
  }[];
}

export interface CalAvailability {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
  }[];
}

export interface CalUser {
  id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  avatar?: string;
  eventTypes?: {
    id: string;
    title: string;
    description?: string;
    length: number;
  }[];
}

// Cal.com API endpoints
const CAL_API_BASE_URL = "https://api.cal.com/v2";

/**
 * Get available time slots for a specific user/event
 */
export const getCalAvailability = async (
  calUserId: string,
  eventTypeId: string,
  dateFrom: string,
  dateTo: string
): Promise<CalAvailability[]> => {
  try {
    // In a real implementation, you would fetch from the Cal.com API
    // This is a mock implementation for demonstration
    console.log(`Fetching availability for user ${calUserId}, event ${eventTypeId} from ${dateFrom} to ${dateTo}`);
    
    // Mock response with today and tomorrow's dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      {
        date: today.toISOString().split('T')[0],
        slots: [
          { startTime: "09:00", endTime: "10:00" },
          { startTime: "10:00", endTime: "11:00" },
          { startTime: "14:00", endTime: "15:00" }
        ]
      },
      {
        date: tomorrow.toISOString().split('T')[0],
        slots: [
          { startTime: "11:00", endTime: "12:00" },
          { startTime: "15:00", endTime: "16:00" },
          { startTime: "16:00", endTime: "17:00" }
        ]
      }
    ];
  } catch (error) {
    console.error("Error fetching Cal.com availability:", error);
    throw new Error("Failed to fetch availability");
  }
};

/**
 * Book a session through Cal.com
 */
export const createCalBooking = async (
  calUserId: string,
  eventTypeId: string,
  startTime: string,
  endTime: string,
  name: string,
  email: string,
  notes?: string
): Promise<CalEvent> => {
  try {
    // In a real implementation, you would post to the Cal.com API
    // This is a mock implementation for demonstration
    console.log(`Creating booking for user ${calUserId}, event ${eventTypeId}`);
    console.log(`Time: ${startTime} to ${endTime}`);
    console.log(`Attendee: ${name} (${email})`);
    if (notes) console.log(`Notes: ${notes}`);
    
    // Return a mock response
    return {
      id: `booking-${Date.now()}`,
      title: "Therapy Session",
      description: notes || "",
      startTime,
      endTime,
      organizer: {
        name: "Therapist Name", // This would come from Cal.com
        email: "therapist@example.com",
      },
      attendees: [
        {
          name,
          email,
        },
      ],
    };
  } catch (error) {
    console.error("Error creating Cal.com booking:", error);
    throw new Error("Failed to create booking");
  }
};

/**
 * Get Cal.com user details including their available event types
 */
export const getCalUser = async (username: string): Promise<CalUser> => {
  try {
    // In a real implementation, you would fetch from the Cal.com API
    // This is a mock implementation for demonstration
    console.log(`Fetching Cal.com user: ${username}`);
    
    return {
      id: `user-${Date.now()}`,
      name: "Dr. Sarah Johnson",
      email: "sarah@example.com",
      username: username,
      bio: "Specializing in anxiety and depression treatment with 8+ years of experience",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
      eventTypes: [
        {
          id: "1",
          title: "Initial Consultation",
          description: "60 minute initial consultation",
          length: 60
        },
        {
          id: "2",
          title: "Follow-up Session",
          description: "45 minute follow-up session",
          length: 45
        },
        {
          id: "3",
          title: "Emergency Session",
          description: "30 minute emergency session",
          length: 30
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching Cal.com user:", error);
    throw new Error("Failed to fetch user details");
  }
};

/**
 * Get multiple Cal.com users (therapists in our case)
 */
export const getCalUsers = async (): Promise<CalUser[]> => {
  try {
    // In a real implementation, you would fetch from the Cal.com API
    // This is a mock implementation for demonstration
    return [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah@example.com",
        username: "sarah-johnson",
        bio: "Specializing in anxiety and depression treatment with 8+ years of experience",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
        eventTypes: [
          { id: "1", title: "Initial Consultation", length: 60 },
          { id: "2", title: "Follow-up Session", length: 45 }
        ]
      },
      {
        id: "2",
        name: "Dr. Michael Chen",
        email: "michael@example.com",
        username: "michael-chen",
        bio: "Helping families build stronger relationships for over 10 years",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256",
        eventTypes: [
          { id: "1", title: "Family Therapy Session", length: 60 },
          { id: "2", title: "Follow-up Session", length: 45 }
        ]
      },
      {
        id: "3",
        name: "Dr. Aisha Rahman",
        email: "aisha@example.com",
        username: "aisha-rahman",
        bio: "Specialized in PTSD and trauma recovery with a compassionate approach",
        avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=256",
        eventTypes: [
          { id: "1", title: "Trauma Therapy", length: 60 },
          { id: "2", title: "Follow-up Session", length: 45 }
        ]
      }
    ];
  } catch (error) {
    console.error("Error fetching Cal.com users:", error);
    throw new Error("Failed to fetch therapists");
  }
};
