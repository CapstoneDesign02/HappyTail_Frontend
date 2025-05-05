export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, ""); // 숫자만 추출
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  } else {
    return phone; // 원래 값 리턴
  }
}
