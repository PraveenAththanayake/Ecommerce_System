import Link from "next/link";

export const Logo = () => (
  <div className="flex-shrink-0">
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold">E</span>
      </div>
      <span className="text-xl font-bold hidden sm:block">EStore</span>
    </Link>
  </div>
);
