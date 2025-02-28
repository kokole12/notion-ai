"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BreadCrumbs() {
  const pathName = usePathname();
  const segments = pathName.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          if (!segment) return null;

          const href = `${segments.slice(0, index + 1).join("/")}`;

          return (
            <>
              <BreadcrumbSeparator />

              <BreadcrumbItem key={index}>
                <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
