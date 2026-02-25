import { NextRequest, NextResponse } from "next/server";

// الـ webhook URL مخفي في environment variable
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// التحقق من صحة البيانات
function validateFormData(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // التحقق من الاسم
  if (!data.name || data.name.trim().length < 2) {
    errors.push("الاسم يجب أن يكون 2 حروف على الأقل");
  }
  if (data.name.length > 100) {
    errors.push("الاسم لا يجب أن يتجاوز 100 حرف");
  }

  // التحقق من البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("البريد الإلكتروني غير صحيح");
  }
  if (data.email.length > 255) {
    errors.push("البريد الإلكتروني طويل جداً");
  }

  // التحقق من الرسالة
  if (!data.message || data.message.trim().length < 10) {
    errors.push("الرسالة يجب أن تكون 10 أحرف على الأقل");
  }
  if (data.message.length > 5000) {
    errors.push("الرسالة لا يجب أن تتجاوز 5000 حرف");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// حماية من الـ spam بتفقد معدل الطلبات
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const data = requestCounts.get(ip);

  if (!data || now > data.resetTime) {
    // إعادة تعيين: 5 طلبات كل ساعة
    requestCounts.set(ip, { count: 1, resetTime: now + 3600000 });
    return true;
  }

  if (data.count >= 5) {
    return false;
  }

  data.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // الحصول على IP العميل
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // فحص حد الطلبات (Rate Limiting)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "لقد تجاوزت حد الطلبات المسموح به. يرجى المحاولة لاحقاً" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // التحقق من البيانات
    const validation = validateFormData({ name, email, message });
    if (!validation.valid) {
      return NextResponse.json(
        { error: "البيانات غير صحيحة", details: validation.errors },
        { status: 400 }
      );
    }

    // إذا لم يكن webhook URL موجود، نرجع خطأ
    if (!WEBHOOK_URL) {
      console.error("Discord webhook URL not configured");
      return NextResponse.json(
        { error: "حدث خطأ في الخادم. يرجى إعادة المحاولة لاحقاً" },
        { status: 500 }
      );
    }

    // إرسال إلى Discord
    const discordMessage = {
      content: "رسالة جديدة من موقع نور القرآن",
      embeds: [
        {
          title: "رسالة تواصل جديدة",
          color: 0x054e49,
          fields: [
            {
              name: "الاسم",
              value: name,
              inline: true,
            },
            {
              name: "البريد الإلكتروني",
              value: `[${email}](mailto:${email})`,
              inline: true,
            },
            {
              name: "الرسالة",
              value: message,
              inline: false,
            },
            {
              name: "التاريخ والوقت",
              value: new Date().toLocaleString("ar-EG"),
              inline: false,
            },
            {
              name: "عنوان IP",
              value: ip,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      console.error("Discord webhook error:", response.statusText);
      return NextResponse.json(
        { error: "حدث خطأ في إرسال الرسالة. يرجى إعادة المحاولة" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "تم إرسال رسالتك بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في المعالجة. يرجى إعادة المحاولة" },
      { status: 500 }
    );
  }
}
