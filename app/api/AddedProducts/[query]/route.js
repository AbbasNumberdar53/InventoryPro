import { MongoClient, ObjectId } from "mongodb";

const uri = `mongodb+srv://inventorypro:mbLjufSnU3u7XB0Y@inventorypro.jao9zt5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export async function GET(request, { params }) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("connected to database to get data");

    const db = client.db("Products");
    const collection = db.collection("AddedProducts");

    if (params.query === "modelname") {
      //   // Query the collection and project only the desired property
      const output = await collection
        .find(
          {},
          {
            projection: {
              brandname: 1,
              modelname: { $arrayElemAt: [{ $split: ["$modelname", " "] }, 0] },
            },
          }
        )
        .toArray();

      if (output.length === 0) {
        return new Response(JSON.stringify({ output: null, ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ output, ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const model = params.query.split("-").slice(0, -2).join("-");
      const specs = params.query.split("-").slice(-2).join("/")
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
    }
  } catch (error) {
    console.error("Error Getting data from MongoDB Database:", error);
    throw new Error("Failed to GET data from MongoDB Database");
  } finally {
    // Ensure that the client will close when you finish/error
    //await client.close();
  }
}
