const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const baseStyle = {
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const notificationStyle = {
    ...baseStyle,
    color: type === "success" ? "green" : "red",
    borderColor: type === "success" ? "green" : "red",
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
