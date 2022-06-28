import styled from 'styled-components';
import { useGetUsersQuery } from '@monorepo/data-access';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  const { data } = useGetUsersQuery();

  return (
    <div>{data && data.user.map((u) => <div key={u.id}>{u.name}</div>)}</div>
  );
}

export default Index;
