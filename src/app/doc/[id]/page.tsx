import Document from "@/app/components/Document";

export default function DocumentPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
    </div>
  );
}
