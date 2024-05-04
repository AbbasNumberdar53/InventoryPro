import { MongoClient } from "mongodb";

const uri = `mongodb+srv://inventorypro:mbLjufSnU3u7XB0Y@inventorypro.jao9zt5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export async function GET(request, {params}) {
  try {
    const query = params.query;

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("connected to database to get data");

    const db = client.db("Products");
    const collection = db.collection("AddedProducts");

    var products = [];

    if (query === "empty") {
      products = await collection
        .find({}, { project: { brandname: 1, modelname: 1, stock: 1 } })
        .toArray();
    } else {
      products = await collection
        .aggregate([
          {
            $search: {
              index: "default",
              compound: {
                should: [
                  {
                    autocomplete: {
                      query: query,
                      path: "brandname",
                    },
                  },
                  {
                    autocomplete: {
                      query: query,
                      path: "modelname",
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              brandname: 1,
              modelname: 1,
              stock: 1,
            },
          },
        ])
        .toArray();
    }

    return new Response(JSON.stringify({ products, response: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error Getting data from MongoDB Database:", error);
    throw new Error("Failed to GET searched products from MongoDB Database");
  }
  //   } finally {
  //     // Ensure that the client will close when you finish/error
  //     await client.close();
  //   }
}
