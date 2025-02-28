import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex space-x-2 items-center animate pulse">
      <ArrowLeftCircle className="w-10 h-10 text-gray-400" />
      <h2 className="font-bold">Get started with creating a New Document</h2>
    </div>
  );
}
