import Image from "components/image";

export default function Background() {
  return (
    <div className="fixed top-[50%] translate-y-[calc(-50%_-_3rem)] -z-10 flex max-w-[127.5rem] w-full justify-between">
      <Image src="/bg_logo_15_210.svg" alt="15" width={210} height={120} />
      <Image src="/bg_logo_GG_210.svg" alt="GG" width={210} height={120} />
    </div>
  );
}
