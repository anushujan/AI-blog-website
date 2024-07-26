import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/Header";
import ChatBox from "@/components/ChatBox"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bolgapp",
  description: "Blogapp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fff] text-black`}>
        <Header/>
        <div className="pt-[70px]">{children}</div>
        <ChatBox /> 
      </body>
    </html>
  );
}
