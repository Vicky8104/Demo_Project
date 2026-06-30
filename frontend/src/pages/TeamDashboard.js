import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function TeamDashboard() {
 const { user} = useContext(AuthContext);

  return (
    <div>
      <h2>Team Dashboard</h2>
      <p>Welcome {user?.name}</p>
      <p>Team Number : {user?.teamNumber}</p>
      <p>Hello {user?.name}</p>

    </div>
  );
}