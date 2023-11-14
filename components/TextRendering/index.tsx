import { cleanUrl, getFirstSubdomain } from "@/lib/utils";
import Link from "next/link";
import dynamic from "next/dynamic";
import ProfileMention from "./ProfileMention";
import EventMention from "./EventMention";
const ImageUrl = dynamic(() => import("./Image"), {
  ssr: false,
});
const VideoUrl = dynamic(() => import("./Video"), {
  ssr: false,
});

const urlRegex =
  /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;
const hashtagRegex = /#\b\w+\b/g;
const nostrPrefixRegex = /nostr:[a-z0-9]+/g;

const RenderText = ({ text }: { text?: string }) => {
  if (!text) return null;
  const Elements: JSX.Element[] = [];
  // const usernameRegex = /(?:^|\s)\@(\w+)\b/g;
  const combinedRegex = new RegExp(
    `(${urlRegex.source}|${hashtagRegex.source}|${nostrPrefixRegex.source})`,
    "g",
  );
  // Get Array of URLs
  const specialValuesArray = text.match(combinedRegex);
  const formattedText = text.replace(combinedRegex, "##[link]##");

  const cleanTextArray = formattedText.split("##[link]##");

  cleanTextArray.forEach((string, index) => {
    const jsxElement = <span className="">{string}</span>;
    Elements.push(jsxElement);
    let specialElement;
    if (specialValuesArray?.length && specialValuesArray.length > index) {
      const currentValue = specialValuesArray[index];
      if (currentValue?.match(urlRegex)) {
        console.log("First zSub", getFirstSubdomain(currentValue));
        const subdomain = getFirstSubdomain(currentValue);
        if (!subdomain || subdomain === "www") {
          specialElement = (
            <a
              className="text-primary hover:underline"
              href={cleanUrl(currentValue)}
              target="_blank"
              rel="noreferrer"
            >
              {cleanUrl(currentValue)}
            </a>
          );
        } else if (["m", "i", "image", "flockstr", "cdn"].includes(subdomain)) {
          specialElement = <ImageUrl className="my-1" url={currentValue} />;
        } else if (["v", "video"].includes(subdomain)) {
          specialElement = <VideoUrl className="my-1" url={currentValue} />;
        } else {
          specialElement = (
            <a
              className="text-primary hover:underline"
              href={cleanUrl(currentValue)}
              target="_blank"
              rel="noreferrer"
            >
              {cleanUrl(currentValue)}
            </a>
          );
        }
        // specialElement = <ContentRendering url={specialValuesArray[index]} />;
        // specialElement = <span>{cleanUrl(specialValuesArray[index])}</span>;
      } else if (specialValuesArray[index]?.match(hashtagRegex)) {
        specialElement = (
          <Link href={`/?t=${specialValuesArray[index]?.substring(1)}`}>
            <span className="break-words text-primary hover:underline">
              {specialValuesArray[index]}
            </span>
          </Link>
        );
        // specialElement = <span className="">{specialValuesArray[index]}</span>;
      } else if (specialValuesArray[index]?.match(nostrPrefixRegex)) {
        const mention = specialValuesArray[index]?.split(":")[1];
        if (
          mention &&
          (mention.startsWith("nprofile") || mention.startsWith("npub"))
        ) {
          specialElement = <ProfileMention mention={mention} />;
        } else if (
          mention &&
          (mention.startsWith("nevent") ||
            mention.startsWith("note") ||
            mention.startsWith("naddr"))
        ) {
          specialElement = <EventMention mention={mention} />;
        }
      }
      if (specialElement) {
        Elements.push(specialElement);
      }
    }
  });

  return (
    <>
      {Elements.map((el, index) => (
        <span key={index}>{el}</span>
      ))}
    </>
  );
};

function getUrls(content: string) {
  const urls = content.match(urlRegex)?.map((u) => cleanUrl(u)) ?? [];

  return urls;
}

export { RenderText, getUrls };
