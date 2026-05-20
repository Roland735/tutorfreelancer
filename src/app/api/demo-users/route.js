import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  const query = role ? { role } : {};
  const user = await User.findOne(query).select("email role").sort({ createdAt: -1 });

  if (!user) {
    return Response.json(
      {
        message: role
          ? `No seeded ${role} user found. Run "npm run bootstrap:admin" for admin, rerun the seed script, or create a ${role} account manually.`
          : 'No seeded user found. Rerun the seed script or create a demo account manually.',
      },
      { status: 404 }
    );
  }

  return Response.json({
    email: user.email,
    role: user.role,
    passwordHint: "password123",
  });
}
