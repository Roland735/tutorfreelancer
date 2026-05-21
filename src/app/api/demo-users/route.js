import dbConnect from "@/lib/db";
import User from "@/models/User";

const DEMO_EMAIL_BY_ROLE = {
  admin: "admin@tutorfreelance.demo",
  student: "student@tutorfreelance.demo",
  tutor: "tutor@tutorfreelance.demo",
};

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  const demoEmail = role ? DEMO_EMAIL_BY_ROLE[role] : null;
  const query = demoEmail ? { email: demoEmail, role } : {};
  const user = await User.findOne(query).select("email role");

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
