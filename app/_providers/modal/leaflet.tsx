import { useEffect, useRef, ReactNode, Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Leaflet({
  setShow,
  children,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) {
  const leafletRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const transitionProps = { type: "spring", stiffness: 500, damping: 30 };
  useEffect(() => {
    void controls.start({
      y: 20,
      transition: transitionProps,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDragEnd(
    _: any,
    info: {
      delta: { x: number; y: number };
      offset: { x: number; y: number };
      point: { x: number; y: number };
      velocity: { x: number; y: number };
    },
  ) {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const height = leafletRef.current?.getBoundingClientRect().height || 0;
    if (offset > height / 2 || velocity > 800) {
      await controls.start({ y: "100%", transition: transitionProps });
      setShow(false);
    } else {
      void controls.start({ y: 0, transition: transitionProps });
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={leafletRef}
        key="leaflet"
        className="standalone-pb-8 group fixed  inset-x-0 bottom-0 z-modal max-h-[95vh] w-screen cursor-grab rounded-t-lg border border-b-0 bg-background pb-5 active:cursor-grabbing sm:hidden"
        initial={{ y: "100%" }}
        animate={controls}
        exit={{ y: "100%" }}
        transition={transitionProps}
        drag="y"
        dragDirectionLock
        onDragEnd={(_, i) => void handleDragEnd(_, i)}
        dragElastic={{ top: 0, bottom: 1 }}
        dragConstraints={{ top: 0, bottom: 0 }}
      >
        <div
          className={cn(
            "rounded-t-4xl z-modal -mb-1 flex h-7 w-full items-center justify-center",
          )}
        >
          <div className="-mr-1 h-1 w-6 rounded-full bg-muted transition-all group-active:rotate-12" />
          <div className="h-1 w-6 rounded-full bg-muted transition-all group-active:-rotate-12" />
        </div>
        <div className="bottom-tabs scrollbar-muted-foreground max-h-[calc(95vh_-_28px)] w-full overflow-y-auto pb-5 scrollbar-track-background">
          {children}
        </div>
      </motion.div>
      <motion.div
        key="leaflet-backdrop"
        className="fixed inset-0 z-overlay bg-background/40 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShow(false)}
      />
    </AnimatePresence>
  );
}
