import "./globals.css";

export const metadata = {
  title: "Salary Manager",
  description: "Manage employees from a clean DaisyUI-powered frontend.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
