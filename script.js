const ALICI_EPOSTA = "ecem@ornek.example";

const temaDugmesi = document.querySelector(".theme-toggle");

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

const sistemKoyu = window.matchMedia("(prefers-color-scheme: dark)").matches;
temayiUygula(kayitliTema() || (sistemKoyu ? "dark" : "light"));

if (temaDugmesi) {
  temaDugmesi.addEventListener("click", function () {
    const yeniTema = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    temayiUygula(yeniTema);
    try {
      localStorage.setItem("tema", yeniTema);
    } catch (hata) {
    }
  });
}

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
      menu.querySelector("a").focus();
    }
  });

  document.addEventListener("keydown", function (olay) {
    if (olay.key === "Escape" && menu.classList.contains("is-open")) {
      menuyuKapat();
      menuDugmesi.focus();
    }
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", menuyuKapat);
}

const kartlar = document.querySelectorAll(".card");
const filtreDugmeleri = document.querySelectorAll(".filter-btn");
const aramaKutusu = document.getElementById("proje-ara");
const sonucSayisi = document.getElementById("sonuc-sayisi");
const bosMesaj = document.getElementById("bos-sonuc");

let seciliFiltre = "hepsi";

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

const form = document.getElementById("iletisim-formu");

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
  hataAlani.textContent = gecerli ? "" : kural.mesaj;
  return gecerli;
}

if (form) {
  const durum = document.getElementById("form-durum");
  const sayac = document.getElementById("mesaj-sayac");
  const mesajAlani = form.elements.mesaj;

  form.setAttribute("novalidate", "");

  Object.keys(kurallar).forEach(function (ad) {
    const alan = form.elements[ad];
    alan.addEventListener("blur", function () {
      alaniKontrolEt(alan);
    });
    alan.addEventListener("input", function () {
      if (alan.getAttribute("aria-invalid") === "true") alaniKontrolEt(alan);
    });
  });

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
      ilkHatali.focus();
      return;
    }

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

const banyoGorselleri = document.querySelectorAll("[data-develop]");
const hareketAz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (banyoGorselleri.length && "IntersectionObserver" in window && !hareketAz) {
  const gozlemci = new IntersectionObserver(
    function (girdiler) {
      girdiler.forEach(function (girdi) {
        if (girdi.isIntersecting) {
          girdi.target.classList.add("is-developed");
          gozlemci.unobserve(girdi.target);
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

document.querySelectorAll("[data-yil]").forEach(function (yer) {
  yer.textContent = new Date().getFullYear();
});
