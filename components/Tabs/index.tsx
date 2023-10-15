import { cn } from "@/lib/utils";

type TabsProps<T> = {
  tabs: T[];
  activeTab: string;
  setActiveTab: (tab: T) => void;
};
export default function Tabs<T extends { name: string; label: string }>({
  tabs,
  activeTab,
  setActiveTab,
}: TabsProps<T>) {
  return (
    <div className="flex items-center justify-between pb-3">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0 text-muted-foreground"
        data-orientation="horizontal"
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab)}
            type="button"
            role="tab"
            aria-selected="true"
            aria-controls="content-preview"
            data-state="active"
            id="trigger-preview"
            className={cn(
              "relative inline-flex h-9 items-center justify-center whitespace-nowrap rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-1 pb-3 pt-2 text-sm font-semibold text-muted-foreground shadow-none ring-offset-background transition-none  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              activeTab === tab.name &&
                "data-[state=active]:border-b-primary data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none",
            )}
            tabIndex={idx}
            data-orientation="horizontal"
            data-radix-collection-item=""
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
