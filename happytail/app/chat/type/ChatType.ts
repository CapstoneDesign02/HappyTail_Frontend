export interface File {
  id: number;
  url: string;
}

export interface AnimalProfile {
  id: number;
  name: string;
  type: number; // 예: 1 = 고양이, 2 = 강아지 등
  breed: string;
  additionalInfo: string;
  files: File[];
}

export interface Reservation {
  partnerNickname: string;
  partnerPhotoUrl: string;
  partnerEmail: string;
  userNickname: string;
  userPhotoUrl: string;
  userEmail: string;
  postTitle: string;
  animalProfile: AnimalProfile;
  startDate: string; // ISO 형식 날짜 (예: '2025-05-03')
  endDate: string;   // ISO 형식 날짜 (예: '2025-05-10')
  reservationId: number;
  ispartner: boolean; // true면 파트너, false면 사용자
}
