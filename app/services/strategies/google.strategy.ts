import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { prisma } from "~/db.server";


const getCallback = (provider: string) => {
  const baseUrl = process.env.REDIRECT_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/auth/${provider}/callback`
}

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: getCallback(SocialsProvider.GOOGLE),
  },
  async ({ profile }) => {
    const user = await prisma.user.upsert({
      where: {
        email: profile.emails![0].value,
      },
      update: {
        googleId: profile.id,
      },
      create: {
        email: profile.emails![0].value,
        name: profile.displayName,
        avatarUrl: profile.photos![0].value,
        googleId: profile.id,
      },
    });
    return user;
  }
);