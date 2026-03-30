import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // 1. Get data
    const { name, email, password } = await req.json();

    // 2. Validate input
    if (!name || !email || !password) {
      return Response.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    // 3. Pre-connection check (Fail fast if DB is down)
    let client;
    try {
      // If this fails, it jumps straight to the inner catch
      client = await clientPromise;
      // Optional: Verify connection is actually alive
      await client.db("admin").command({ ping: 1 });
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return Response.json(
        { message: "Database connection unavailable. Please check your network/IP whitelist." },
        { status: 503 } // 503 = Service Unavailable
      );
    }

    const db = client.db("cyberlearn");

    // 4. Check existing user
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return Response.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 5. Hash password (Only happens if DB is confirmed connected)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Save user
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return Response.json(
      { message: "Signup successful" },
      { status: 201 }
    );

  } catch (error) {
    console.error("General API Error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}