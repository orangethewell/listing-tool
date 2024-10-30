import { React, useState, useEffect } from 'react'
import { Button, ListGroup, ListGroupItem, Form, InputGroup, Alert, FormGroup } from 'react-bootstrap';
import { EnvelopeArrowUp, Mailbox, PersonAdd, Trash, Trash2 } from 'react-bootstrap-icons';

function GuestList() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [guests, setGuests] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [showWarning, setShowWarning] = useState('');
  
    useEffect(() => {
      const storedGuests = JSON.parse(localStorage.getItem('guests'));
      const storedMessage = JSON.parse(localStorage.getItem('mail_message'))
      if (storedGuests) setGuests(storedGuests);
      if (storedMessage) {
        setSubject(storedMessage[0]); 
        setContent(storedMessage[1])
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('guests', JSON.stringify(guests));
    }, [guests]);

    useEffect(() => {
      localStorage.setItem('mail_message', JSON.stringify([subject, content]));
    }, [subject, content]);
  
    const addGuest = () => {
      if (name.trim() && email.trim()) {
        setGuests([...guests, {uniqueId: guests.length > 0 ? [...guests].reverse()[0].uniqueId + 1 : 0, name: name, email: email}]);
        setName('');
        setEmail('');
      }
    };
  
    const removeGuest = (id) => {
      setGuests(guests.filter((guest) => guest.uniqueId !== id));
    };
  
    const startEditing = (id) => {
      setIsEditing(id);
      setEditName(guests.filter((guest) => guest.uniqueId === id)[0].name);
      setEditEmail(guests.filter((guest) => guest.uniqueId === id)[0].email);
    };
  
    const confirmEdit = (id) => {
      const updatedGuests = guests.map((guest, i) => (guest.uniqueId === id ? { ...guest, name: editName, email: editEmail} : guest));
      setGuests(updatedGuests);
      setIsEditing(null);
      setEditName('');
      setEditEmail('');
    };
  
    const handleSendToAll = (e) => {
      e.preventDefault();
      
      const allEmails = guests.map(guest => guest.email).join(',');
      const mailtoLink = `mailto:${allEmails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
  
      window.location.href = mailtoLink;
      setTimeout(() => setShowWarning(`<>If it not work, copy the link and paste it on your browser: <code>${mailtoLink}</code></>`), 5000)
    };

    const handleDeleteAll = (e) => {
      e.preventDefault();
      
      setGuests([]);
      setContent("");
      setSubject("");
    };

    return (
      <div>
        <h1 className='d-flex justify-content-center mt-5 mb-3'>Guest List</h1>
        <p className='m-auto col-md-5 text-center mb-4'>
          Why you don't make up a party, huh? There's a lot of people out there 
          willing to party somewhere, add them to your list to send them a invite!
        </p>
        <InputGroup>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add guest name"
        />
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Add guest email"
        />
        <Button className='d-flex align-items-center gap-2' onClick={addGuest}><PersonAdd/> Add</Button>
        </InputGroup>
        {guests.length > 0 ? (<h3 className="mt-4">Guests</h3>) : undefined}
        <ListGroup numbered>
          {guests.map((guest, _index) => (
            <ListGroupItem className='d-flex justify-content-between align-items-start' action={isEditing === guest.uniqueId ? false : true} onDoubleClick={() => startEditing(guest.uniqueId)} key={guest.uniqueId}>
              {isEditing === guest.uniqueId ? (
                <>
                  <InputGroup>
                  <Form.Control
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className='flex-grow-1'
                  />
                  <Form.Control
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className='flex-grow-1'
                  />
                  </InputGroup>
                  <Button className='ms-3' variant='outline-success' onClick={() => confirmEdit(guest.uniqueId)}>Salvar</Button>
                </>
              ) : (
                <>
                  <div className='flex-grow-1 ms-3'>
                    <p className='fw-bold'>{guest.name}</p>
                    <span>{guest.email}</span>
                  </div>
                  <Button variant='outline-danger' onClick={() => removeGuest(guest.uniqueId)}>
                    <Trash/>
                  </Button>
                </>
              )}
            </ListGroupItem>
          ))}
        </ListGroup>
        <div class="col-md-10 mx-auto">
          <Form className='p4 p-md-5'>
            {/* customize the body and the subject from email in a form and send for everyone */}
            <Form.Group className='mb-3'>
              <Form.Label>Subject</Form.Label>
              <Form.Control 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder='Invite for my party!' />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as='textarea' 
                rows={3} 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='You are invited to my party that will happen at 18:00pm on some location...' />
            </Form.Group>
            <Form.Group>
              {showWarning.trim() ? (
                <>
                  <Alert className='mt-4' key="warning" variant='warning'><span dangerouslySetInnerHTML={{ __html: showWarning}}></span></Alert>
                </>
              ) : undefined}
              <FormGroup className='d-flex gap-5'>
              <Button disabled={guests.length === 0} onClick={handleSendToAll} className='w-100 mt-4 d-flex align-items-center justify-content-center gap-2' variant='outline-primary' type='submit'><EnvelopeArrowUp/> Send to all</Button>
              <Button disabled={guests.length === 0} onClick={handleDeleteAll} className='w-100 mt-4 d-flex align-items-center justify-content-center gap-2' variant='danger' type='submit'><Trash/> Delete Content</Button>
              </FormGroup>
              {guests.length === 0 ? (
                <>
                  <Alert className='mt-4 d-flex align-items-center' key="info" variant='info'><PersonAdd className='mx-3' size={32}/> Add some guests to your list to send the invite for your event</Alert>
                </>
              ) : undefined}
            </Form.Group>
          </Form>
        </div>
        <footer class="pt-5 my-5 text-body-secondary border-top">
          Created by <a target="_blank" href="https://github.com/orangethewell">Orangethewell</a> · © 2024
        </footer>
      </div>
    );
  }
  
  export default GuestList
  