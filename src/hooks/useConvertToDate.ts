import { useCallback } from 'react';

const useConvertToDate = () => {
  const convertToDate = useCallback((dateInput: Date | [number, number, number, number, number]): Date => {
    if (Array.isArray(dateInput)) {
      return new Date(dateInput[0], dateInput[1] - 1, dateInput[2], dateInput[3], dateInput[4]);
    }
    return new Date(dateInput);
  }, []);

  return { convertToDate };
};

export default useConvertToDate;
