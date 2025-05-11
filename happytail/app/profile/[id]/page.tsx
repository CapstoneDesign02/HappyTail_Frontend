export const dynamic = 'force-dynamic';

import ProfilePage from "./ProfilePage";

export default function PageProfile({ params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return <p>로딩 중...</p>;
  }

  return <ProfilePage id={id} />;
}
