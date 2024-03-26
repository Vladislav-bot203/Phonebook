const RemoveNotification = ({ message }) => {
  if (message === null) return null;
  return <div className="removeNotification">{message}</div>;
};

export default RemoveNotification;
