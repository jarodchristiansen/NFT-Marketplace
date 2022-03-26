import Button from "../commons/Button";
import { useRouter } from "next/router";

const ExploreBanner = () => {
  const router = useRouter();

  async function redirectToCreate(event) {
    event.preventDefault();
    router.push("/create-item");
  }

  return (
    <div>
      <div className="flex justify-center flex-col mt-10 outline outline-1 outline-pink-500 md:px-8 py-8 shadow-lg">
        <h1 className={"text-2xl text-center"}>
          Explore, collect, and sell amazing assets
        </h1>
        <div className="sm:flex-col md:flex-row self-center">
          <Button
            label={"Explore"}
            className={
              "font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg w-auto mr-2.5 md:hover:bg-white md:hover:text-pink-500 md:hover:outline md:hover: outline-1 md:hover:outline-pinnk-500"
            }
            datatestId="explore-button"
          />
          <Button
            label={"Create"}
            className={
              "font-bold mt-4 text-pink-500 outline outline-1 outline-pink-500 rounded p-4 shadow-lg w-auto ml-2.5 md:hover:bg-pink-500 md:hover:text-white"
            }
            datatestId="create-button"
            onClick={redirectToCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default ExploreBanner;
