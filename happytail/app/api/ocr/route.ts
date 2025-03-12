import { NextRequest, NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const worker = await Tesseract.createWorker({
      workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js", // 상대 경로 설정
      logger: (m) => console.log(m),
    });

    await worker.load();
    await worker.loadLanguage("eng+kor");
    await worker.initialize("eng+kor");

    const { data } = await worker.recognize(buffer);
    await worker.terminate();

    const text = data.text.replace(/\n+/g, " ").trim(); // 개행 제거 후 정리
    console.log("OCR 결과:", text);

    // ✅ 주민등록번호 추출 (더 정밀하게)
    const idRegex = /\b(\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))[-](\d{7})\b/;
    const idMatch = text.match(idRegex);
    const idNumber = idMatch ? idMatch[0] : null;

    // ✅ 이름 추출 (주민번호 앞에 오는 한글 단어)
    const nameRegex = /([가-힣]{2,5})\s+\d{6}-\d{7}/;
    const nameMatch = text.match(nameRegex);
    const name = nameMatch ? nameMatch[1] : "이름 인식 실패";

    // ✅ 주소 추출 (더 정밀한 패턴 적용)
    const addressRegex =
      /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충청북|충청남|전라북|전라남|경상북|경상남|제주)[^\n]+/;
    const addressMatch = text.match(addressRegex);
    const address = addressMatch ? addressMatch[0] : "주소 인식 실패";

    // ✅ 성별 판별 (1,2 = 1900년대 / 3,4 = 2000년대)
    let gender = "알 수 없음";
    if (idNumber) {
      const genderCode = parseInt(idNumber[7], 10);
      gender = [1, 3].includes(genderCode) ? "M" : "F";
    }

    // ✅ 위조 탐지 로직
    let isValid = true;
    let reason = "";

    // (1) OCR 조작 흔적 탐지
    if (
      !text.includes("주민등록증") ||
      text.includes("복사본") ||
      text.includes("SAMPLE") ||
      text.includes("TEST") ||
      text.includes("가짜")
    ) {
      isValid = false;
      reason = "주민등록증 원본이 아닐 가능성이 있습니다.";
    }

    // (2) 주민등록번호 검증
    if (!idNumber || !/^\d{6}-\d{7}$/.test(idNumber)) {
      isValid = false;
      reason = "올바른 주민등록번호 형식이 아닙니다.";
    }

    // (3) 성별 코드 검증 (1,2,3,4만 가능)
    if (idNumber) {
      const genderCode = parseInt(idNumber[7], 10);
      if (![1, 2, 3, 4].includes(genderCode)) {
        isValid = false;
        reason = "유효하지 않은 주민등록번호입니다.";
      }
    }

    // (4) 주소 유효성 검사
    if (!address || address === "주소 인식 실패") {
      isValid = false;
      reason = "주소가 인식되지 않았습니다.";
    }

    return NextResponse.json({
      name,
      idNumber,
      gender,
      address,
      valid: isValid,
      reason,
    });
  } catch (error) {
    console.error("OCR 처리 오류:", error);
    return NextResponse.json(
      { error: "OCR 처리 중 오류 발생" },
      { status: 500 }
    );
  }
}
