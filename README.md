# Elif Ecem Gelir · Web Portfolyosu

**Canlı site:** https://jammie-png.github.io/WebPortfolio/

GEP1316 Kodlama Okuryazarlığı, Ara Değerlendirme Ödevi 2 (2026-2027 Güz).
Bahçeşehir Üniversitesi Çizgi Film ve Animasyon öğrencisi Elif Ecem Gelir'in karakter tasarımı,
sahne ve renk çalışmalarını gösteren dört sayfalık portfolyo.

## Sayfalar

| Dosya | İçerik |
| --- | --- |
| `index.html` | Ana sayfa: kısa tanıtım, avatar, gezinti menüsü, seçili çizimler |
| `hakkimda.html` | Eğitim, ilgi alanları, "Kodlama ve yapay zekânın mesleğimdeki yeri" |
| `projeler.html` | 4 çizim projesi kartı: görsel, açıklama, Behance bağlantısı, "Ne öğrendim" |
| `iletisim.html` | Doğrulamalı form, aydınlatma metni, Behance ve GitHub bağlantıları |

## Teknik

- **Ortak dosyalar:** tüm sayfalar tek `style.css` ve tek `script.js` kullanır.
- **Duyarlı tasarım:** masaüstü, tablet (≤1023px) ve telefon (≤639px) için `@media` kuralları;
  ayrıca `prefers-color-scheme`, `prefers-reduced-motion` ve `print`.
- **JavaScript etkileşimleri** (hepsi `script.js` içinde):
  1. Karanlık mod: seçim `localStorage`'da hatırlanır
  2. Mobil menü: `aria-expanded`, Escape ile kapanma
  3. Proje filtreleme (karakter / sahne) ve Türkçe harf duyarlı arama, sonuç sayısı ekran okuyucuya okunur
  4. Form doğrulama: alan alan hata mesajı, karakter sayacı, geri bildirim mesajı
  5. "Banyo" efekti: büyük çizim ekrana girince griden renge geçer
  6. Alt bilgideki yılın otomatik yazılması
- **Erişilebilirlik:** anlamsal HTML (`header`, `nav`, `main`, `section`, `aside`, `footer`),
  her görselde alt metin, görünür `label`'lar, "İçeriğe atla" bağlantısı, görünür odak halkası,
  metin kontrastı en az 7:1, 44px dokunma alanları, azaltılmış hareket desteği.
- **Gizlilik:** form verisi hiçbir sunucuya gitmez (e-posta programında taslak açılır);
  çerez, analiz ya da izleyici betiği yok; yazı tipleri siteyle birlikte barındırılır,
  bu yüzden Google Fonts'a istek gitmez.

## Klasörler

```
index.html  hakkimda.html  projeler.html  iletisim.html
style.css   script.js      favicon.svg
img/        çizimler (WebP) ve paylaşım görseli
fonts/      Source Serif 4 ve Libre Franklin (SIL Open Font License)
```

## Yerelde çalıştırma

Herhangi bir statik sunucu yeterli:

```bash
python3 -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000` adresini aç.

## GitHub Pages ile yayın

1. Dosyaları `main` dalına gönder.
2. GitHub'da depo → **Settings → Pages** → *Build and deployment*: **Deploy from a branch**,
   dal `main`, klasör `/ (root)` → **Save**.
3. Birkaç dakika sonra site https://jammie-png.github.io/WebPortfolio/ adresinde yayında olur.

## Teslimden önce düzenlenecekler

- [ ] `projeler.html`: kartlardaki "Ne öğrendim" cümlelerini kendi deneyimine göre kontrol et.
- [ ] `hakkimda.html`: "Kodlama ve yapay zekânın mesleğimdeki yeri" bölümünü Ödev 2'deki
      paragrafının geliştirilmiş hâliyle değiştir (şu an taslak).
- [ ] `script.js`, satır 16: `ALICI_EPOSTA` değerini kendi e-posta adresinle değiştir.
- [ ] İstersen LinkedIn bağlantını `iletisim.html` içindeki listeye ekle.

## Kaynaklar ve haklar

- Çizimler: © Elif Ecem Gelir, tüm hakları saklıdır (Behance: https://www.behance.net/ecemgelir).
- Yazı tipleri: Source Serif 4 ve Libre Franklin, SIL Open Font License 1.1.
- Yapay zekâ kullanımı: Anthropic. (2026). *Claude* [Büyük dil modeli]. https://claude.ai
