import React from "react";
import UserCard from "./UserCard";

export default function Whotofollow({
  users,
  loggedUserId,
  followedUsers,
  toggleFollow,
}) {
  // Slice the users array to show only the first 3 users
  const reversedUsers = [...users].reverse().slice(0, 3);
  return (
    <>
      <div className="flex w-full flex-col gap-[30px] p-2">
        <h2 className="text-[16px] font-semibold text-gray-600">Who to follow</h2>
        {reversedUsers.map((user) => (
          <UserCard
            user={user}
            loggedUserId={loggedUserId}
            followedUsers={followedUsers}
            toggleFollow={toggleFollow}
          />
        ))}
      </div>
    </>
  );
}
