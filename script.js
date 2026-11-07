/* ==========================================================================
   Elif Ecem Gelir · Portfolyo · ortak JavaScript dosyası
   Tüm sayfalar bu dosyayı kullanır. Her blok yalnızca kendi öğesi sayfada
   varsa çalışır; böylece bir sayfada olmayan parça hata vermez.

   Etkileşimler:
     1. Karanlık mod (tema düğmesi, seçim tarayıcıda hatırlanır)
     2. Mobil menü (aç/kapat, Escape ile kapanır)
     3. Proje filtreleme ve arama (projeler.html)
     4. İletişim formu doğrulama ve geri bildirim mesajı (iletisim.html)
     5. "Banyo" efekti: büyük çizim ekrana girince renklenir (index.html)
     6. Alt bilgideki yılın otomatik yazılması
   ========================================================================== */

/* İletişim formunun açacağı e-posta adresi. Kendi adresinle değiştir. */
const ALICI_EPOSTA = "ecem@ornek.example";

/* 1. Karanlık mod ---------------------------------------------------------- */
const temaDugmesi = document.querySelector(".theme-toggle");

// localStorage gizli pencerede hata verebilir; bu yüzden try/catch içinde.
function kayitliTema() {
  try {
    return localStorage.getItem("tema");
  } catch (hata) {
    return null;
  }
}

function temayiUygula(tema) {
  document.documentElement.dataset.theme = tema;
  if (temaDugmesi) {
    const koyuMu = tema === "dark";
    temaDugmesi.setAttribute("aria-pressed", String(koyuMu));
    temaDugmesi.setAttribute("aria-label", koyuMu ? "Açık temaya geç" : "Koyu temaya geç");
  }
}

// İlk açılış: önce kayıtlı seçim, yoksa işletim sisteminin tercihi.
const sistemKoyu = window.matchMedia("(prefers-color-scheme: dark)").matches;
temayiUygula(kayitliTema() || (sistemKoyu ? "dark" : "light"));

if (temaDugmesi) {
  temaDugmesi.addEventListener("click", function () {
    const yeniTema = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    temayiUygula(yeniTema);
    try {
      localStorage.setItem("tema", yeniTema);
    } catch (hata) {
      // Kaydedilemezse tema yalnızca bu sayfa için değişir; sorun değil.
    }
  });
}

/* 2. Mobil menü ------------------------------------------------------------ */
const menuDugmesi = document.querySelector(".menu-toggle");
const menu = document.getElementById("site-nav");

function menuyuKapat() {
  menu.classList.remove("is-open");
  menuDugmesi.setAttribute("aria-expanded", "false");
  menuDugmesi.setAttribute("aria-label", "Menüyü aç");
}

if (menuDugmesi && menu) {
  menuDugmesi.addEventListener("click", function () {
    const acikMi = menuDugmesi.getAttribute("aria-expanded") === "true";
    if (acikMi) {
      menuyuKapat();
    } else {
      menu.classList.add("is-open");
      menuDugmesi.setAttribute("aria-expanded", "true");
      menuDugmesi.setAttribute("aria-label", "Menüyü kapat");
      menu.querySelector("a").focus(); // klavye kullanıcısı ilk bağlantıya gelir
    }
  });

  // Escape tuşu menüyü kapatır ve odağı düğmeye geri verir.
  document.addEventListener("keydown", function (olay) {
    if (olay.key === "Escape" && menu.classList.contains("is-open")) {
      menuyuKapat();
      menuDugmesi.focus();
    }
  });

  // Ekran genişleyince (telefon yan çevrilince) menü açık kalmasın.
  window.matchMedia("(min-width: 1024px)").addEventListener("change", menuyuKapat);
}

/* 3. Proje filtreleme ve arama ---------------------------------------------- */
const kartlar = document.querySelectorAll(".card");
const filtreDugmeleri = document.querySelectorAll(".filter-btn");
const aramaKutusu = document.getElementById("proje-ara");
const sonucSayisi = document.getElementById("sonuc-sayisi");
const bosMesaj = document.getElementById("bos-sonuc");

let seciliFiltre = "hepsi";

// Türkçe büyük/küçük harf farkını kaldırır: "İ" ve "I" doğru küçülür.
function sadelestir(metin) {
  return metin.toLocaleLowerCase("tr").trim();
}

function projeleriSuz() {
  const aranan = aramaKutusu ? sadelestir(aramaKutusu.value) : "";
  let gorunen = 0;

  kartlar.forEach(function (kart) {
    const turUyuyor = seciliFiltre === "hepsi" || kart.dataset.tur === seciliFiltre;
    const metinUyuyor = sadelestir(kart.textContent).includes(aranan);
    const goster = turUyuyor && metinUyuyor;
    kart.hidden = !goster;
    if (goster) gorunen++;
  });

  // Sonuç sayısı aria-live alanında: ekran okuyucu değişikliği okur.
  sonucSayisi.textContent = gorunen + " proje gösteriliyor";
  bosMesaj.hidden = gorunen !== 0;
}

if (kartlar.length && sonucSayisi) {
  filtreDugmeleri.forEach(function (dugme) {
    dugme.addEventListener("click", function () {
      seciliFiltre = dugme.dataset.filtre;
      filtreDugmeleri.forEach(function (d) {
        d.setAttribute("aria-pressed", String(d === dugme));
      });
      projeleriSuz();
    });
  });
  if (aramaKutusu) aramaKutusu.addEventListener("input", projeleriSuz);

  // "Tümünü göster" düğmesi filtreyi ve aramayı sıfırlar.
  const sifirla = document.getElementById("filtreyi-sifirla");
  if (sifirla) {
    sifirla.addEventListener("click", function () {
      aramaKutusu.value = "";
      filtreDugmeleri[0].click();
      aramaKutusu.focus();
    });
  }
  projeleriSuz();
}

/* 4. İletişim formu --------------------------------------------------------- */
const form = document.getElementById("iletisim-formu");

// Her alan için kural ve hata mesajı. Mesajlar alanın adını ve ne yazılacağını söyler.
const kurallar = {
  ad: {
    gecerli: (deger) => deger.trim().length >= 2,
    mesaj: "Adını yaz (en az 2 harf).",
  },
  eposta: {
    gecerli: (deger) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(deger.trim()),
    mesaj: "E-posta adresini ad@alan.com biçiminde yaz.",
  },
  konu: {
    gecerli: (deger) => deger !== "",
    mesaj: "Mesajının konusunu listeden seç.",
  },
  mesaj: {
    gecerli: (deger) => deger.trim().length >= 20 && deger.length <= 1000,
    mesaj: "Mesajını 20 ile 1000 karakter arasında yaz.",
  },
};

function alaniKontrolEt(alan) {
  const kural = kurallar[alan.name];
  const hataAlani = document.getElementById(alan.name + "-hata");
  const gecerli = kural.gecerli(alan.value);

  alan.setAttribute("aria-invalid", String(!gecerli));
  // textContent kullanılır, innerHTML değil: kullanıcı metni HTML olarak işlenmez.
  hataAlani.textContent = gecerli ? "" : kural.mesaj;
  return gecerli;
}

if (form) {
  const durum = document.getElementById("form-durum");
  const sayac = document.getElementById("mesaj-sayac");
  const mesajAlani = form.elements.mesaj;

  // Tarayıcının kendi balonları yerine kendi mesajlarımızı gösteriyoruz.
  form.setAttribute("novalidate", "");

  // Alan terk edilince (blur) o alan kontrol edilir; hatalıysa yazarken düzelir.
  Object.keys(kurallar).forEach(function (ad) {
    const alan = form.elements[ad];
    alan.addEventListener("blur", function () {
      alaniKontrolEt(alan);
    });
    alan.addEventListener("input", function () {
      if (alan.getAttribute("aria-invalid") === "true") alaniKontrolEt(alan);
    });
  });

  // Karakter sayacı
  mesajAlani.addEventListener("input", function () {
    sayac.textContent = mesajAlani.value.length + " / 1000";
  });

  form.addEventListener("submit", function (olay) {
    olay.preventDefault();
    durum.hidden = true;

    let ilkHatali = null;
    Object.keys(kurallar).forEach(function (ad) {
      const alan = form.elements[ad];
      if (!alaniKontrolEt(alan) && !ilkHatali) ilkHatali = alan;
    });

    if (ilkHatali) {
      ilkHatali.focus(); // klavye ve ekran okuyucu kullanıcısı ilk hataya gider
      return;
    }

    // Veri hiçbir sunucuya gitmez: ziyaretçinin e-posta programında taslak açılır.
    // encodeURIComponent, metindeki & ? # gibi işaretlerin bağlantıyı bozmasını engeller.
    const konu = "Portfolyo: " + form.elements.konu.value;
    const govde =
      form.elements.mesaj.value.trim() +
      "\n\n" +
      form.elements.ad.value.trim() +
      " (" +
      form.elements.eposta.value.trim() +
      ")";
    window.location.href =
      "mailto:" + ALICI_EPOSTA +
      "?subject=" + encodeURIComponent(konu) +
      "&body=" + encodeURIComponent(govde);

    durum.textContent =
      "Mesajın e-posta programında taslak olarak açıldı. Göndermek için orada Gönder'e bas.";
    durum.hidden = false;
    durum.focus();
  });
}

/* 5. "Banyo" efekti ----------------------------------------------------------
   .develop sınıflı görsel ekranın %35'i görününce bir kez renklenir.
   Hareket azaltma tercihi açıksa efekt hiç başlamaz. */
const banyoGorselleri = document.querySelectorAll("[data-develop]");
const hareketAz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (banyoGorselleri.length && "IntersectionObserver" in window && !hareketAz) {
  const gozlemci = new IntersectionObserver(
    function (girdiler) {
      girdiler.forEach(function (girdi) {
        if (girdi.isIntersecting) {
          girdi.target.classList.add("is-developed");
          gozlemci.unobserve(girdi.target); // yalnızca bir kez
        }
      });
    },
    { threshold: 0.35 }
  );

  banyoGorselleri.forEach(function (gorsel) {
    gorsel.classList.add("develop");
    gozlemci.observe(gorsel);
  });
}

/* 6. Yıl ----------------------------------------------------------------------- */
document.querySelectorAll("[data-yil]").forEach(function (yer) {
  yer.textContent = new Date().getFullYear();
});
