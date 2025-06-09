import { NextRequest } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // MIME type에서 확장자 추출
    const mime = file.type; // e.g. "image/jpeg"
    let format = mime.split("/")[1]; // "jpeg"

    const payload = {
      version: "V2",
      requestId: "req-123",
      timestamp: Date.now(),
      images: [
        {
          name: "upload",
          format,
          data: base64,
        },
      ],
    };

    const response = await axios.post(
      process.env.NEXT_PUBLIC_NAVER_OCR_URL!,
      payload,
      {
        headers: {
          "Content-Type": "applicaiton/json",
          "X-OCR-SECRET": process.env.NEXT_PUBLIC_NAVER_OCR_SECRET!,
        },
      }
    );
    console.error("OCR 처리 성공:", response.data);

    // ✅ 여기 반드시 .data만 전달
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    const errMsg = error.response?.data || error.message;
    console.error("OCR 처리 실패:", errMsg);

    return new Response(
      JSON.stringify({ error: "OCR 처리 실패", detail: errMsg }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
