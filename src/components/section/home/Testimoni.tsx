"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const testimonials = [
  {
    id: 1,
    bgImage: "/images/testimoni.png",
    text: "Alhamdulillah, sejak anak saya belajar di RTQ ini, bacaan Al-Qur'annya semakin lancar dan tajwidnya lebih tepat. Tidak hanya itu, akhlaknya juga terlihat lebih santun berkat nilai-nilai Islami yang diajarkan setiap hari. Terima kasih kepada para pengajar yang sabar membimbing anak-anak kami",
    name: "Hedi Turner",
    profileImage: "/images/testimoni-1a.png",
    quoteImage: "/images/quotes.png",
  },
  {
    id: 2,
    bgImage: "/images/testimoni.png",
    text: "Saya sangat bersyukur menemukan RTQ ini. Anak saya yang dulu malas mengaji, kini justru semangat menghafal juz Amma dan rajin shalat berjamaah. Suasana pembelajaran yang penuh keikhlasan dan kebersamaan di sini benar-benar membentuk karakter Qur'ani-nya",
    name: "Budi Santoso",
    profileImage: "/images/testimoni-1a.png",
    quoteImage: "/images/quotes.png",
  },
  {
    id: 3,
    bgImage: "/images/testimoni.png",
    text: "Alhamdulillah, sejak bergabung di RTQ ini, anak saya jadi lebih rajin mengaji dan berhasil menyelesaikan khatam Al-Qur'an dengan tartil.Tidak hanya lancar membaca, ustadz/ustadzah juga mengajarkan pemahaman makna ayat-ayatnya, Jazakumullahu khairan atas semua ilmu yang diberikan!",
    name: "Anisa Rahman",
    profileImage: "/images/testimoni-1a.png",
    quoteImage: "/images/quotes.png",
  },
];

export default function Testimoni() {
  return (
    <section className="relative w-screen h-fit py-32">
      <div className="relative z-10">
        <Swiper
          modules={[Pagination, Mousewheel, FreeMode]}
          slidesPerView={1}
          freeMode={true}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.5,
          }}
          pagination={{
            clickable: true,
            bulletClass:
              "swiper-pagination-bullet !bg-gray-300 !h-1 !w-8 !rounded-sm",
            bulletActiveClass: "!bg-yellow-400",
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              freeMode: true,
            },
            768: {
              slidesPerView: 1,
              freeMode: true,
            },
            1024: {
              slidesPerView: 1,
              freeMode: true,
            },
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="relative w-full h-full">
                <div className="absolute inset-0">
                  <Image
                    src={testimonial.bgImage}
                    alt="Background Testimoni"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>

                <div className="relative z-20 flex py-24">
                  <div className="flex-1"></div>
                  <div className="flex-1">
                    <div className="px-12 text-white">
                      <h2 className="text-4xl font-bold mb-24">
                        Testimoni Orang Tua
                      </h2>
                      <p className="text-lg">{testimonial.text}</p>
                      <div className="flex mt-24 justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Image
                            src={testimonial.profileImage}
                            alt={testimonial.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <p className="text-lg">{testimonial.name}</p>
                        </div>
                        <div className="relative">
                          <Image
                            src={testimonial.quoteImage}
                            alt="Quotes"
                            width={100}
                            height={100}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
