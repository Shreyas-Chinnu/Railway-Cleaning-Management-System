import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find().select("-password"); // Exclude password
  return NextResponse.json(users);
}
