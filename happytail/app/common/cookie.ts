// ✅ 쿠키 가져오기 함수
export function getCookie(name: string): string | null {
  const cookieArr = document.cookie.split("; ");
  for (const cookie of cookieArr) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return decodeURIComponent(cookieValue);
  }
  return null;
}

// ✅ 쿠키 설정 함수
export function setCookie(name: string, value: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 100000000000); // 1000000000일 후 만료
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; secure`;
}

// ✅ 쿠키 삭제 함수
export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure`;
}
