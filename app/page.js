"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import HomeSearchInput from "./components/HomeSearchInput";
import StockList from "./components/StockList";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/Search/empty`);
        if (!response.ok) {
          throw new Error("Response not ok while fetching search query");
        }
        const data = await response.json();
        setData(data.products);
        //console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //SET UNIQUE BRANDS
  var Brands = data.reduce((brand, mobile) => {
    brand.push(mobile.brandname);
    return brand;
  }, []);
  var uniqueBrands = [...new Set(Brands)];


  return (
    <>
      <nav className="flex my-4 justify-around">
        <h1 className="font-bold text-2xl text-blue-500">InventoryPro</h1>

        <button className="mx-10 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-blue-500 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          LogIn
        </button>
      </nav>

      <header className="flex flex-col w-full justify-center items-center">
        <HomeSearchInput setData={setData}/>

        <div className="flex flex-col md:flex-row md:justify-evenly w-[80%]">
          <button className=" my-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
            <Link href={"/BuyProduct"}>Buy Product</Link>
          </button>

          <button className=" my-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
            <Link href={"/SellProduct"}>Sell Product</Link>
          </button>
        </div>
      </header>

      <div className="flex flex-col w-full justify-center items-center">
        <StockList data={data} uniqueBrands={uniqueBrands} />
      </div>
    </>
  );
}
