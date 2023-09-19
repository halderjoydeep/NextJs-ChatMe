import { fetchRedis } from "./redis";

export async function getFriendsByUserId(userId: string) {
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`,
  )) as string[];

  const friends = Promise.all(
    friendIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string;
      const parsedFriend = JSON.parse(friend);
      return parsedFriend;
    }),
  );

  return friends;
}
