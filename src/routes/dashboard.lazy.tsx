import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "../components/Button";
import PaginateButtons from "../components/PaginateButtons";
import { useState } from "react";
import CreateChattModal from "../components/CreateChattModal";
import { getJoinedChatsInfo } from "../lib/queryFunctions";

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
  const [selectedPage, setSelectedPage] = useState(1);
  const [createChattModalVisible, setCreateChattModalVisible] = useState(false);
  const messagesQuery = useQuery({
    queryKey: ["chats", "joined", selectedPage],
    queryFn: async () => {
      const res = await getJoinedChatsInfo(selectedPage);
      return res;
    },
  });
  return (
    <main className="w-full">
      <div className="flex flex-col justify-center gap-16">
        <div className="mx-auto mt-10 max-w-3xl lg:mt-20">
          <h1 className="mb-8 text-center">Start Chatting</h1>
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
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
          {messagesQuery.data
            ? messagesQuery.data.chats.map((chat: ChatsType) => {
                return (
                  <div
                    key={chat.id}
                    className="flex flex-col gap-6 rounded-md border border-zinc-950/15 bg-zinc-50 px-4 py-6"
                  >
                    <div className="flex items-center justify-center gap-4">
                      <p className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-base text-zinc-900">
                        {chat.chatLetters}
                      </p>
                      <div className="text-zinc-950">
                        <p className="mb-1 w-[22ch] truncate capitalize">
                          {chat.chatname}
                        </p>
                        <p className="text-mobxsp text-zinc-700 lg:text-deskxsp">
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
          <div className="pb-14">
            <PaginateButtons
              currentPage={messagesQuery.data.currentPage}
              totalPages={messagesQuery.data.totalPages}
              setDesiredPage={setSelectedPage}
            />
          </div>
        ) : null}
      </div>
      <CreateChattModal
        isVisible={createChattModalVisible}
        toggleVisible={setCreateChattModalVisible}
      />
    </main>
  );
}
