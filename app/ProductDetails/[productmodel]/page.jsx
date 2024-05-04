"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductDetails({ params }) {
  const [Addedproduct, setAddedProduct] = useState(null);
  const [SoldProduct, setSoldProduct] = useState(null);
//   const model = params.productmodel.split("-")[0];
//   const specs = params.productmodel.split("-")[1] + "/" + params.productmodel.split("-")[2];
//   const ModelWithSpecs = model + " " + specs;

  useEffect(() => {
    const fetchAddedProductDetails = async () => {
      try {
        const response = await fetch(`/api/AddedProducts/${params.productmodel}`);
        if (response.ok) {
          const data = await response.json();
          setAddedProduct(data.ProductDetails);
        } else {
          console.error(
            `Error fetching product details: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Error fetching Product details:", error);
      }
    };

    fetchAddedProductDetails();
  }, [params.productmodel]);

  useEffect(() => {
    const fetchSoldProductDetails = async () => {
      try {
        const response = await fetch(`/api/SoldProducts/${params.productmodel}`);
        if (response.ok) {
          const data = await response.json();
          setSoldProduct(data.ProductDetails);
        } else {
          console.error(
            `Error fetching product details: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Error fetching Product details:", error);
      }
    };

    fetchSoldProductDetails();
  }, [params.productmodel]);

  // if (Addedproduct === null && SoldProduct === null) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="">
      <div className="w-[full] sm:w-[75%] sm:m-auto">
        <input
          type="search"
          id="default-search"
          className="block my-5 w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search..."
        />
      </div>

      {Addedproduct && ( // Check if Addedproduct exists
        <div className=" h-[15rem] content-center w-[full] sm:w-[75%] sm:m-auto">
          <div className=" flex h-[90%] bg-slate-700">
            <div className="flex justify-center items-center  w-[40%] mx-8">
              <p className="bg-slate-300 h-[100%] w-full md:w-[70%] lg:w-[50%] text-center">
                Image
              </p>
            </div>
            <div className=" flex-col w-[60%] items-center">
              <div>
                <h1 className=" text-[#a1bbe0] text-2xl font-bold font-mono">
                  {Addedproduct.brandname.toUpperCase()}
                </h1>
              </div>
              <div className="flex flex-wrap items-center h-[70%]">
                <div className=" mr-10">
                  <h1 className=" text-[#a1bbe0] text-xl font-bold font-mono">
                    Modelname:
                  </h1>
                  <p>{Addedproduct.modelname.split(" ")?.[0]}</p>
                </div>
                <div>
                  <h1 className=" text-[#a1bbe0] text-xl font-bold font-mono">
                    RAM/Storage:
                  </h1>
                  <p>{Addedproduct.modelname.split(" ")?.[1]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-[20rem] w-[full] sm:w-[75%] sm:m-auto flex flex-col">
        <div>
          <h1 className="text-[#a1bbe0] text-xl font-semibol font-sans">
            Purchase History:
          </h1>
        </div>
        <div className="overflow-y-auto h-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">
                  Costprice
                </TableHead>
                <TableHead className=" text-center">Purchasedfrom</TableHead>
                <TableHead className=" text-center">Date</TableHead>
                <TableHead className=" text-center">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Addedproduct &&
                Addedproduct.data &&
                Addedproduct.data.map((mobile) => {
                  var i = 1;

                  return (
                    <TableRow key={mobile.purchasedate} className="grid-cols-2">
                      <TableCell className="font-medium w-1/4 text-center">
                        {mobile.costprice}
                      </TableCell>
                      <TableCell className="w-1/4 text-center">
                        <>{mobile.purchasedfrom}</>
                      </TableCell>
                      <TableCell className="w-1/4 text-center">
                        <>{mobile.purchasedate}</>
                      </TableCell>
                      <TableCell className="w-1/4 text-center">
                        <>{mobile.quantity}</>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="h-[20rem] w-[full] sm:w-[75%] sm:m-auto flex flex-col mt-10">
        <div>
          <h1 className="text-[#a1bbe0] text-xl font-semibol font-sans">
            Sale History:
          </h1>
        </div>
        <div className="overflow-y-auto h-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">
                  Costprice
                </TableHead>
                <TableHead className=" text-center">Purchasedfrom</TableHead>
                <TableHead className=" text-center">Date</TableHead>
                <TableHead className=" text-center">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SoldProduct &&
                SoldProduct.data &&
                SoldProduct.data.map((mobile) => {
                  var i = 1;

                  return (
                    <TableRow key={mobile.purchasedate} className="grid-cols-2">
                      <TableCell className="font-medium w-1/4 text-center">
                        {mobile.sellingprice}
                      </TableCell>
                      <TableCell className="w-1/4 text-center">
                        <>{mobile.soldto}</>
                      </TableCell>
                      <TableCell className="w-1/4 text-center">
                        <>{mobile.soldon}</>
                      </TableCell>
                      <TableCell className="w-1/4 text-center">
                        <>{mobile.quantity}</>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
