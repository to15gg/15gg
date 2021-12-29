import { useRouter } from "next/router";

export default function SearchUsernames() {
  const router = useRouter();
  const rawUsername = (router.query.usernames ?? "") as string;
  const usernames = rawUsername.split(",");

  if (usernames.length === 1) {
    return <div>Search</div>;
  } else {
    return <div>Multi Search</div>;
  }
}
