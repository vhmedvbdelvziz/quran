"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "الاسم يجب أن يكون 2 حروف على الأقل";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.message.trim()) {
      newErrors.message = "الرسالة مطلوبة";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "الرسالة يجب أن تكون 10 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // مسح الخطأ عند البدء في الكتابة
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");

    // التحقق من الفورم
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.error || "حدث خطأ في إرسال الرسالة");
        return;
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        message: "",
      });

      // إخفاء رسالة النجاح بعد 5 ثوان
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      setGeneralError("حدث خطأ في الاتصال بالخادم. يرجى إعادة المحاولة");
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* العنوان والوصف */}
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold">اتصل بنا</h1>
          <div className="space-y-4 text-muted-foreground">
            <p>
              نسعد بتواصلكم معنا في أي وقت، سواء للاستفسار أو الإبلاغ عن خطأ أو اقتراح
              تطوير
            </p>
            <p>
              رأيكم يهمنا، وملاحظاتكم تساعدنا على تحسين الموقع ليكون عونًا لكم على
              الطاعة.
            </p>
            <p className="font-medium">يمكنك التواصل معنا من خلال النموذج التالي:</p>
          </div>
        </div>

        {/* الفورم */}
        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6">
          {/* رسالة النجاح */}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              ✓ تم إرسال رسالتك بنجاح، شكراً لتواصلك معنا!
            </div>
          )}

          {/* رسالة الخطأ العام */}
          {generalError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {generalError}
            </div>
          )}

          {/* حقل الاسم */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-right outline-none transition-all focus:ring-2 focus:ring-offset-0"
              style={{
                borderColor: errors.name ? "#dc2626" : "",
                "--tw-ring-color": "#054e49",
              } as any}
              placeholder="أدخل اسمك"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* حقل البريد الإلكتروني */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-right outline-none transition-all focus:ring-2 focus:ring-offset-0"
              style={{
                borderColor: errors.email ? "#dc2626" : "",
                "--tw-ring-color": "#054e49",
              } as any}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* حقل الرسالة */}
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              الرسالة
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-right outline-none transition-all focus:ring-2 focus:ring-offset-0 resize-none"
              style={{
                borderColor: errors.message ? "#dc2626" : "",
                "--tw-ring-color": "#054e49",
              } as any}
              placeholder="أكتب رسالتك هنا..."
            />
            {errors.message && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {formData.message.length}/5000
            </p>
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-6 py-2.5 font-medium text-white transition-all hover:opacity-90 disabled:opacity-70"
            style={{ backgroundColor: "#054e49" }}
          >
            {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>
        </form>

        {/* الختام */}
        <div className="mt-12 text-center text-muted-foreground">
          <p>جزاكم الله خيرًا على تواصلكم، ونسأل الله أن يجعل هذا العمل خالصًا لوجهه الكريم.</p>
        </div>
      </div>
    </div>
  );
}
