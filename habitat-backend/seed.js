// seed.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://mahig1705:Mahi%401705@cluster0.nfeadj3.mongodb.net/habitat?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db("habitat");

    await db.collection("residents").insertMany([
      { _id: "res1", name: "John Doe", flat: "A101", role: "Resident" },
      { _id: "res2", name: "Jane Smith", flat: "B202", role: "Resident" }
    ]);

    await db.collection("bills").insertMany([
      { residentId: "res1", amount: 2000, month: "Oct", status: "unpaid" },
      { residentId: "res2", amount: 1500, month: "Oct", status: "unpaid" }
    ]);

    await db.collection("amenities").insertMany([
      { name: "Clubhouse", slots: ["10AM-12PM", "1PM-3PM"] },
      { name: "Tennis Court", slots: ["6AM-8AM", "8AM-10AM"] }
    ]);

    await db.collection("notices").insertMany([
      { title: "Water Supply", message: "Water off 10AM-2PM", date: new Date() },
      { title: "Elevator Maintenance", message: "Friday 2PM-5PM", date: new Date() }
    ]);

    await db.collection("issues").insertMany([
      { residentId: "res1", title: "Leaking Tap", description: "Kitchen tap leaking", status: "open", date: new Date() }
    ]);

    await db.collection("visitors").insertMany([
      { residentId: "res1", visitorName: "Delivery John", timeIn: new Date(), purpose: "Delivery" }
    ]);

    console.log("All collections created and seeded!");
  } finally {
    await client.close();
  }
}

seed();
