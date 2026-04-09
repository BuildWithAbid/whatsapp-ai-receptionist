export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_26%)]" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
