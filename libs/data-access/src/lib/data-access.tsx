import styled from 'styled-components';

/* eslint-disable-next-line */
export interface DataAccessProps {}

const StyledDataAccess = styled.div`
  color: pink;
`;

export function DataAccess(props: DataAccessProps) {
  return (
    <StyledDataAccess>
      <h1>Welcome to DataAccess!</h1>
    </StyledDataAccess>
  );
}

export default DataAccess;
