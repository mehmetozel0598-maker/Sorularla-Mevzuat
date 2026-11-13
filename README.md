# Soru Bankası (PWA)

API anahtarı gerektirmeyen, çevrimdışı çalışan soru bankası ve çalışma uygulaması. Sorular `.json` dosyalarından yüklenir; sorular ve ilerleme cihazda saklanır.

## Dosyalar

| Dosya | Görevi |
|---|---|
| `index.html` | Uygulamanın tamamı (arayüz ve mantık) |
| `manifest.json` | Uygulama adı, simge, tam ekran ayarı |
| `sw.js` | Çevrimdışı çalışmayı sağlayan Service Worker |
| `icon-192.png`, `icon-512.png` | Uygulama simgeleri |
| `ornek-soru-sablonu.json` | Örnek soru dosyası |

Beş uygulama dosyası aynı klasörde, düz hâlde durmalıdır; alt klasör yoktur.

## 1. Yayınlama (bir kez, GitHub Pages)

Uygulamanın kurulabilmesi için `https` ile açılan bir adreste durması gerekir. GitHub Pages bunu ücretsiz sağlar.

1. Deponun herkese açık (Public) olduğundan emin ol: depo > Settings > en altta "Change repository visibility". Ücretsiz hesapta Pages yalnızca herkese açık depolarda çalışır. Depoda yalnızca uygulama kodu durur; soruların ve ilerlemen cihazında kalır.
2. `https://github.com/KULLANICI/DEPO/upload/main` adresini aç, `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` dosyalarını seç ve "Commit changes"e bas. Telefondan da yapılabilir; klasör yapısı yoktur.
3. Depo > Settings > Pages > "Build and deployment" altında Source: "Deploy from a branch", Branch: `main`, klasör: `/ (root)` seç, Save'e bas.
4. Bir iki dakika sonra uygulama şu adreste açılır: `https://KULLANICI.github.io/DEPO/`

## 2. Cihaza kurma

**Android telefon ve tablet (Chrome):** Adresi aç. Altta çıkan "Uygulamayı yükle" düğmesine bas ya da sağ üstteki üç nokta menüsünden "Uygulamayı yükle" / "Ana ekrana ekle"yi seç.

**iPhone ve iPad (Safari):** Adresi Safari'de aç. Paylaş düğmesine, ardından "Ana Ekrana Ekle"ye dokun.

**Bilgisayar (Chrome ya da Edge):** Adresi aç. Adres çubuğunun sağındaki yükle simgesine bas ya da menüden "Soru Bankası'nı yükle"yi seç.

Kurulduktan sonra uygulamayı bir kez internet varken aç; sonrasında internetsiz de açılır.

## 3. Kullanım

- **Havuz > Soru dosyası yükle:** Bir ya da birden fazla `.json` seç. Yeni sorular eklenir; aynı `id`'li soru güncellenir, ilerleme korunur.
- **Çalış:** Bölümleri ağaçtan işaretle (birden fazla seçilebilir), soru adedini ve modu seç, başlat. "Tüm bölümleri karıştır" bütün havuzdan karma oturum açar.
- **Favoriler:** Soru çözerken yıldıza dokunduğun sorular.
- **Hata defteri:** Yanlış cevapladığın sorular kendiliğinden eklenir. "Doğru çözünce listeden otomatik çıkar" seçeneği buradadır.
- **Havuz > Yedekle:** Bütün soruları, ilerlemeni, favorileri ve hata defterini tek dosyaya indirir. Diğer cihazda "Yedekten geri yükle" ile açarsın.
- Bilgisayarda klavye: 1-5 ya da A-E şık seçer, sağ ve sol ok soru değiştirir.

Önemli: Veriler tarayıcının bu siteye ayırdığı depoda durur. Tarayıcı verilerini temizlersen ya da uygulamayı kaldırırsan silinir; düzenli yedek al. Cihazlar arasında otomatik eşitleme yoktur, taşıma yedek dosyasıyla yapılır.

## 4. Güncelleme

Yeni bir `index.html` aldığında depodaki dosyanın üzerine yükle. Uygulama yeni sürümü arka planda indirir; bir kez kapatıp açınca yeni sürüm gelir.

## 5. Soru dosyası biçimi

```json
{
  "format": "soru-bankasi",
  "surum": 1,
  "kaynak": { "ad": "Kitabın adı" },
  "sorular": [
    {
      "id": "bdr-gvk-02-01-001",
      "bolum": ["İkinci Bölüm: Ticari Kazanç", "1. Ticari Kazancın Mahiyeti", "1.1 Alt başlık"],
      "tur": "test",
      "vaka": "",
      "soru": "Soru metni",
      "secenekler": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı", "E şıkkı"],
      "dogru": 1,
      "cozum": "Doğru cevabın gerekçesi, varsa hesaplama adımları",
      "atif": {
        "kitap": "Kitabın adı",
        "bolum": "1.1 Alt başlık",
        "sayfa": 64,
        "basiliSayfa": "32",
        "konum": "Örnek 3",
        "kanun": "GVK md. 37",
        "teblig": "Varsa tebliğ ya da yönetmelik atfı",
        "diger": "Varsa özelge, karar vb.",
        "mevzuatOzeti": "İlgili hükmün iki üç cümlelik özeti"
      },
      "zorluk": "orta"
    }
  ]
}
```

Alan kuralları:

- `id`: Her soruda benzersiz, boşluksuz. Aynı `id` yeniden yüklenirse soru güncellenir. Boş bırakılırsa uygulama üretir.
- `bolum`: En üst bölümden en alt parçaya doğru sıralı dizi. İstenen kadar katman olabilir. Uygulama ağacı `kaynak.ad` > `bolum[0]` > `bolum[1]` ... şeklinde kurar.
- `tur`: `"test"` ya da `"vaka"`. Vaka sorusunda olay metni `vaka` alanına yazılır.
- `secenekler`: 2 ile 6 arasında şık (yeterlik düzeni için 5). Şık metnine "A)" gibi harf yazılmaz.
- `dogru`: Doğru şıkkın sırası, 0'dan başlar (0 = ilk şık). "B" gibi harf de kabul edilir.
- `atif`: Bütün alanlar isteğe bağlıdır; boş olan kutu gösterilmez. `sayfa` PDF'teki sayfa sırası, `basiliSayfa` kitaba basılı numaradır.
- Çözüm metninde şıklara harfle atıf yapma; uygulama şıkların yerini karıştırabilir.

## 6. Soru hazırlatırken kullanılacak istem

```
Ekteki PDF'in [bölüm adı / sayfa aralığı] kısmından Vergi Müfettiş Yardımcılığı Yeterlik
Sınavı düzeyinde [adet] soru hazırla ve Soru Bankası uygulamamın biçiminde tek bir .json
dosyası olarak ver:
{"format":"soru-bankasi","surum":1,"kaynak":{"ad":"..."},"sorular":[{"id","bolum":[...],
"tur","vaka","soru","secenekler":[5 şık],"dogru":0-4,"cozum","atif":{"kitap","bolum",
"sayfa","basiliSayfa","konum","kanun","teblig","diger","mevzuatOzeti"},"zorluk"}]}
Kurallar: id benzersiz ve boşluksuz olsun; bolum kitabın başlık hiyerarşisini en üstten en
alta izlesin; yalnızca PDF'te yazan bilgiye dayan, uydurma madde, oran ve tutar yazma;
sayfa alanına PDF sayfa sırasını yaz; çözümde şıklara harfle atıf yapma.
```
