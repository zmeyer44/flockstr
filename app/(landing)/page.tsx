import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Trusted users on Nostr", value: "111,597" },
  { label: "Satoshis Zapped", value: "1.2 billion" },
  { label: "Active relays", value: "1,915" },
];
export default function LandingPage() {
  return (
    <main className="pb-20">
      <div className="relative isolate">
        <svg
          className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-zinc-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-zinc-50">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          />
        </svg>
        <div
          className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          aria-hidden="true"
        >
          <div
            className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-primary to-primary opacity-30"
            style={{
              clipPath:
                "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
            }}
          />
        </div>
        <div className="overflow-hidden pb-20">
          <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 sm:pt-40 lg:px-8 lg:pt-16">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
                  Own your Events.
                  <br /> Only on Nostr.
                </h1>
                <p className="relative mt-6 text-lg leading-8 text-zinc-600 sm:max-w-md lg:max-w-none">
                  We're bringing events and meet ups onto Nostr. The days of
                  walled gardens are coming to an end. It's time to truly own
                  your events, no-longer dependent on an external company.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link href="/explore">
                    <Button size={"lg"} className="rounded-sm">
                      Start Exploring
                    </Button>
                  </Link>

                  {/* <a
                    href="#"
                    className="text-sm font-semibold leading-6 text-zinc-900"
                  >
                    Live demo <span aria-hidden="true">→</span>
                  </a> */}
                </div>
              </div>
              <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                  <div className="relative">
                    <img
                      src="https://flockstr.s3.amazonaws.com/uploads/Screenshot+2023-11-04+at+11.45.48+AM.png"
                      alt=""
                      className="aspect-[5/7] w-full rounded-xl bg-zinc-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10" />
                  </div>
                </div>
                <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                  <div className="relative">
                    <img
                      src="https://flockstr.s3.amazonaws.com/uploads/Screenshot+2023-11-04+at+11.44.49+AM.png"
                      alt="Nostrville"
                      className="aspect-[5/7] w-full rounded-xl bg-zinc-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10" />
                  </div>
                  <div className="relative">
                    <img
                      src="https://flockstr.s3.amazonaws.com/uploads/Screenshot+2023-11-04+at+11.45.00+AM.png"
                      alt=""
                      className="aspect-[5/7] w-full rounded-xl bg-zinc-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10" />
                  </div>
                </div>
                <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                  <div className="relative">
                    <img
                      src="https://flockstr.s3.amazonaws.com/uploads/Screenshot+2023-11-04+at+11.45.55+AM.png"
                      alt="Pubkey"
                      className="aspect-[5/7] w-full rounded-xl bg-zinc-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10" />
                  </div>
                  <div className="relative">
                    <img
                      src="https://flockstr.s3.amazonaws.com/uploads/Screenshot+2023-11-04+at+11.45.08+AM.png"
                      alt=""
                      className="aspect-[5/7] w-full rounded-xl bg-zinc-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Why Nostr
          </h2>
          <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
              <p className="text-xl leading-8 text-zinc-600">
                The internet is changing. We have shifted from the open frontier
                of "The Network" to a series of walled gardens hording userdata
                to best monetize their engagement. Nostr breaks down these
                walls, your data follows you wherever you decide to go.
              </p>
              <div className="mt-10 max-w-xl text-base leading-7 text-zinc-700">
                <p>
                  This is often portrayed as a defense against the censorious
                  Big Tech company. But, it means so much more. It means having
                  the freedom to move to a different platform for reasons as
                  simple as preferring the UI, or maybe just exploring a new
                  feature.
                </p>
                <p className="mt-10">
                  Switching from one platform to another is as effortless as
                  comparing sports scores on different websites. The underlying
                  data is the same; you just now have the power to decide how it
                  is presented to you.
                </p>
              </div>
            </div>
            <div className="lg:flex lg:flex-auto lg:justify-center">
              <dl className="w-64 space-y-8 xl:w-80">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col-reverse gap-y-4"
                  >
                    <dt className="text-base leading-7 text-zinc-600">
                      {stat.label}
                    </dt>
                    <dd className="text-5xl font-semibold tracking-tight text-zinc-900">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
