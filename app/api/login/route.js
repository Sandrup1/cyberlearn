import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    // Hardcoded admin login
    if (email.toLowerCase() === "admin@gmail.com" && password === "root") {
      return Response.json({ 
        message: "Login successful",
        user: { 
          name: "Administrator", 
          email: "admin@gmail.com",
          role: "Admin",
          title: "System Administrator"
        } 
      }, { status: 200 });
    }

    const client = await clientPromise;
    const db = client.db("cyberlearn");

    //Find the user
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return Response.json({ message: "Invalid email or password" }, { status: 401 });
    }

    //Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json({ message: "Invalid email or password" }, { status: 401 });
    }

    //if success
    return Response.json({ 
      message: "Login successful",
      user: { name: user.name, email: user.email } 
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
