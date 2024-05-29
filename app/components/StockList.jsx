import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import clsx from "clsx";

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
                              <div>
                                {model.split("-").join(" ") +
                                  ` (${mobile.modelname.split(" ")[1]})`}
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="w-1/2 text-center">
                            <Link href={`ProductDetails/${ModelWithSpecs}`}>
                              <div
                                className={clsx("", {
                                  "text-yellow-500": mobile.stock < 5,
                                  "text-red-600": mobile.stock === 0,
                                })}
                              >
                                {mobile.stock}
                              </div>
                            </Link>
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
};

export default StockList;
