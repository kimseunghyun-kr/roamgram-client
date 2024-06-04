import React, { useState, useEffect } from 'react';
import { TravelPlanUpsertRequest } from '../../types/request/TravelPlanUpsertRequest';
import { TravelPlan } from '../../types/TravelPlan';

interface ModalProps {
  travelPlan: TravelPlan;
  handleModalSubmit: (updatedTravelPlanData: TravelPlanUpsertRequest) => void;
  handleCloseModal: () => void;
}

const ModalForm: React.FC<ModalProps> = ({ travelPlan, handleModalSubmit, handleCloseModal }) => {
  const [updatedTravelPlanData, setUpdatedTravelPlanData] = useState<TravelPlanUpsertRequest>({
    uuid: travelPlan.id,
    name: travelPlan.name,
    startDate: travelPlan.travelStartDate,
    endDate: travelPlan.travelEndDate
  });

  useEffect(() => {
    setUpdatedTravelPlanData({
      uuid: travelPlan.id,
      name: travelPlan.name,
      startDate: new Date(travelPlan.travelStartDate).toISOString().split('T')[0],
      endDate: new Date(travelPlan.travelEndDate).toISOString().split('T')[0]
    });
  }, [travelPlan]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleModalSubmit(updatedTravelPlanData);
    handleCloseModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Travel Plan</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={updatedTravelPlanData.name}
              onChange={(e) => setUpdatedTravelPlanData({ ...updatedTravelPlanData, name: e.target.value })}
            />
          </label>
          <label>
            Start Date:
            <input
              type="date"
              value={updatedTravelPlanData.startDate}
              onChange={(e) => setUpdatedTravelPlanData({ ...updatedTravelPlanData, startDate: e.target.value })}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={updatedTravelPlanData.endDate}
              onChange={(e) => setUpdatedTravelPlanData({ ...updatedTravelPlanData, endDate: e.target.value })}
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCloseModal}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
