import Image from "next/image";

export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/arvyn-logo.jpg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      unoptimized
      className="shrink-0 rounded-full"
    />
  );
}
