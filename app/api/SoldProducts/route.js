import { MongoClient } from "mongodb";

const uri = `mongodb+srv://inventorypro:mbLjufSnU3u7XB0Y@inventorypro.jao9zt5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export async function POST(request) {
  try {
    const body = await request.json();
    //console.log(body);

    // Validate input fields
    if (!validateInput(body)) {
      console.error("Invalid input data");
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    var model = removeWhitespaceAndCapitalize(body.modelname);
    model = `${model} ${body.ram}/${body.storage}`;

    const insertdata = {
      brandname: body.brandname,
      modelname: model,
      data: [
        {
          sellingprice: body.sellingprice,
          soldto: body.soldto,
          soldon: body.soldon,
          quantity: body.quantity,
        },
      ],
    };

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("Connected to database to add data");

    const db = client.db("Products");

    // SUBTRACT THE STOCK VALUE FROM AddedProducts

    const addedProductsCollection = db.collection("AddedProducts");

    console.log("Updating stocks...");

    const updatestock = await addedProductsCollection.updateOne(
      { brandname: body.brandname, modelname: model },
      {
        $inc: { stock: -parseInt(body.quantity) },
      }
    );

    if (updatestock.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Unable to update stock", ok: false }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      //INSERT DOCUMENT TO SoldProducts
      const soldProductsCollection = db.collection("SoldProducts");
      const findmodel = await soldProductsCollection.findOne({
        modelname: insertdata.modelname,
      });
      if (findmodel === null) {
        console.log("inserting data to soldproducts...");
        const insertResult = await soldProductsCollection.insertOne(insertdata);
        if (!insertResult.insertedId) {
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
      } else {
        console.log("Updating data to soldproducts...");
        const updateResult = await soldProductsCollection.updateOne(
          { modelname: model },
          {
            $push: { data: insertdata.data[0] },
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
      }
    }

    return new Response(
      JSON.stringify({
        message: "data inserted and stock Updated successfully",
        ok: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    throw new Error("Failed to insert data into MongoDB");
  }
  // } finally {
  //   // Ensure that the client will close when you finish/error
  //   await client.close();
  // }
}

function validateInput(body) {
  if (
    !body.brandname ||
    !body.modelname ||
    !body.ram ||
    !body.storage ||
    !body.sellingprice ||
    !body.soldto ||
    !body.soldon ||
    !body.quantity
  ) {
    return false;
  }
  return true;
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
