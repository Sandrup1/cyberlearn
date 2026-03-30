import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cyberlearn");

    // 1. Find the user
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return Response.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // 3. Success (For now, we just return success. Later you'll add JWT/Sessions)
    return Response.json({ 
      message: "Login successful",
      user: { name: user.name, email: user.email } 
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}