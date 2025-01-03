import { ReactNode } from 'react';
import './tool.css';

const Tool = ({title, children}: {title: string, children: ReactNode}) => {
  return (
    <>
      <div className='toolTitle'>{title}</div>
      <div className='toolDetail'>{children}</div>
    </>
  )
}

export default Tool;