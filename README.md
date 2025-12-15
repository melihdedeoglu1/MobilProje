# 🧠 Odaklanma Takibi ve Raporlama Uygulaması

Uygulama, kullanıcıların odaklanma sürelerini (Pomodoro benzeri) takip etmesini, kategori bazlı ayrıştırma yapmasını ve çalışma verimliliğini grafiklerle analiz etmesini sağlar. Ayrıca `AppState` API kullanılarak kullanıcının dikkat dağınıklığı (uygulamadan çıkışları) otomatik olarak tespit edilir.

## 🚀 Özellikler

- **Zamanlayıcı (Timer):** Başlatma, duraklatma ve sonlandırma işlemleri.
- **Süre Ayarlama:** Varsayılan süreyi artırma/azaltma (+/-) özelliği.
- **Kategori Yönetimi:** Çalışmaların kategorize edilmesi (Kodlama, Ders, Kitap vb.).
- **Dikkat Dağınıklığı Tespiti:** Uygulama arka plana atıldığında sayacın durması ve ihlal sayısının artması.
- **Gelişmiş Raporlama:**
  - Günlük ve Toplam İstatistikler.
  - Son 7 Günlük Performans Grafiği (Bar Chart - Akıllı Birim Sistemi).
  - Kategori Dağılım Grafiği (Pie Chart).
- **Veri Kalıcılığı:** Uygulama kapatılsa bile verilerin `AsyncStorage` ile cihazda saklanması.

## 🛠 Kullanılan Teknolojiler

- **React Native** (Expo Framework)
- **React Navigation** (Bottom Tabs)
- **React Native Chart Kit** (Veri Görselleştirme)
- **AsyncStorage** (Yerel Veritabanı)

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi sorunsuz bir şekilde çalıştırmak için aşağıdaki adımları sırasıyla uygulayın:

1.  Öncelikle terminalinizi açın ve `git clone https://github.com/melihdedeoglu1/MobilProje.git` komutunu yazarak proje dosyalarını bilgisayarınıza indirin.
2.  İndirme tamamlandıktan sonra `cd MobilProje` komutu ile projenin bulunduğu klasöre giriş yapın.
3.  Projenin çalışması için gerekli olan paketlerin yüklenmesi adına `npm install` komutunu çalıştırın ve yüklemenin bitmesini bekleyin.
4.  Kurulum bittikten sonra `npm start` komutunu yazarak Expo sunucusunu başlatın.
5.  Son olarak, terminalde beliren QR kodu telefonunuzdaki **Expo Go** uygulaması ile okutarak uygulamayı test edin.
