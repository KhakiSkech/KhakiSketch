import EditProjectClient from './EditProjectClient';

// Firestore에서 동적으로 추가된 프로젝트도 수정 가능하도록 dummy 경로 사용
export function generateStaticParams(): { id: string }[] {
  return [{ id: 'dummy' }];
}

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  return <EditProjectClient id={id} />;
}
