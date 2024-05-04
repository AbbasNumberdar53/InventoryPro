import { MongoClient, ObjectId } from "mongodb";

const uri = `mongodb+srv://inventorypro:mbLjufSnU3u7XB0Y@inventorypro.jao9zt5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export async function GET(request, { params }) {
  try {
    const id = params.query;

    if (id !== null) {
      await client.connect();
      console.log("connected to database to get SoldProducts Details...");

      const db = client.db("Products");
      const collection = db.collection("SoldProducts");

      console.log("Fetching product details from SoldProducts...");

      const model = params.query.split("-")[0];
      const specs =
        params.query.split("-")[1] + "/" + params.query.split("-")[2];
      const ModelWithSpecs = model + " " + specs;
      console.log("Fetching product details from AddedProducts...");

      const ProductDetails = await collection.findOne({
        modelname: ModelWithSpecs,
      });

      console.log("Product details fetched successfully!!");

      return new Response(JSON.stringify({ ProductDetails, ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ message: "id is null", ok: false }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error Getting data from MongoDB Database:", error);
    throw new Error("Failed to GET data from MongoDB Database(SoldProducts)");
  }
}
