import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = `mongodb+srv://inventorypro:mbLjufSnU3u7XB0Y@inventorypro.jao9zt5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export async function GET(request) {
  // try {

  //   // Connect the client to the server (optional starting in v4.7)
  //   await client.connect();
  //   console.log("connected to database to get data");

  //   const db = client.db("Products");
  //   const collection = db.collection("AddedProducts");

  //   if(query === "getAllProducts"){

  //       console.log("Fetching the data to display on dashboard...");

  //       const data = await collection.find({}, { projection: { brandname: 1, modelname: 1, stock: 1 } }).toArray();

  //       console.log("Fetched data successfully...");

  //       return new Response(JSON.stringify({ data, ok: true }), {
  //           status: 200,
  //           headers: { "Content-Type": "application/json" },
  //         });
  //   }else if(id !== null){
  //       console.log("Fetching product details from AddedProducts...");

  //       const ProductDetails = await collection.findOne({modelname: id});

  //       console.log("Product details fetched successfully!!");

  //       return new Response(JSON.stringify({ ProductDetails, ok: true }), {
  //           status: 200,
  //           headers: { "Content-Type": "application/json" },
  //         });

  //   }
  // } catch (error) {
  //   console.error("Error Getting data from MongoDB Database:", error);
  //   throw new Error("Failed to GET data from MongoDB Database");
  // } finally {
  //   // Ensure that the client will close when you finish/error
  //   await client.close();
  // }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    //console.log(body);

    const modelname = removeWhitespaceAndCapitalize(body.modelname);

    const insertdata = {
      brandname: body.brandname,
      modelname: `${modelname} ${body.ram}/${body.storage}`,
      stock: parseInt(body.quantity),
      data: [
        {
          costprice: body.costprice,
          purchasedfrom: body.purchasedfrom,
          purchasedate: body.purchasedate,
          quantity: body.quantity,
        },
      ],
    };

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("connected to database to add data");

    const db = client.db("Products");
    const collection = db.collection("AddedProducts");
    const insert = await collection.insertOne(insertdata);
    const id = insert.insertedId;
    return new Response(JSON.stringify({ id, ok: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    throw new Error("Failed to insert data into MongoDB");
  } finally {
    // Ensure that the client will close when you finish/error
    //await client.close();
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    // // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("connected to database to Update data");

    const db = client.db("Products");
    const collection = db.collection("AddedProducts");

    if (Object.keys(body).length !== 0) {
      // Assuming removeWhitespaceAndCapitalize is defined elsewhere
      var model = removeWhitespaceAndCapitalize(body.modelname);
      model = `${model} ${body.ram}/${body.storage}`;
      const findmodel = await collection.findOne({ modelname: model });

      if (findmodel !== null) {
        const newDataObject = {
          costprice: body.costprice,
          purchasedfrom: body.purchasedfrom,
          purchasedate: body.purchasedate,
          quantity: body.quantity,
        };

        const updateResult = await collection.updateOne(
          { modelname: model },
          {
            $push: { data: newDataObject },
            $inc: { stock: parseInt(body.quantity) },
          }
        );

        if (updateResult.modifiedCount === 0) {
          return new Response(
            JSON.stringify({ message: "Unable to update the data", ok: false }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } else {
        const newDataObject = {
          brandname: body.brandname,
          modelname: model,
          stock: parseInt(body.quantity),
          data: [
            {
              costprice: body.costprice,
              purchasedfrom: body.purchasedfrom,
              purchasedate: body.purchasedate,
              quantity: body.quantity,
            },
          ],
        };

        const insert = await collection.insertOne(newDataObject);
        if (!insert.insertedId) {
          return new Response(
            JSON.stringify({
              message: "Unable to POST data to Addproducts via PUT request",
              ok: false,
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Resource found and updated", ok: true }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updatting data into AddedProducts:", error);
    throw new Error("Failed to update data into AddedProducts");
  } finally {
    // Ensure that the client will close when you finish/error
    //await client.close();
  }
}

function removeWhitespaceAndCapitalize(str) {
  // Split the string into an array of words
  const words = str.split(/\s+/);

  // Capitalize the first letter of each word and remove whitespace
  const modifiedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the modified words into a single string
  const result = modifiedWords.join("");

  return result;
}
