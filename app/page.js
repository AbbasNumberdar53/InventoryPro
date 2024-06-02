"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import HomeSearchInput from "./components/home/HomeSearchInput";
import StockList from "./components/home/StockList";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/Search/empty`);
      if (!response.ok) {
        throw new Error("Failed to fetch data. Please try again later.");
      }
      const data = await response.json();
      setData(data.products);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const uniqueBrands = [...new Set(data.map((mobile) => mobile.brandname))];

  return (
    <>
      <header className="flex flex-col w-full justify-center items-center">
        <HomeSearchInput setData={setData} />

        <div className="flex flex-col md:flex-row md:justify-evenly w-[80%]">
          <ButtonLink href={"/BuyProduct"}>Buy Product</ButtonLink>
          <ButtonLink href={"/SellProduct"}>Sell Product</ButtonLink>
        </div>
      </header>

      <div className="flex flex-col w-full justify-center items-center">
        <StockList data={data} uniqueBrands={uniqueBrands} />
      </div>
    </>
  );
}

// Button component with link
const ButtonLink = ({ href, children }) => (
  <button className="my-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
    <Link href={href}>{children}</Link>
  </button>
);
