// import { NextResponse } from "next/server";
// import { ConnectDB } from "../../../lib/db";
// import Worker from "@/models/Worker";

// export async function GET() {
//   await ConnectDB();
//   const workers = await Worker.find();
//   return NextResponse.json(workers);
// }

// export async function POST(req: Request) {
//   await ConnectDB();
//   const { name, role } = await req.json();
//   const newWorker = new Worker({ name, role });
//   await newWorker.save();
//   return NextResponse.json({ message: "Worker added!" });
// }

// export async function DELETE(req: Request) {
//   await ConnectDB();
//   const { id } = await req.json();
//   await Worker.findByIdAndDelete(id);
//   return NextResponse.json({ message: "Worker removed!" });
// }





import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";  // ✅ Corrected import
import Worker from "@/models/Worker";

export async function GET() {
  try {
    await connectDB();
    const workers = await Worker.find();
    return NextResponse.json(workers);
  } catch (error) {
    console.error("❌ Error fetching workers:", error);
    return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, role } = await req.json();
    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required!" }, { status: 400 });
    }

    const newWorker = new Worker({ name, role });
    await newWorker.save();
    return NextResponse.json({ message: "✅ Worker added successfully!", worker: newWorker });
  } catch (error) {
    console.error("❌ Error adding worker:", error);
    return NextResponse.json({ error: "Failed to add worker" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Worker ID is required!" }, { status: 400 });
    }

    const deletedWorker = await Worker.findByIdAndDelete(id);
    if (!deletedWorker) {
      return NextResponse.json({ error: "Worker not found!" }, { status: 404 });
    }

    return NextResponse.json({ message: "✅ Worker removed successfully!" });
  } catch (error) {
    console.error("❌ Error deleting worker:", error);
    return NextResponse.json({ error: "Failed to remove worker" }, { status: 500 });
  }
}
