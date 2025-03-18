import { ScrollArea } from "@/components/ui/scroll-area";
import GooglePlayForm from "./components/google-play-form";

export default function Page() {
  return (
    <ScrollArea className="h-full w-full p-2">
      <GooglePlayForm />
    </ScrollArea>
  );
}
