"use client";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Avatars() {
  const others = useOthers();
  const self = useSelf();
  const all = [self, ...others];
  return (
    <div className="flex gap-2 items-center">
      <p className="font-light text-sm">Users currently Editing this page</p>
      <div className="flex -space-x-5">
        {all.map((other, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar>
                  <AvatarImage src={other?.info.avatar} />
                  <AvatarFallback>{other?.info.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self.id ? "You" : other?.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
