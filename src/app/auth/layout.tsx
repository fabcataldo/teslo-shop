export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="bg-gray-500 min-h-screen">{children}</main>;
}
