import "./globals.css";

export const metadata = {
  title: "Task Manager Quadrants",
  description: "Quadrant-based task manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}