import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TravelPlanUpsertRequest } from '../types/request/TravelPlanUpsertRequest';

const CreateTravelPlanPage: React.FC = () => {
  const [travelPlanUpsertRequest, setTravelPlanUpsertRequest] = useState<TravelPlanUpsertRequest>({
    uuid: '',
    name: '',
    startDate: '',
    endDate: ''
});
  const navigate = useNavigate()

  const handleCreateTravelPlan = () => {

    fetch(`${process.env.REACT_APP_API_URL}/travelPlan/create_travel_plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(travelPlanUpsertRequest)
    })
      .then(response => response.json())
      .then(data => {
        console.log('New travel plan created with UUID:', data);
        // Optionally, you can perform additional actions after creating the travel plan
      })
      .catch(error => console.error('Error creating travel plan:', error));
      navigate("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTravelPlanUpsertRequest(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto">
      <Link to="/" className ="text-blue-500 hover:underline"> back to Home </Link>
      <h1 className="text-2xl font-bold my-4">Create New Travel Plan</h1>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={travelPlanUpsertRequest?.name}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={travelPlanUpsertRequest?.startDate}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={travelPlanUpsertRequest?.endDate}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCreateTravelPlan}
        >
          Create Travel Plan
        </button>
      </div>
    </div>
  );
};

export default CreateTravelPlanPage;