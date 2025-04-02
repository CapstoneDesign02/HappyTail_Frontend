const CACHE_NAME = "next-pwa-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache
        .addAll([
          "/", // 메인 페이지
          "/favicon.ico",
          "/manifest.json",
          "/img/logo-10.png",
        ])
        .catch((error) =>
          console.warn("⚠️ 일부 리소스를 캐싱할 수 없음:", error)
        );
    })
  );
});

// 방문한 모든 페이지 캐싱
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return; // POST 요청 제외

  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone()); // 캐싱
              return networkResponse;
            });
          })
        );
      })
      .catch(() => {
        return caches.match("/"); // 네트워크 오류 시 홈 화면 제공
      })
  );
});
