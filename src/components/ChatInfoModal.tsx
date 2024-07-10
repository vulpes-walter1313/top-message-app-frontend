import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getChatInfo, joinChat } from "../lib/queryFunctions";
import he from "he";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "@tanstack/react-router";

type ChatInfoModalProps = {
  isVisible: boolean;
  toggleVisible: React.Dispatch<React.SetStateAction<boolean>>;
  chatId: string;
};
function ChatInfoModal({
  isVisible,
  toggleVisible,
  chatId,
}: ChatInfoModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const chatQuery = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await getChatInfo(chatId);
      return res;
    },
  });

  const joinChatMutation = useMutation({
    mutationFn: joinChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "joined"] });
    },
  });

  if (isVisible) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-zinc-950/70"
        onClick={() => toggleVisible((bool) => !bool)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-11/12 max-w-sm space-y-4 rounded-md border border-zinc-950/15 bg-zinc-50 p-6"
        >
          {chatQuery.data ? (
            <div className="flex flex-col items-start gap-6">
              <p className="text-mobh3 capitalize lg:text-deskh3">
                {chatQuery.data.chatInfo.chatname}
              </p>
              <div>
                <p className="pb-2">
                  {he.decode(chatQuery.data.chatInfo.chatDescription)}
                </p>
                <p className="text-desksmp text-zinc-600">
                  Chatt ID: {chatQuery.data.chatInfo.id}
                </p>
              </div>
              <button
                className="flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-lg font-semibold leading-none text-zinc-50"
                onClick={() => {
                  joinChatMutation.mutate({
                    chatId: chatQuery.data.chatInfo.id,
                  });
                  toggleVisible(false);
                  navigate({
                    to: "/chat/$chatId",
                    params: {
                      chatId: chatQuery.data.chatInfo.id
                    }
                  })
                }
                }
              >
                Join Chatt
              </button>
              {joinChatMutation.isError ? <ErrorMessage message="Problem in joining chat. try again later."/> : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default ChatInfoModal;
