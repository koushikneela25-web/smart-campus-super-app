export type Role = 'STUDENT' | 'FACULTY' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  collegeId: string;
  role: Role;
  status: UserStatus;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  departmentId: number;
  departmentName?: string;
  credits: number;
}

export interface Section {
  id: number;
  name: string;
  courseId: number;
  courseName?: string;
  semester: number;
  academicYear: string;
}

export interface Classroom {
  id: number;
  roomNumber: string;
  building: string;
  capacity: number;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  departmentId: number;
  departmentName?: string;
  credits: number;
  semester: number;
}

export interface TimetableEntry {
  id: number;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  facultyId: number;
  facultyName: string;
  sectionId: number;
  sectionName: string;
  classroomId: number;
  roomNumber: string;
  building: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceSession {
  id: number;
  facultyId: number;
  facultyName: string;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  sectionId: number;
  sectionName: string;
  classroomId?: number;
  roomNumber?: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  qrToken: string;
  qrExpiresAt: string;
  isActive: boolean;
  geofenceEnabled: boolean;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  checkInCount?: number;
}

export interface AttendanceRecord {
  id: number;
  sessionId: number;
  subjectCode: string;
  subjectName: string;
  studentId: number;
  studentName: string;
  collegeId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  checkInTime: string;
  sessionDate: string;
  studentLatitude?: number;
  studentLongitude?: number;
  distanceMeters?: number;
  remarks?: string;
}

export interface SubjectAttendanceSummary {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export interface AttendanceSummary {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  overallPercentage: number;
  subjectSummaries: SubjectAttendanceSummary[];
}

export type EventCategory = 'ACADEMIC' | 'CULTURAL' | 'TECHNICAL' | 'SPORTS' | 'WORKSHOP';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface CampusEvent {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  venue: string;
  organizerId: number;
  organizerName: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  registeredCount: number;
  status: EventStatus;
  imageUrl?: string;
  isRegisteredByMe?: boolean;
}

export type ItemType = 'LOST' | 'FOUND';
export type ItemCategory = 'ELECTRONICS' | 'BOOKS' | 'ID_CARDS' | 'CLOTHING' | 'ACCESSORIES' | 'OTHER';
export type ItemStatus = 'LOST' | 'FOUND' | 'CLAIM_PENDING' | 'RESOLVED';
export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LostFoundItem {
  id: number;
  title: string;
  description: string;
  category: ItemCategory;
  itemType: ItemType;
  location: string;
  dateRecorded: string;
  status: ItemStatus;
  reportedById: number;
  reportedByName: string;
  imageUrl?: string;
  createdAt: string;
}

export interface LostFoundClaim {
  id: number;
  itemId: number;
  itemTitle: string;
  claimantId: number;
  claimantName: string;
  descriptionProof: string;
  status: ClaimStatus;
  resolutionNotes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'ATTENDANCE' | 'TIMETABLE' | 'EVENT' | 'LOST_FOUND' | 'ANNOUNCEMENT' | 'SYSTEM';
  isRead: boolean;
  referenceId?: number;
  createdAt: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  targetRole: string;
  authorId: number;
  authorName: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
}

export interface StudentDashboard {
  profile: User;
  attendance: AttendanceSummary;
  todayTimetable: TimetableEntry[];
  nextClass?: TimetableEntry;
  upcomingEvents: CampusEvent[];
  recentAnnouncements: AnnouncementItem[];
  unreadNotificationsCount: number;
}

export interface FacultyDashboard {
  profile: User;
  todayClasses: TimetableEntry[];
  nextClass?: TimetableEntry;
  activeSessions: AttendanceSession[];
  recentSessions: AttendanceSession[];
  upcomingEvents: CampusEvent[];
  recentAnnouncements: AnnouncementItem[];
  totalClassesTaught: number;
}

export interface AdminDashboard {
  totalStudents: number;
  totalFaculty: number;
  totalUsers: number;
  activeUsers: number;
  totalDepartments: number;
  totalSubjects: number;
  totalClassrooms: number;
  upcomingEventsCount: number;
  pendingLostFoundCount: number;
  totalAttendanceRecords: number;
  upcomingEvents: CampusEvent[];
  recentAuditLogs: any[];
  attendanceChartData: { day: string; present: number; absent: number }[];
}
