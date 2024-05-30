"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { toast } from "sonner";
import { getModelsName } from "../actions/getmodelsname";

export const formSchema = z.object({
  brandname: z.enum(["samsung", "nokia", "realme", "oneplus", "redmi", "moto"]),
  modelname: z.string().min(1, { message: "field is empty" }),
  sellingprice: z
    .string()
    .min(1, { message: "field is empty" })
    .refine((val) => !isNaN(val), { message: "value must be a number" }),
  soldto: z.string().min(1, { message: "field is empty" }),
  soldon: z.string().optional(),
  quantity: z
    .string()
    .min(1, { message: "field is empty" })
    .refine((val) => !isNaN(val), { message: "value must be a number" }),
  storage: z.enum(["32GB", "64GB", "128GB", "256GB"]),
  ram: z.enum([ "3GB", "4GB", "6GB", "8GB", "12GB"]),
});
const resolver = zodResolver(formSchema);

//MAin Component
const SellProductForm = () => {
  const [Modelnames, setModelnames] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([])

  const options = {
    timeZone: "Asia/Kuwait", // Set the time zone to Kuwait's timezone
    timeZoneName: "short", // Display the time zone abbreviation
    hour12: false, // Use 24-hour format
  };
  

  const form = useForm({
    resolver: resolver,
    defaultValues: {
      brandname: "samsung",
      soldon: new Date().toLocaleString("en-US", options),
    },
  });

  //Watch brandname,storage and ram input
  var brandname = form.watch("brandname");
  var storage = form.watch("storage");
  var ram = form.watch("ram");

  //Fetching all modelnames /api/AddedProducts/modelname
  useEffect(() => {
    const fetchModelNames = async () => {
      setIsLoading(true);
      const response = await getModelsName(brandname);
      //console.log(models)

      if (response.uniquemodels.length === 0) {
        form.setValue("modelname", "");
        setModelnames([]);
      } else {
        //Set Modelnames state
        setModelnames(response.uniquemodels);
        setBrands(response.uniquebrands)

        // Set default value of modelname to the first element of the modelname array of output object
        form.setValue("modelname", response.uniquemodels[0] ?? "");
        form.setValue("brandname", brandname);
      }

      setIsLoading(false);
    };

    if (brandname) {
      fetchModelNames();
    }
  }, [brandname, form.formState.isSubmitSuccessful]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`/api/SoldProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Data inserted successfully:", responseData);
        toast.success("Form submitted successfully");
      } else {
        const responseData = await response.json();
        console.error(
          `failed to add product, Message: ${responseData.message}`
        );
        console.error(response.ok);
        toast.error("Error while submitting the form");
      }
    } catch (error) {
      console.error(error);
    }
    //toast.success("Form submitted successfully");
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        brandname: brandname,
        sellingprice: "",
        soldto: "",
        soldon: new Date().toLocaleString("en-US", options),
        quantity: "",
        storage: storage,
        ram: ram,
      });
    }
  }, [form.formState.isSubmitSuccessful]);

  return (
    <div className="flex min-h-screen items-center justify-center w-full p-10">
      <Card className="w-full md:w-[80%] lg:w-[50%] z-10  flex flex-col items-center bg-transparent border-[4px] border-white">
        <CardHeader>
          <CardTitle>Selling</CardTitle>
          <CardDescription>
            fill this form whenever you sell mobile
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full md:w-[80%]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              id="form"
            >
              <FormField
                control={form.control}
                name="brandname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {
                        brands.map( brand => (

                          <SelectItem value={brand} key={brand}>{brand.toUpperCase()}</SelectItem>
                        ))
                      }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {IsLoading ? (
                <Input placeholder="Loading..." disabled/>
              ) : (
                <FormField
                  control={form.control}
                  name="modelname"
                  key={1}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Modelnames.map((data) => (
                            <SelectItem key={data} value={data}>
                              {data.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* <FormField
                name="modelname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Model Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                name="sellingprice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cost of Single Piece"
                        type="string"
                        {...field}
                        // onChange={handleCostPriceChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="soldto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sold to</FormLabel>
                    <FormControl>
                      <Input placeholder="Supplier's Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="soldon"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="date" className="hidden" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="No. of Pieces Buying"
                        type="string"
                        inputMode="numeric"
                        {...field}
                        //onChange={handleQuantityChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // control={form.control}
                name="storage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="64GB / 128GB / 256GB" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="32GB">32GB</SelectItem>
                        <SelectItem value="64GB">64GB</SelectItem>
                        <SelectItem value="128GB">128GB</SelectItem>
                        <SelectItem value="256GB">256GB</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // control={form.control}
                name="ram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAM</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="6GB / 8GB / 12GB" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="3GB">3GB</SelectItem>
                        <SelectItem value="4GB">4GB</SelectItem>
                        <SelectItem value="6GB">6GB</SelectItem>
                        <SelectItem value="8GB">8GB</SelectItem>
                        <SelectItem value="12GB">12GB</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.isSubmitting ? (
                <Button type="submit" className="w-full" disabled>
                  <svg
                    aria-hidden="true"
                    className="inline mr-5 w-6 h-6 animate-spin fill-blue-500 text-black"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  Submitting...
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      <BackgroundBeams className = {"hidden lg:block"}/>
    </div>
  );
};

export default SellProductForm;
