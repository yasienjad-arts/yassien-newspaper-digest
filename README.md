# 🗞️ Yassien Newspaper Digest

مشروع Netlify لإرسال ملخص الصحف يوميًا إلى Telegram.

## الصحف
- النهار
- الأخبار
- الجمهورية
- الديار
- نداء الوطن
- اللواء
- الشرق
- البناء
- الشرق الأوسط

لا يتم تضمين L'Orient-Le Jour.

## 1. إنشاء GitHub
أنشئ Repository جديدًا ثم ارفع جميع ملفات هذا المشروع إليه.

## 2. ربط Netlify
من Netlify اختر Add new project ثم Import an existing project ثم اختر GitHub والمستودع.
إعدادات البناء:
- Build command: اتركها فارغة
- Publish directory: public
- Functions directory: netlify/functions

## 3. Environment Variables
في Netlify > Project configuration > Environment variables أضف:
- TELEGRAM_BOT_TOKEN = Token البوت من BotFather
- TELEGRAM_CHAT_ID = @yassienchannels
- TIME_ZONE = Asia/Beirut

لا تضع Token في GitHub.

## 4. النشر والاختبار
بعد النشر:
1. افتح Functions في Netlify.
2. افتح daily-news.
3. اضغط Run now للاختبار.
4. راقب وصول الرسالة إلى قناة Telegram.

يوجد أيضًا test-news كوظيفة HTTP للاختبار.

## الجدولة
المشروع يستخدم:
0 6 * * *

Netlify Scheduled Functions تعمل وفق UTC. هذا يعني 06:00 UTC، ويجب تعديل الجدولة إذا أردت وقتًا مختلفًا حسب التوقيت الصيفي/الشتوي.

## ملاحظة مهمة
استخراج العناوين من صفحات المواقع قد يتغير إذا غيّرت الصحف تصميم مواقعها أو منعت الطلبات الآلية. عندها يمكن تعديل قواعد الاستخراج أو استخدام RSS/API رسمي حيث يتوفر.
