import styled from 'styled-components';

const TitleRow = styled.div`
  width: 100%;
  height: fit-content;
  font-size: 1.75rem;

  margin-bottom: 1rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`;

const ButtonInfo = styled.div`
  width: 1.75rem;
  height: 1.75rem;
  background-color: #c5c5c5;

  font-size: 1rem;

  border-radius: 100%;
`;

const Title = ({title}: {title: String}) => {
  return (
    <TitleRow>
      <span>{title}</span>
      <ButtonInfo/>
    </TitleRow>
  )
}

export default Title;