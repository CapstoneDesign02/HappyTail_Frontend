export const OCRmockdata: OCRData = {
  name: "마동석",
  idNumber: "900112-1212378",
  gender: "남성",
  address: "경상북도 구미시 거의동",
  valid: true,
  reason: "주소가 인식되지 않았습니다.",
};
export type OCRData = {
  name: string;
  idNumber: string;
  gender: string;
  address: string;
  valid: boolean;
  reason: string;
};
