import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="https://casino.guru/" rel="home" className="inline-block">
      <Image
        src="https://static.casino.guru/res/cc26f89e34ef12cd4dac6731c76aaaa5a/images/casinoguru_logo.svg"
        alt="Casino Guru – The Ultimate Guide to The Online Casino World"
        width={90}
        height={40}
        priority
      />
    </Link>
  );
}
