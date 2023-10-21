import Feed from "@/containers/Feed";
import Spinner from "@/components/spinner";

export default function ProfileFeed({
  pubkey,
  alt,
}: {
  pubkey: string;
  alt?: string;
}) {
  const authors = [pubkey];
  if (alt) {
    authors.push(alt);
  }
  return (
    <div className="center w-full flex-col items-stretch space-y-6 text-primary">
      <Feed
        filter={{
          authors: authors,
          kinds: [1],
        }}
        loader={() => (
          <div className="center flex-col gap-y-4 pt-7 text-center">
            <Spinner />
            <p className="font-medium text-primary">Fetching notes...</p>
          </div>
        )}
      />
    </div>
  );
}
