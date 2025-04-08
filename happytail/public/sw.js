self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      // 네트워크 요청 실패 시 캐시에서 대체 (예: 홈 화면)
      return caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || caches.match("/");
      });
    })
  );
});
