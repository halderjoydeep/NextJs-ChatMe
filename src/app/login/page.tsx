import LoginButton from "./LoginButton";

const page: React.FC = async () => {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <div className="text-center">Logo</div>
      <div className="mt-14 flex flex-col">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h1>
        <LoginButton />
      </div>
    </main>
  );
};

export default page;
