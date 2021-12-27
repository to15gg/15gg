import Image from "next/image";

export default function Background() {
  return (
    <div className="absolute -z-10 flex w-full justify-between">
      <Image src="/bg_logo_15_210.svg" alt="15" width={210} height={120} />
      <Image src="/bg_logo_GG_210.svg" alt="GG" width={210} height={120} />
    </div>
  );
}
