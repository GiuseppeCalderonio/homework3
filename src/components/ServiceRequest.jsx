import React from 'react'

function RequestList({ requests, completeRequest, removeRequest }) {
  return (
    <div className="list-container" >
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"> </th>
            <th scope="col">Name</th>
            <th scope="col">Short Description</th>
            <th scope="col">Email Id</th>
            <th scope="col">Long Description</th>
            <th scope="col">Complete a Request</th>
          </tr>
        </thead>
        <tbody id="main-table-body">
          {requests.map((request, index) => (
            <Request
              key={index}
              index={index}
              request={request}
              completeRequest={completeRequest}
              removeRequest={removeRequest}
            />
          ))}
        </tbody>
      </table>

    </div>
  )
}

function Request({ request, index, completeRequest, removeRequest }) {
  return (
    <tr
      className="request"
      style={{ textDecoration: request.isCompleted ? "line-through" : "" }}
    >
      <td><button onClick={() => removeRequest(index, request.id)}
        className="btn-close" aria-label="cancel" type="button" ></button></td>
      <td>{request.name}</td>
      <td>{request.sdescription}</td>
      <td>{request.email}</td>
      <td>{request.ldescription}</td>
      <td><button onClick={() => completeRequest(index, request.id)}
        className="btn-primary btn" aria-label="complete" type="button" >Complete</button></td>
    </tr>
  );
}

function AddRequestForm({ addRequest }) {
  const [value, setValue] = React.useState({});

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addRequest(value);
    setValue({});
    document.getElementById('requestForm').reset();
  };

  const resetForm = () => {
    setValue({});
    document.getElementById('requestForm').reset();
  }

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const updatedValue = { [name]: value }

    setValue(previous => ({
      ...previous,
      ...updatedValue
    }));
  }

  return (
    <div className="form-contain">
      <div>
        <h1 align="center" style={{ "marginBottom": "5%" }}>Create a Service Request</h1>
      </div>
      <form id="requestForm" className="login-form" onSubmit={handleSubmit}>
        <div className="form-outline mb-4">
          <label>Name</label>
          <input id="name" name="name" className="form-control"
            placeholder="Enter Name" onChange={handleInputChange} />
        </div>
        <div className="form-outline mb-4">
          <label>Short Description</label>
          <input id="sdescription" name="sdescription" className="form-control"
            placeholder="Enter Short Description" onChange={handleInputChange} />
        </div>
        <div className="form-outline mb-4">
          <label>Email Id</label>
          <input id="email" name="email" className="form-control"
            placeholder="Enter Email ID" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="textAreaForRequest">Service Request</label>
          <textarea className="form-control" name="ldescription" id="ldescription"
            rows="5" onChange={handleInputChange}></textarea>
        </div>
        <button type="button" onClick={handleSubmit} className="btn btn-primary m-1" id="create-req-btn">Create Request</button>
        <button type="button" onClick={resetForm} className="btn btn-danger m-1" id="reset-req-btn">Reset Form</button>

      </form>
    </div>
  );
}

export { Request, AddRequestForm, RequestList }