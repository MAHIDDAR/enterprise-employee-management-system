import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  fetchEmployees,
} from "../services/employeeService";

export const EmployeeContext =
  createContext();

function EmployeeProvider({
  children,
}) {

  const [employees, setEmployees] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {

    try {

      const data =
        await fetchEmployees();

      setEmployees(data);

    } catch (error) {

      console.log(error);
    }
  };

  const addNotification = (
    message
  ) => {

    const newNotification = {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);

    setUnreadCount(
      (prev) => prev + 1
    );
  };

  const markNotificationsAsRead = () => {

    setUnreadCount(0);

  };

  const clearNotifications = () => {

    setNotifications([]);

    setUnreadCount(0);

  };

  return (

    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        loadEmployees,

        notifications,
        unreadCount,

        addNotification,
        markNotificationsAsRead,
        clearNotifications,
      }}
    >

      {children}

    </EmployeeContext.Provider>
  );
}

export default EmployeeProvider;