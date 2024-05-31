import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackgroundBeams } from "@/components/ui/background-beams";

const page = ({ type }) => {
  return (
    <div className="flex min-h-screen items-center justify-center w-full p-10">
      <Card className="w-full md:w-[80%] lg:w-[50%] z-10  flex flex-col items-center bg-transparent border-[4px] border-white">
        <CardHeader>
          <CardTitle>
            {type === "purchase" ? "Purchasing" : "Selling"}
          </CardTitle>
          <CardDescription>
            fill this form whenever you{" "}
            {type === "purchase" ? "purchase" : "sell"} mobile
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full md:w-[80%]">
          <div>
            <Skeleton className={"h-2 mb-4 w-[15%]"} />
            <Skeleton className={"h-10 mb-4"} />
          </div>
          <div>
            <Skeleton className={"h-2 mb-4 w-[15%]"} />
            <Skeleton className={"h-10 mb-4"} />
            <Skeleton className={"h-10 mb-4"} />
          </div>
          <div>
            <Skeleton className={"h-2 mb-4 w-[15%]"} />
            <Skeleton className={"h-10 mb-4"} />
          </div>
          <div>
            <Skeleton className={"h-2 mb-4 w-[15%]"} />
            <Skeleton className={"h-10 mb-4"} />
          </div>
          <div>
            <Skeleton className={"h-2 mb-4 w-[15%]"} />
            <Skeleton className={"h-10 mb-4"} />
          </div>
          <div>
            <Skeleton className={"h-2 mb-4 w-[15%]"} />
            <Skeleton className={"h-10 mb-4"} />
          </div>
          <div>
            <Skeleton className={"h-10 mb-4"} />
          </div>
        </CardContent>
      </Card>
      <BackgroundBeams className={"hidden lg:block"} />
    </div>
  );
};

export default page;
