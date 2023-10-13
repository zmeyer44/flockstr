import AppLayout from './_layout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <AppLayout>
    {children}
   </AppLayout>
  );
}
