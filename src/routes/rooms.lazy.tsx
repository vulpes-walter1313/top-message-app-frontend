import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getExploreChatsInfo } from "../lib/queryFunctions";
import Button from "../components/Button";
import PaginateButtons from "../components/PaginateButtons";
import CreateChattModal from "../components/CreateChattModal";
import ChatInfoModal from "../components/ChatInfoModal";

export const Route = createLazyFileRoute("/rooms")({
  component: RoomsPage,
});

type ChatsType = {
  id: string;
  chatname: string;
  chatLetters: string;
  createdAt: string | null;
  updatedAt: string | null;
  numOfMembers: number;
};
function RoomsPage() {
  const [createChattModalVisible, setCreateChattModalVisible] = useState(false);
  const [chatInfoModalVisible, setChatInfoModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState("");
  const [page, setPage] = useState(1);
  const messagesQuery = useQuery({
    queryKey: ["chats", "explore", "page", page],
    queryFn: async () => {
      const res = await getExploreChatsInfo(page);
      if (res.success) {
        return res;
      } else {
        throw new Error("Error fetching explore chats");
      }
    },
  });
  return (
    <main className="w-full">
      <div className="flex flex-col justify-center gap-16">
        <div className="mx-auto mt-10 max-w-3xl lg:mt-20">
          <h1 className="mb-8 text-center">Find a Chatt Room!</h1>
          <div className="flex justify-center gap-4">
            <Button variant="solid" as="link" href="/dashboard">
              See Joined Chatts
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
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-lg font-semibold leading-none text-zinc-50"
                      onClick={() => {
                        setSelectedChat(chat.id);
                        setChatInfoModalVisible(true);
                      }}
                    >
                      Join Chat
                    </button>
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
            setDesiredPage={setPage}
          />
        ) : null}
      </div>
      <CreateChattModal
        isVisible={createChattModalVisible}
        toggleVisible={setCreateChattModalVisible}
      />
      <ChatInfoModal
        chatId={selectedChat}
        isVisible={chatInfoModalVisible}
        toggleVisible={setChatInfoModalVisible}
      />
    </main>
  );
}
