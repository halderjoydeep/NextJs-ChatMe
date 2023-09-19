import AddFriendButton from "@/components/AddFriendButton";

const page: React.FC = () => {
  return (
    <div className="px-8 pt-8">
      <h1 className="mb-8 text-3xl font-bold md:text-5xl">Add a friend</h1>
      <AddFriendButton />
    </div>
  );
};

export default page;
