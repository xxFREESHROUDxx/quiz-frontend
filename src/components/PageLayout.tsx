import type { FunctionComponent, ReactNode } from "react";
import Navbar from "./Navbar";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: FunctionComponent<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default PageLayout;
