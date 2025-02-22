import Image from "next/image";

export default function Loading() {
  return (
    <div className="loader-wrapper">
      <span className="loader"></span>
      <Image
        src="https://cdn.sanity.io/files/88gk88s2/production/82c40f36d0c0cec712ca09a2c7149ac3c9b7dbf1.png"
        alt="Cyprus VIP Estatees Logo"
        width={400}
        height={511}
        className="loader-img"
      />
    </div>
  );
}
