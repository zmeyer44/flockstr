"use client";
import Template from "./Template";
import { RxShare2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";

export default function PWAInstallModal() {
  const steps = [
    {
      slug: "share-btn",
      content: (
        <>
          Tap <RxShare2 className="mx-1.5 h-5 w-5" /> in your browser below
        </>
      ),
    },
    {
      slug: "add-to-home",
      content: (
        <>
          Select &quot;Add to Home Screen <CgAddR className="ml-1.5 h-5 w-5" />
          &quot;
        </>
      ),
    },
    {
      slug: "pop-up",
      content: <>When a popup appears, click &quot;Add&quot;</>,
    },
  ];
  return (
    <Template title="Install PWA" className="md:max-w-[400px]">
      <ul role="list" className="-mx-2 mt-2 space-y-1">
        {steps.map((step, i) => (
          <li key={i}>
            <div className="group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-[0.625rem] font-medium text-muted-foreground">
                {i + 1}
              </span>
              <span className="flex items-center truncate">{step.content}</span>
            </div>
          </li>
        ))}
      </ul>
    </Template>
  );
}
