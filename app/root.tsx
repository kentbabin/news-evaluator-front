import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Navbar } from "./components/navbar";

export const links: Route.LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.png",
    type: "image/png",
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="text-gray-900">
      <head>
        <title>News Article Evaluator | Operation: PLUTO</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        {/* ---- Main content ---- */}
        <main className="py-12 min-h-screen bg-gray-50">{children}</main>

        {/* ---- Footer ---- */}
        <footer className="bg-white text-gray-600 text-sm shadow">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <p>© {new Date().getFullYear()} Operation: PLUTO</p>
            <p className="text-xs">
              &nbsp;
            </p>
          </div>
        </footer>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
