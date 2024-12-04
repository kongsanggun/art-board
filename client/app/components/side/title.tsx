import './title.css';

const Title = ({title, handler}: {title: string, handler: () => void}) => {
  return (
    <div className='titleRow'>
      <span>{title}</span>
      <div className='buttonInfo' onClick={handler}> i </div>
    </div>
  )
}

export default Title;