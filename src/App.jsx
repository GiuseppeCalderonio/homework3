import React from "react";
import "./App.css";
import { AddRequestForm, RequestList } from './components/ServiceRequest'
import { supabase } from './supabaseClient'
import Nav from './components/Navbar'
import Landing from './components/Landing'
import RequestChart from "./components/Chart";
import {
  Routes,
  Route
} from "react-router-dom";
import { useState, useEffect } from "react";

function App() {

  const [session, setSession] = useState(null);
  const [requests, setRequests] = useState([]);


  // TO DO - Create setup for managing sessions. Check out the supabase quickstart guides to get idea about this.


  function getElememFromDBRepresentation(request){
  
    return {
      id : request.id,
      email : request.email,
      name : request.name,
      sdescription : request.short_desc,
      ldescription : request.long_desc,
      isCompleted : request.accept_reject 
    }
  }
  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {

      setSession(session)
    })

    supabase.from('service_request').select('*').then(

      ({data: service_request, error}) => {

        if(error != null){
          console.log("An error occurred at startup time :")
          console.log(error)
        }
        else{
          console.log("Requests correctly initialized")
          const newRequests = service_request.map( request => getElememFromDBRepresentation(request))
          setRequests(newRequests)
        }
      }
    )
    

  }, [])

  // TO DO - Setup listener for supabase realtime API for updates to the service requests 
  // For example , if any of the service request is completed then this should invoke this realtime API which inturn should update the list of requests


  function getUserIdFromSession(session){
    if(session != null){
      return session.user.id
    }
    return 0
  }



  const channel = supabase
  .channel('table-db-changes')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'service_request' },
    (payload) => {

      console.log("Realtime API triggered after INSERT event")
      const element = getElememFromDBRepresentation(payload.new)
      const newRequests = [...requests, element];
      setRequests(newRequests);
    }
  )
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'service_request' },
    (payload) => {

      console.log("Realtime API triggered after UPDATE event")
      const newRequests = [...requests];
      const old = getElememFromDBRepresentation(payload.old)
      const index = requests.findIndex((request) => request.id === old.id)
      newRequests[index].isCompleted = true;
      setRequests(newRequests);
    }
  )
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'service_request' },
    (payload) => {
      
      console.log("Realtime API triggered after DELETE event")
      const newRequests = [...requests];
      const old = payload.old
      const index = requests.findIndex((request) => request === old)
      newRequests.splice(index, 1);
      setRequests(newRequests);
    }
  )
  .subscribe()


  const addRequest = async (element) => {
    console.log(element)
    // TO DO 
    // Call the supabase API to add the new service request (initially the accept_reject should be 'false' to indicate the service request is yet to completed by an admin).
      // When you will insert the a service request record you will also have to provide the "user_id". This is a field which maps which user created the service request.
      // For getting this you can make use of supabase.auth.getSession(). The will return a json containing information about the authenticated user
    // If this API call succeeds add the element to the list of requests with setRequests
    
    const user = session.user

    const request = {
      user_id: user.id,
      email: element.email,
      short_desc: element.sdescription,
      long_desc: element.ldescription,
      name: element.name,
      accept_reject: false 
    }
    
    console.log("Adding request to database")
    
    const { data, error } = await supabase.from('service_request').insert([ request ]).select()

    if(error != null){
      console.log("An error occurred while creating a new request :")
      console.log(error)
    }
    else{
      
      const newRequests = [...requests, getElememFromDBRepresentation(data[0])];
      console.log("Request added")
      console.log(getElememFromDBRepresentation(data[0]))
      setRequests(newRequests);

    }
    
    
  };

  const completeRequest = async (index, serviceId = 0) => {
    const newRequests = [...requests];
    // TO DO
    // Call the supabase API to update the service request as completed (i.e. the accept_reject flag database column will become 'true' now).
    // If this API call succeeds update the element to the list of requests with setRequests  
    
    const { data, error } = await supabase
    .from('service_request')
    .update({ accept_reject: true })
    .eq( 'id', serviceId )

    if(error != null){
      console.log("An error occurred while completing the request : ")
      console.log(error)
    }
    else{
      console.log("Request completed")
      newRequests[index].isCompleted = true;
      setRequests(newRequests);
    }

    removeRequest(index, serviceId)
    
  };

  const removeRequest = async (index, serviceId = 0) => {
    const newRequests = [...requests];
    // TO DO
    // Call the supabase API to remove / delete the service request .
    // If this API call succeeds remove the element from the list of requests with setRequests  

    const { data, error } = await supabase
    .from('service_request')
    .delete()
    .eq('id', serviceId)

    console.log(data)
    console.log(error)
    console.log(await supabase
      .from('service_request')
      .delete()
      .eq('id', serviceId))

    if(error != null){
      console.log("Error while deleting request :")
      console.log(error)
    }
    else {
      console.log("Request deleted")
      newRequests.splice(index, 1);
      setRequests(newRequests);
    }    
  };

  return (
    <>
      <Nav session={session} setSession={setSession}/>
      <Routes>
        {/* Allow only authenticated user to proceed to RequestList, AddRequestForm, RequestChart else Navigate to landing component */}
        
          <Route path="/" element={<Landing />} />
          <Route path="/list" element={session != null ? <RequestList completeRequest={completeRequest} removeRequest={removeRequest} requests={requests} /> : <Landing/>} />
          <Route path="/add" element={session != null ? <AddRequestForm addRequest={addRequest} /> : <Landing/>} />
          <Route path="/chart" element={session != null ? <RequestChart requests={requests} /> : <Landing/>} />
      </Routes>
    </>
  );
}

export default App;