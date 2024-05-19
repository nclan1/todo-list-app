import { useState, useEffect } from 'react'
import { FaPlus } from './react-icons/fa';

import './App.css'
import Navbar from './navbar/navbar'
import Footer from './footer/footer'
import Quote from './quote/quote'
import Task from './task/task'


//TODO: add delete and complete animation
function App() {

  const [tasks, setTasks] = useState([
  ])

  const [taskinput, setTaskInput] = useState('')

  function addTask() {
    if (taskinput === '') return

    //initiates a http post request to endpoint add-todo
    //endpoint just defines the functionality and the action
    //to be performed
    fetch('https://todo-list-app-production-86fe.up.railway.app/add-todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: taskinput })
    }).then(res => console.log(res))

    setTasks([...tasks, taskinput])
    setTaskInput('')
  }


  function delTask(index) {
    //create new array 'newTasks' and copies task into it
    let newTasks = [...tasks]
    //splice functions just remove the index
    newTasks.splice(index, 1)
    fetch('https://todo-list-app-production-86fe.up.railway.app/delete-todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: tasks[index] })
    }).then(res => console.log(res))

    setTasks(newTasks)
  }

  useEffect(() => {
    fetch('https://todo-list-app-production-86fe.up.railway.app/todos')
      .then(res => res.json())
      .then(data => {
        let newTasks = []
        for (let i = 0; i < data.length; i++) {
          newTasks.push(data[i].name)
        }
        setTasks(newTasks)
      })
  }, [])
  

  return (
    <>
      <Navbar />
      <div className="seperator"></div>
      <Quote />
      <div className="seperator"></div>
      
      <main className='main'>

        <section className='todo'>

          <div className="todo-input">

            <input type="text" placeholder="add task" 
              value={taskinput}
              //whatever you add in the text input
              //it gets saved in the 'taskinput' array
              //setTaskInput just adds that value into 'taskinput'
              onChange={(e) => setTaskInput(e.target.value)}
            />

            <div className="add">
              {/* when you click add, calls 'addTask' (no args)
                  copies what 'tasks' hadd, and add value in
                  'taskInput' */}
              <FaPlus color="white" size='1em' onClick={addTask}/>
            </div>
          </div>

          {
          tasks.map((task,index) => (
            //the key is to identify the separate components
            //.map() function just iterates over the task array
            <Task key={index} name={task} index={index} deletefxn={delTask}/>
          ))
          }

      
        </section>
      </main>

      <Footer />
    </>
  )
}

export default App
