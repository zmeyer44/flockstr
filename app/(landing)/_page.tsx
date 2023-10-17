import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100svh_-_var(--header-height))] p-2 lg:p-5">
      <section className="flex h-full w-full flex-col items-center gap-3">
        <div className="flex h-full w-full flex-col items-center gap-y-12 rounded-[35px] bg-black p-6 pt-20 @container md:p-20 md:py-20">
          <div className="flex flex-col gap-y-6 text-center md:self-start md:pb-4 lg:max-w-md lg:text-left">
            <h1 className="font-condensed text-[11cqw] font-semibold leading-[13cqw] text-zinc-100 sm:text-5xl">
              Your Community, Where ever you are.
            </h1>
            <p className="text-base text-zinc-400 lg:text-base">
              Nostr allows you to truly own your community with a fully
              decentralized social graph. Never get locked into a platform
              again.
            </p>
            <div className="center lg:justify-start">
              <Link href="/app">
                <Button size={"lg"}>Get Started</Button>
              </Link>
            </div>
          </div>
          <div className="h-[1px] w-full shrink-0 bg-zinc-500"></div>
          <div className="mx-auto flex max-w-xl flex-col gap-y-4 text-center md:pt-4">
            <span className="text-sm uppercase tracking-wider text-zinc-400">
              About nostr
            </span>
            <div className="font-condensed space-y-4 font-medium">
              <p className="text-sm text-zinc-300">
                Nostr is a simple, open protocol for decentralizing how
                infomration is stored and retreived on the web.
              </p>
              <p className="text-sm text-zinc-200">
                Rather that your user data being siloed by the big tech
                companies whose platforms dominate our culture, nostr
                distributes data across hundreds of relays that anyone can spin
                up.
              </p>
              <p className="text-sm text-zinc-200">
                This means that no single entity is ever in control of your
                data. In other words:
                <span className="mt-10 block text-3xl font-bold text-primary">
                  No more lock-in, Way more choices.
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* <div className="flex w-full flex-col gap-3 lg:flex-row">
          <div className="flex w-full flex-1 rounded-[35px] bg-zinc-200 p-6 @container">
            <div className="flex flex-col gap-y-6 text-center">
              <span className="uppercase tracking-wider text-zinc-400">
                About nostr
              </span>
              <div className="font-condensed space-y-4 font-medium">
                <p className="text-base text-zinc-800">
                  Nostr is a simple, open protocol for decentralizing how
                  infomration is stored and retreived on the web.
                </p>
                <p className="text-base text-zinc-800">
                  Rather that your user data being siloed by the big tech
                  companies whose platforms dominate our culture, nostr
                  distributes data across hundreds of relays that anyone can
                  spin up.
                </p>
                <p className="text-base text-zinc-800">
                  This means that no single entity is ever in control of your
                  data. In other words:
                  <span className="mt-3 block text-xl font-bold">
                    No more lock-in, Way more choices.
                  </span>
                </p>
              </div>
              <div className="center">
                <Button size={"lg"}>Get Started</Button>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-1 rounded-[35px] bg-primary p-6 @container">
            <div className="flex flex-col gap-y-6 text-center">
              <span className="uppercase tracking-wider text-primary-foreground/80">
                Why Bitcoin?
              </span>
              <div className="font-condensed space-y-4 font-medium">
                <p className="text-base text-zinc-800">
                  Nostr is a simple, open protocol for decentralizing how
                  infomration is stored and retreived on the web.
                </p>
                <p className="text-base text-zinc-800">
                  Rather that your user data being siloed by the big tech
                  companies whose platforms dominate our culture, nostr
                  distributes data across hundreds of relays that anyone can
                  spin up.
                </p>
                <p className="text-base text-zinc-800">
                  This means that no single entity is ever in control of your
                  data. In other words:
                  <span className="mt-3 block text-xl font-bold">
                    No more lock-in, Way more choices.
                  </span>
                </p>
              </div>
              <div className="center">
                <Button size={"lg"} variant={"secondary"}>
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center rounded-[35px] bg-zinc-500 p-6 pt-10 @container lg:justify-start lg:p-10 lg:py-16 lg:pt-20">
          <div className="flex flex-col gap-y-6 text-center lg:max-w-md lg:text-left">
            <h1 className="font-condensed text-[11cqw] font-semibold leading-[13cqw] text-zinc-100 sm:text-5xl">
              Find out if you're the right fit.
            </h1>
            <p className="text-sm text-zinc-200 lg:text-base">
              Nostr allows you to truly own your community with a fully
              decentralized social graph. Never get locked into a platform
              again.
            </p>
            <div className="center lg:justify-start">
              <Button size={"lg"}>Contact Us</Button>
            </div>
          </div>
        </div> */}
      </section>
      {/* <section className="mt-10 w-full">
        <div className="overflow-hidden pt-32 sm:pt-14">
          <div className="bg-zinc-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative pb-16 pt-48 sm:pb-24">
                <div>
                  <h2
                    id="sale-heading"
                    className="text-4xl font-bold tracking-tight text-white md:text-5xl"
                  >
                    It's about time
                    <br />
                    Let's take a look.
                  </h2>
                  <div className="mt-6 text-base">
                    <Link href="/app" className="font-semibold text-white">
                      Explore Now
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                </div>

                <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                  <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                    <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                      <div className="flex-shrink-0">
                        <img
                          className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"
                          alt=""
                        />
                      </div>

                      <div className="mt-6 flex-shrink-0 sm:mt-0">
                        <img
                          className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                      <div className="flex-shrink-0">
                        <img
                          className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-01.jpg"
                          alt=""
                        />
                      </div>

                      <div className="mt-6 flex-shrink-0 sm:mt-0">
                        <img
                          className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-02.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                      <div className="flex-shrink-0">
                        <img
                          className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"
                          alt=""
                        />
                      </div>

                      <div className="mt-6 flex-shrink-0 sm:mt-0">
                        <img
                          className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
