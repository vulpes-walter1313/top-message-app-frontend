import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "../components/Button";
import PaginateButtons from "../components/PaginateButtons";
import { useState } from "react";
import CreateChattModal from "../components/CreateChattModal";

export const Route = createLazyFileRoute("/dashboard")({
  component: DashboardPage,
});

type ChatsType = {
  id: string;
  chatname: string;
  chatLetters: string;
  createdAt: string | null;
  updatedAt: string | null;
  numOfMembers: number;
};
function DashboardPage() {
  const [createChattModalVisible, setCreateChattModalVisible] = useState(true);
  const messagesQuery = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const rawRes = await fetch(
        "http://localhost:3000/chats?type=joined&limit=10&page=1",
        {
          method: "GET",
          credentials: "include",
        },
      );
      const res = await rawRes.json();
      if (res.success) {
        return res;
      } else {
        throw new Error("Error in fetching joined chats");
      }
    },
  });
  return (
    <main className="w-full">
      <div className="flex flex-col justify-center gap-16">
        <div className="mx-auto max-w-3xl mt-10 lg:mt-20">
          <h1 className="text-center mb-8">Start Chatting</h1>
          <div className="flex gap-4">
            <Button variant="solid" as="link" href="/rooms">
              Explore Chatts
            </Button>
            <Button
              variant="outline"
              as="toggle"
              onClick={setCreateChattModalVisible}
            >
              Create Chatt
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 lg:gap-8 justify-center">
          {messagesQuery.data
            ? messagesQuery.data.chats.map((chat: ChatsType) => {
                return (
                  <div
                    key={chat.id}
                    className="bg-zinc-50 border border-zinc-950/15 px-4 py-6 rounded-md flex flex-col gap-6"
                  >
                    <div className="flex justify-center items-center gap-4">
                      <p className="w-12 h-12 flex justify-center items-center bg-zinc-200 text-zinc-900 rounded-full text-base">
                        {chat.chatLetters}
                      </p>
                      <div className="text-zinc-950">
                        <p className="mb-1 capitalize w-[22ch] truncate">
                          {chat.chatname}
                        </p>
                        <p className="text-mobxsp lg:text-deskxsp text-zinc-700">
                          {chat.numOfMembers} members
                        </p>
                      </div>
                    </div>
                    <Button as="link" href={`/chat/${chat.id}`} variant="solid">
                      Enter Chatt
                    </Button>
                  </div>
                );
              })
            : null}
        </div>
        {messagesQuery.isLoading ? <p>Loading...</p> : null}
        {messagesQuery.data ? (
          <PaginateButtons
            currentPage={messagesQuery.data.currentPage}
            totalPages={messagesQuery.data.totalPages}
          />
        ) : null}
      </div>
      <CreateChattModal
        isVisible={createChattModalVisible}
        toggleVisible={setCreateChattModalVisible}
      />
    </main>
  );
}
