import EditArticleClient from './EditArticleClient';

// Firestore에서 동적으로 추가된 글도 수정 가능하도록 dummy 경로 사용
export function generateStaticParams(): { slug: string }[] {
  return [{ slug: 'dummy' }];
}

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  return <EditArticleClient slug={slug} />;
}
