import './title.css';

const Title = ({title, handler}: {title: string, handler: any}) => {
  return (
    <div className='titleRow'>
      <span>{title}</span>
      <div className='buttonInfo' onClick={handler}/>
    </div>
  )
}

export default Title;