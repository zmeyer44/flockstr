import LandingLayout from "./_layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandingLayout>{children}</LandingLayout>;
}
