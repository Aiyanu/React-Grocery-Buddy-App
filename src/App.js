import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return []
  }
}

function App() {
  const [name,setName] = useState("")
  const [list,setList] = useState(getLocalStorage())
  const [isEditing,setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert,setAlert] = useState({
    show:false,
    msg:'',
    type:""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!name){
      //display alert
      showAlert(true,"please ender value","danger")
      setAlert({
        show:true,
        msg:"please Enter value",
        type:"danger"
      })
    }
    else if (name && isEditing){
      //deal with edit
      setList(list.map((item)=>{
        if(item.id === editID){
          return {...item,title:name}
        }
        return item
      }))
      setName("")
      setEditID(null)
      setIsEditing(false)
      showAlert(true,"Item Updated", "success")
    }
    else{
      //show alert
      showAlert(true,"Item added ","success")
      const newItem = {id: new Date().getTime().toString(),title:name}
      setList([...list,newItem]);
      setName("")
    }
  }
  const clearList = ()=>{
    showAlert(true,"emptied list","danger")
    setList([]);
  }

  const showAlert=(show=false,msg="",type="")=>{
    setAlert({show,msg,type})
  }

  const removeItem = (id) =>{
    showAlert(true,"item  removed","danger")
    setList(list.filter((item)=>item.id!==id))
  }

  const editItem = (id) => {
    const specificItem=list.find((item)=>item.id === id)
    setIsEditing(true);
    setEditID(id)
    setName(specificItem.title)
  }

  useEffect(()=>{
    localStorage.setItem("list",JSON.stringify(list))
  },[list])

  return <section className='section-center'>
    <form action="" onSubmit={handleSubmit}>
      {alert.show && <Alert list={List} {...alert} removeAlert={showAlert}/>}
      <h3>grocery bud</h3>
      <div className="form-control">
        <input 
        type="text" 
        className='grocery'
        placeholder='e.g. eggs'
        value={name}
        onChange={(e)=>setName(e.target.value)}/>
        <button 
          className="submit-btn" 
          type='submit'>
          {isEditing ? "edit" : "submit"}
        </button>
      </div>
    </form>
    {list.length > 0 && (
      <div className="grocery-container">
        <List editItem={editItem} removeItem={removeItem} items= {list}/>
        <button 
        onClick={clearList}
        className="clear-btn">
          clear items
        </button>
      </div>
    )}
  </section>
}

export default App
