const Notification = ({ message, result }) => {
  if (message === null) return null;
  if (result) {
    return <div className="successful">{message}</div>;
  }
  return <div className="failure">{message}</div>;
};

export default Notification;
