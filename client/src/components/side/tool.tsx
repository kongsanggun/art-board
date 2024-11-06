import { ReactNode } from 'react';
import styled from 'styled-components';

const ToolTitle = styled.div`
  width: fit-content;
  height: fit-content;

  font-size: 1.25rem;
  margin: 0.5rem 0 0.5rem 0;
`;

const ToolDiv = styled.div`
  width: 100%;
  height: 2.5rem;

  background-color: #cecece;

  display: flex;
  flex-direction: row;
  justify-content: start;
`;

const Tool = ({title, children}: {title: String, children: ReactNode}) => {
  return (
    <>
      <ToolTitle>{title}</ToolTitle>
      <ToolDiv>{children}</ToolDiv>
    </>
  )
}

export default Tool;