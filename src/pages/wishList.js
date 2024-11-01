import { React, useState, useEffect } from 'react'
import { Button, ListGroup, ListGroupItem, Form, InputGroup } from 'react-bootstrap';
import { Stars, Trash } from 'react-bootstrap-icons';

function WishesList() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editText, setEditText] = useState('');
  
    useEffect(() => {
      const storedTasks = JSON.parse(localStorage.getItem('wishes'));
      if (storedTasks) setTasks(storedTasks);
    }, []);
  
    useEffect(() => {
      localStorage.setItem('wishes', JSON.stringify(tasks));
    }, [tasks]);
  
    const addTask = () => {
      if (task.trim()) {
        setTasks([...tasks, {uniqueId: tasks.length > 0 ? [...tasks].reverse()[0].uniqueId + 1 : 0, text: task, completed: false}]);
        setTask('');
      }
    };
  
    const toggleComplete = (id) => {
      setTasks(tasks.map((task) => task.uniqueId === id ? { ...task, completed: !task.completed } : task));
    };
  
    const removeTask = (id) => {
      setTasks(tasks.filter((task) => task.uniqueId !== id));
    };
  
    const startEditing = (id) => {
      setIsEditing(id);
      setEditText(tasks.filter((task) => task.uniqueId === id)[0].text);
    };
  
    const confirmEdit = (id) => {
      const updatedTasks = tasks.map((task, i) => (task.uniqueId === id ? { ...task, text: editText } : task));
      setTasks(updatedTasks);
      setIsEditing(null);
      setEditText('');
    };
  
    return (
      <div>
        <h1 className='d-flex justify-content-center mt-5 mb-3'>Wish List</h1>
        <p className='m-auto col-md-5 text-center mb-4'><i>
          Have you ever had a dream that you, um, you had, your, you- you could, 
          you’ll do, you- you wants, you, you could do so, you- you’ll do, you could- 
          you, you want, you want them to do you so much you could do anything?
        </i></p>
        <InputGroup>
        <Form.Control
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a wish..."
        />
        <Button className='d-flex align-items-center gap-2' onClick={addTask}><Stars/>Add</Button>
        </InputGroup>
        {tasks.length > 0 ? (<h3 className="mt-4">Wishes</h3>) : undefined}
        <ListGroup>
          {tasks.filter(task => !task.completed).map((task, index) => (
            <ListGroupItem className='d-flex align-items-center' action={isEditing === task.uniqueId ? false : true} onDoubleClick={() => startEditing(task.uniqueId)} key={task.uniqueId}>
              <Form.Check 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleComplete(task.uniqueId)} 
                className="me-3"
              />
              {isEditing === task.uniqueId ? (
                <>
                  <Form.Control
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className='flex-grow-1'
                  />
                  <Button className='ms-3' variant='outline-success' onClick={() => confirmEdit(task.uniqueId)}>Salvar</Button>
                </>
              ) : (
                <>
                  <span className='flex-grow-1'>{task.text}</span>
                  <Button variant='outline-danger' onClick={() => removeTask(task.uniqueId)}>
                    <Trash/>
                  </Button>
                </>
              )}
            </ListGroupItem>
          ))}
        </ListGroup>
        {tasks.filter(task => task.completed).length > 0 ? (<h3 className="mt-4">Wishes fulfilled</h3>) : undefined}
        <ListGroup>
          {tasks.filter(task => task.completed).map((task, index) => (
            <ListGroupItem className='d-flex align-items-center' key={task.uniqueId}>
              <Form.Check 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleComplete(task.uniqueId)} 
                className="me-3"
              />
              <span style={{textDecorationLine: "line-through"}} className='flex-grow-1'>{task.text}</span>
              <Button variant='outline-danger' onClick={() => removeTask(task.uniqueId)}>
                <Trash />
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
        <footer class="pt-5 my-5 text-body-secondary border-top">
          Created by <a target="_blank" href="https://github.com/orangethewell">Orangethewell</a> · © 2024
        </footer>
      </div>
    );
  }
  
  export default WishesList
  