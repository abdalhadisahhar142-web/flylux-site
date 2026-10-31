# قالب مواقع مكاتب السياحة

## التشغيل
افتح `index.html` بالمتصفح مباشرة، ما في أي build أو تثبيت.

## مكتب جديد (15 دقيقة)
1. انسخ `clients/flylux.js` باسم المكتب الجديد، مثلاً `clients/rayhan.js`
2. عدّل النصوص والأرقام والصور ورقم الواتساب
3. بـ `index.html` غيّر السطر:
   `<script src="clients/flylux.js"></script>` ← `clients/rayhan.js`
4. ارفع المجلد على Netlify / Vercel / Cloudflare Pages

## ملاحظات
- أي قسم ما بدك ياه: احذفه من ملف الإعدادات وبيختفي من الموقع والقائمة
- `navLabel` بأي قسم = بيظهر بقائمة الهيدر
- الخريطة: اكتب اسم المدينة بس، والإحداثيات من `js/places.js` (زيد مدن عليه إذا لزم)
- أيقونات "لماذا نحن": plane, hotel, car, passport, support, price, shield, map, globe, calendar, kaaba, bus, key, camera, star, users, clock, heart, ticket, suitcase
- `lang: "en"` بيقلب الموقع إنجليزي LTR
- الألوان من `theme` بملف الإعدادات
- قبل التسليم: الأفضل تنزّل الصور وتحطها بمجلد `images/` (أسرع وأضمن)

## الملفات
```
index.html        القالب
css/style.css     التصميم والأنيميشن
js/main.js        بيبني الأقسام من الإعدادات
js/icons.js       الأيقونات
js/places.js      إحداثيات المدن
clients/*.js      إعدادات كل مكتب
```

## قسم الدليل (guide) — جديد
قسم اختياري لشرح خدمة خطوة بخطوة (لمّ الشمل، العمرة، الفيز...):
- `steps`: الخطوات بالترتيب (title + text)
- `docs`: قائمة الأوراق المطلوبة + ملاحظة + زر واتساب (`cta`)
- `faq`: أسئلة متكررة بتنفتح وبتتسكر
شوف مثال كامل بـ `clients/flylux.js`. إذا ما بدك ياه لمكتب، لا تحطه بملف الإعدادات.

## الوضع الفاتح
بـ `theme` حط `mode: "light"` مع `bg` فاتح و `text` غامق (شوف `clients/flylux.js`).
وإذا بدك اللوغو والاسم جنب بعض: `brand.logoWithText: true`.
