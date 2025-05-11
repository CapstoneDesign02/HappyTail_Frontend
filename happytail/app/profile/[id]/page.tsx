export const dynamic = 'force-dynamic';

import ProfilePage from "./ProfilePage";

interface PageProps {
  params: {
    id: string;
  };
}

export default async  function PageProfile({ params }: PageProps) {
  const id = params.id;

  if (!id) {
    return <p>로딩 중...</p>;
  }

  return <ProfilePage id={id} />;
}
