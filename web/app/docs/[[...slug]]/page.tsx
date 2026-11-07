import type { Metadata } from 'next';
import { DocsClient } from '../DocsClient';
import { DOCS_PAGES } from '../data';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const params: { slug?: string[] }[] = [{ slug: [] }];

  for (const page of DOCS_PAGES) {
    const slugParts = page.path.replace(/^\/docs\/?/, '').split('/').filter(Boolean);
    if (slugParts.length > 0) {
      params.push({ slug: slugParts });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const slugPath = slug.length > 0 ? `/docs/${slug.join('/')}` : '/docs/overview';
  const page = DOCS_PAGES.find((p) => p.path === slugPath) || DOCS_PAGES[0];

  return {
    title: `${page.title} — PaidX Documentation`,
    description: `Official PaidX technical documentation for ${page.title}. Learn about non-custodial NFC payments, ERC-4337 smart accounts, x402 protocol, and ESP32 hardware terminal.`,
    keywords: [
      'PaidX Docs',
      'Crypto POS Documentation',
      'ERC-4337',
      'x402 Protocol',
      'ERC-7715',
      'CardRegistry',
      'ESP32 Terminal',
      page.title,
    ],
    openGraph: {
      title: `${page.title} — PaidX Documentation`,
      description: `Official PaidX documentation: ${page.title}. Non-custodial retail crypto payments and agentic payments over x402.`,
      url: `https://paidx.cc${page.path}`,
      siteName: 'PaidX Docs',
      type: 'article',
    },
  };
}

export default async function DocsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <DocsClient currentSlug={resolvedParams.slug} />;
}
