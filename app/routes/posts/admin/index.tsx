import { Link } from "@remix-run/react";

const AdminIndex = () => {
  return (
    <Link to="new" className="text-blue-600 underline">
      new
    </Link>
  );
};

export default AdminIndex;
