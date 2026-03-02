import { redirect } from "next/navigation";

export default function SignInPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = searchParams.next ? `?next=${searchParams.next}` : "";
  redirect(`/login${next}`);
}
