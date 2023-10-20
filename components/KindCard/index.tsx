"use client";

import { type ComponentType } from "react";
import dynamic from "next/dynamic";
import { type Event } from "nostr-tools";

const KindCard1 = dynamic(() => import("./1"), {
  ssr: false,
});
const KindCard3745 = dynamic(() => import("./3745"), {
  ssr: false,
});
const KindCard30023 = dynamic(() => import("./30023"), {
  ssr: false,
});
const KindCard30311 = dynamic(() => import("./30311"), {
  ssr: false,
});
const KindCardDefault = dynamic(() => import("./default"), {
  ssr: false,
});

const componentMap: Record<number, ComponentType<KindCardProps>> = {
  1: KindCard1,
  3745: KindCard3745,
  30023: KindCard30023,
  30311: KindCard30311,
};

export type KindCardProps = Event<number> & {
  locked?: boolean;
};
export default function KindCard(props: KindCardProps) {
  const { kind } = props;
  const KindCard_ = componentMap[kind] ?? KindCardDefault;
  return <KindCard_ {...props} />;
}
