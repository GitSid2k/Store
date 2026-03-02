import { redirect } from "next/navigation";

export default function CatalogSlugRedirect({ params }: { params: { slug: string } }) {
  redirect(`/product/${params.slug}` as never);
}
