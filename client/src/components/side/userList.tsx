import styled from 'styled-components';

const User = styled.div`
  width: 100%;
  height: auto;
  font-size: 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-content: center;
  align-items: center;
`;

const Total = styled.div`
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  text-align: start;
  width: 100%;

  border-bottom: #000000 2px solid;
`

const Info = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: start;
  width: 100%;
`

const UserList = ({userList}: {userList: String[]}) => {
  return (
    <User>
      <Total>접속자 수 : {userList.length}</Total>
      {userList.map((item : any) => {
          return (<Info key="">{item}</Info>)
      })}
    </User>
  )
}

export default UserList;