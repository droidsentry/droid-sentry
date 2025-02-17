import Image from "next/image";
import quickStart from "../images/quick-start.png";

export default function FreeTrail() {
  return (
    <section className="py-[34px] md:py-10 bg-muted/50">
      <div className="mx-auto px-4 md:px-6 max-w-full lg:max-w-[1140px] xl:max-w-7xl xl:px-[70px] grid md:grid-cols-2 md:gap-10 items-center">
        <div className="pt-[68px] md:pt-20 text-center md:text-left mb-2 md:mb-14">
          <h2 className="text-[30.6px]/[34px] md:text-[40px]/[46px] font-bold mb-[8.5px] md:mb-6">
            無料で、即日開始
          </h2>
          <div className="mb-5 text-[15.3px]/[23.8px] md:text-lg">
            <p className="leading-relaxed">
              会社用のGoogleアカウント一つで、Androidデバイスの管理が始められます。
              まずは、無料トライアルで、Androidデバイスの管理を体験してください。
              先着500名、最大10台のAndroidデバイス分を無料でお試しいただけます。
              ご不明な点は、お気軽にお問い合わせください。
            </p>
          </div>
        </div>
        <div className="aspect-square size-full flex items-center justify-center">
          <div className="aspect-video w-full flex items-center justify-center bg-white rounded-3xl border overflow-hidden">
            <Image
              src={quickStart}
              alt="quick start"
              className="object-cover p-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
//
