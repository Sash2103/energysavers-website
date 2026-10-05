import Shell from '@/components/site/Shell';
import { allSlugs, buildPage, pageTitle } from '@/lib/pages';

// Every inner page and blog post, at the old site's addresses (/ahf/, /hospitality/, /blog/, …).
// Only these are generated; any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return allSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = buildPage(slug);
  return { title: pageTitle(page.title), description: page.description };
}

export default async function InnerPage({ params }) {
  const { slug } = await params;
  const page = buildPage(slug);
  return (
    <Shell top={page.top} current={slug} contact={page.contact} extra={page.extra}>
      {page.main}
    </Shell>
  );
}
