import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Train from "@/models/Train";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }

    const trains = await Train.find({ date });

    return NextResponse.json(trains.length ? trains : []); // ✅ Ensures JSON is always returned
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Failed to fetch trains" }, { status: 500 });
  }
}
