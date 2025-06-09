export const OCRmockdata: OCRData = {
  name: "김철수",
  idNumber: "900112-1111111",
  gender: "남성",
  address: "경상북도 구미시 거의동",
  valid: true,
};

export type OCRData = {
  name: string;
  idNumber: string;
  gender: string;
  address: string;
  valid: boolean;
};
