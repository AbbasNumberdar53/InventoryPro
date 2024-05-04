import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import Link from "next/link";

const StockList = ({ data, uniqueBrands }) => {
    return (
        <>
          {data && (
            <div className=" w-full">
              {uniqueBrands.map((brand) => (
                <div key={brand}>
                  <h1 className="font-bold text-l text-blue-500">
                    {brand.toUpperCase()}
                  </h1>
    
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] text-center">
                          Model
                        </TableHead>
                        <TableHead className=" text-center">Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data
                        .filter((d) => d.brandname === brand)
                        .map((mobile) => {
                          const model = mobile.modelname.split(" ")[0];
                          const specs = mobile.modelname
                            .split(" ")[1]
                            .split("/")
                            .join("-");
                          const ModelWithSpecs = `${model}-${specs}`;
    
                          return (
                            <TableRow key={mobile._id} className="grid-cols-2">
                              <TableCell className="font-medium w-1/2 text-center">
                                <Link href={`ProductDetails/${ModelWithSpecs}`}>
                                  {mobile.modelname}
                                </Link>
                              </TableCell>
                              <TableCell className="w-1/2 text-center">
                                <Link href={""}>{mobile.stock}</Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </>
      );
}

export default StockList