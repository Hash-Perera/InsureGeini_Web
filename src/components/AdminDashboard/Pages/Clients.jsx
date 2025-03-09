import { Link } from "react-router-dom";

const Clients = () => {
  return (
    <div className="flex flex-col justify-center w-full gap-8">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-4xl font-semibold ">Clients List</h1>
        <Link
          to="/admin/clients/add"
          className="px-2 py-2 text-sm text-white transition-all duration-75 transform bg-black hover:bg-stone-950 sm:rounded-md"
        >
          Add Client
        </Link>
      </div>
    </div>
  );
};

export default Clients;
