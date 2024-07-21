import Image from "next/image";
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <div className="text-black px-[16px]">
      <div className="container mx-auto">Home</div>
      <Toaster />
    </div>
  );
}
