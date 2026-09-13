/**
 * The `inquiries` Firestore collection — one document per booking/training
 * enquiry submitted through /book-a-session/. Public clients may only
 * create documents in this shape (enforced in firestore.rules); reading,
 * updating status, and everything in the admin inbox goes through the
 * Firebase Admin SDK on the server, never the public client SDK.
 */

export const INQUIRY_STATUSES = ["new", "contacted", "booked", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const SESSION_TYPES = [
  "newborn",
  "maternity",
  "baby",
  "cake-smash",
  "family",
  "training",
] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

export const CONTACT_PREFERENCES = ["phone", "whatsapp", "email"] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

export type Inquiry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
  };
  session: {
    type: SessionType;
    package?: string;
    preferredDate?: string;
    preferredTime?: string;
    alternativeDate?: string;
  };
  baby: {
    name?: string;
    dateOfBirth?: string;
    dueDate?: string;
  };
  familyMembers?: number;
  message?: string;
  contactPreference: ContactPreference;
  status: InquiryStatus;
  source: string;
};

export const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  closed: "Closed",
};

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  newborn: "Newborn Photography",
  maternity: "Maternity Photography",
  baby: "Baby Photography",
  "cake-smash": "Cake Smash Photography",
  family: "Family Photography",
  training: "Training",
};
