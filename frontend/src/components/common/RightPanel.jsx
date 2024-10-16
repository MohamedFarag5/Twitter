import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {

  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },

  });

  const { follow, isPending } = useFollow();

  return (
    <>
      {suggestedUsers?.length != 0 ? (
        <div className=" my-4 mx-2 hidden lg:block">
          <div className=" p-4 rounded-md sticky top-2">
            <p className="font-bold mb-7">Who to follow</p>
            <div className="flex flex-col gap-4">
              {/* item */}

              {isLoading &&
                Array(5)
                  .fill(0)
                  .map((_, index) => {
                    return <RightPanelSkeleton key={index} />;
                  })}
              {!isLoading &&
                suggestedUsers?.map((user) => (
                  <Link
                    to={`/profile/${user.username}`}
                    className="flex items-center justify-between gap-4"
                    key={user._id}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={user.profileImg || "/avatar-placeholder.png"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold tracking-tight truncate w-28">
                          {user.fullName}
                        </span>
                        <span className="text-sm text-slate-500">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          follow(user._id);
                        }}
                      >
                        {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                      </button>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      
    </>
  );
};
export default RightPanel;
