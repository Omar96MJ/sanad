
import { Message, Conversation } from "@/lib/therapist-types";

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: '1',
    participantIds: ['1', '2'], // therapist(1), patient(2)
    lastMessageTimestamp: '2023-11-05T14:30:00',
    unreadCount: 2
  },
  {
    id: '2',
    participantIds: ['1', '3'], // therapist(1), patient(3)
    lastMessageTimestamp: '2023-11-04T09:15:00',
    unreadCount: 0
  }
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2', // patient
    senderName: 'Michael Chen',
    senderRole: 'patient',
    recipientId: '1', // therapist
    content: 'Hello Dr. Johnson, I had a question about the techniques we discussed in our last session.',
    timestamp: '2023-11-05T14:30:00',
    isRead: false
  },
  {
    id: '2',
    senderId: '2', // patient
    senderName: 'Michael Chen',
    senderRole: 'patient',
    recipientId: '1', // therapist
    content: 'I\'ve been trying the breathing exercises but I\'m not sure if I\'m doing them correctly.',
    timestamp: '2023-11-05T14:32:00',
    isRead: false
  },
  {
    id: '3',
    senderId: '1', // therapist
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'doctor',
    recipientId: '2', // patient
    content: 'Hi Michael, I\'m glad you reached out. Let me clarify the technique for you.',
    timestamp: '2023-11-03T10:15:00',
    isRead: true
  },
  {
    id: '4',
    senderId: '3', // another patient
    senderName: 'Emma Brown',
    senderRole: 'patient',
    recipientId: '1', // therapist
    content: 'Thank you for the session yesterday, it was very helpful.',
    timestamp: '2023-11-04T09:15:00',
    isRead: true
  },
  {
    id: '5',
    senderId: '1', // therapist
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'doctor',
    recipientId: '3', // patient
    content: 'You\'re welcome, Emma. I\'m glad you found it helpful. Let\'s continue with these exercises next week.',
    timestamp: '2023-11-04T09:30:00',
    isRead: true
  }
];
