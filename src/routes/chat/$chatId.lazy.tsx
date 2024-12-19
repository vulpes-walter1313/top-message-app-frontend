import { BsFillSendFill } from "react-icons/bs";
import he from "he";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  deleteChat,
  deleteChatMembership,
  getChatInfo,
  getJoinedChatsInfo,
} from "../../lib/queryFunctions";
import { DateTime } from "luxon";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorMessage from "../../components/ErrorMessage";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";
import PaginateButtons from "../../components/PaginateButtons";
import { socket, connectToRoom, leaveRoom } from "../../lib/socketUtils";

export const Route = createLazyFileRoute("/chat/$chatId")({
  component: ChatPage,
});
const MessageFormSchema = z.object({
  content: z.string().min(1).max(2046),
});
type MessageInput = {
  content: string;
};

type ChatInfoType = {
  id: string;
  chatname: string;
  chatLetters: string;
  chatDescription: string | null;
  adminName: string | null;
  membersCount: number;
};
type ChatInfoResponseType = {
  success: boolean;
  message: string;
  chatInfo: ChatInfoType;
};

type ChatsType = {
  id: string;
  chatname: string;
  chatLetters: string;
  createdAt: string | null;
  updatedAt: string | null;
  numOfMembers: number;
};

const chatMessageSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  author: z.string().nullable(),
  content: z.string().nullable(),
  createdAt: z.string().nullable(),
});
type ChatMessageType = z.infer<typeof chatMessageSchema> & {
  authorIsUser: boolean;
};

function ChatPage() {
  const navigate = useNavigate();
  const { chatId } = Route.useParams();
  const [page, setPage] = useState(1);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const queryClient = useQueryClient();

  const chatInfoQuery = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await getChatInfo(chatId);
      return res;
    },
  });

  const myRoomsQuery = useQuery({
    queryKey: ["chats", "joined", page],
    queryFn: async () => {
      const res = await getJoinedChatsInfo(page);
      return res;
    },
  });

  useEffect(() => {
    connectToRoom(chatId)
      .then((userId) => setCurrentUserId(userId))
      .catch((err) => {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.log("Error when trying to connect");
        }
      });
    return () => {
      leaveRoom(chatId);
    };
  }, [chatId, setCurrentUserId]);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("Error in connecting");
      }
    });
    socket.on("receive-message", (message) => {
      console.log("receive-message hit", message);
      const valResult = chatMessageSchema.safeParse(message);
      if (valResult.success) {
        const authorIsUser = currentUserId === valResult.data.authorId;
        setChatMessages((old) => [
          { ...valResult.data, authorIsUser: authorIsUser },
          ...old,
        ]);
      } else {
        console.error(valResult.error);
      }
    });
    socket.on("receive-initial-messages", (messages) => {
      console.log("receive-initial messages socket event hit");
      const valResult = chatMessageSchema.safeParse(messages[0]);
      if (valResult.success) {
        setChatMessages(() => {
          const finalMessages: ChatMessageType[] = messages.map((msg) => ({
            id: msg.id,
            authorId: msg.authorId,
            author: msg.author,
            content: msg.content,
            createdAt: msg.createdAt,
            authorIsUser: currentUserId === msg.authorId,
          }));
          return finalMessages;
        });
        console.log("chat messages:", messages);
      } else {
        console.error("Validation of initial messages failed.");
      }
    });
    console.log("connecting to socket");
    return () => {
      console.log("disconneting from socket");
      socket.off("connect_error");
      socket.off("receive-initial-messages");
      socket.off("receive-message");
    };
  }, [currentUserId]);

  const deleteMembershipMutation = useMutation({
    mutationFn: deleteChatMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "joined"] });
      navigate({
        to: "/dashboard",
      });
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", "joined"] });
      navigate({
        to: "/dashboard",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageInput>({
    resolver: zodResolver(MessageFormSchema),
  });
  const onSubmit: SubmitHandler<MessageInput> = async (data) => {
    // sendMessageMutation.mutate({ chatId, content: data.content });
    socket.emit(
      "send-message",
      data.content,
      chatId,
      (newMessage: ChatMessageType) => {
        const valResult = chatMessageSchema.safeParse(newMessage);
        if (valResult.success) {
          setChatMessages((old) => [
            { ...valResult.data, authorIsUser: true },
            ...old,
          ]);
        } else {
          console.error(
            "Error in callback from 'send-message' emitter:",
            valResult.error,
            newMessage,
          );
        }
      },
    );
    reset();
  };
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="flex flex-col items-center gap-4 px-4 py-6 lg:flex-row lg:items-start lg:justify-center">
        <div className="max-w-xl rounded-md border border-zinc-950/15 bg-white px-8 py-6 lg:w-[29.5rem]">
          <div className="flex items-center gap-4 border-b border-zinc-950/15 pb-2">
            {chatInfoQuery.data ? (
              <>
                <p className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-base text-zinc-900">
                  {
                    (chatInfoQuery.data as ChatInfoResponseType).chatInfo
                      .chatLetters
                  }
                </p>
                <div className="flex flex-col gap-1">
                  <h1 className="text-mobh6 capitalize lg:text-deskh6">
                    {chatInfoQuery.data?.chatInfo?.chatname}
                  </h1>
                  <p className="text-mobxsp lg:text-deskxsp">
                    {chatInfoQuery.data?.chatInfo?.membersCount} members
                  </p>
                </div>
              </>
            ) : null}
            {chatInfoQuery.isLoading ? <p>Loading chat...</p> : null}
          </div>
          <div className="flex h-[45vh] max-h-[514px] flex-col-reverse gap-2 overflow-y-scroll p-2 lg:h-[60vh]">
            {/* messages container goes here */}
            {chatMessages.length > 0
              ? chatMessages.map((message) => {
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[392px] px-6 py-4",
                        message.authorIsUser &&
                          "self-end rounded-bl-3xl rounded-br-sm rounded-tl-3xl rounded-tr-3xl bg-emerald-300 text-emerald-950",
                        !message.authorIsUser &&
                          "rounded-bl-sm rounded-br-3xl rounded-tl-3xl rounded-tr-3xl bg-zinc-100 text-zinc-800",
                      )}
                    >
                      <p className="pb-2">{he.decode(message.content!)}</p>
                      <div>
                        <p
                          className={cn(
                            "text-[0.9375rem] font-medium leading-[145%] lg:font-medium",
                            message.authorIsUser && "text-right",
                          )}
                        >
                          {message.author}
                        </p>
                        <p
                          className={cn(
                            "text-[0.8125rem] font-normal leading-[145%] text-zinc-700 lg:text-deskxsp",
                            message.authorIsUser &&
                              "text-right text-emerald-800",
                          )}
                        >
                          {DateTime.fromSQL(message.createdAt!, {
                            zone: "UTC",
                          })
                            .toLocal()
                            .toLocaleString(DateTime.DATETIME_MED)}
                        </p>
                        {message.authorIsUser ||
                        chatInfoQuery.data.userIsAdmin ? (
                          <button
                            className="text-right text-deskxsp font-medium text-red-600"
                            type="button"
                            onClick={() => {
                              // deleteMessageMutation.mutate({
                              //   chatId: chatId,
                              //   messageId: message.id,
                              // });
                              socket.emit(
                                "delete-message",
                                message.id,
                                (
                                  res:
                                    | { success: false; error: string }
                                    | { success: true; messageDeleted: string },
                                ) => {
                                  if (res.success) {
                                    setChatMessages((old) =>
                                      old.filter(
                                        (msg) => msg.id != res.messageDeleted,
                                      ),
                                    );
                                    console.log(
                                      "deleting message: ",
                                      res.messageDeleted,
                                    );
                                  }
                                },
                              );
                            }}
                          >
                            delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="pt-4">
            {/* message input goes here */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center gap-4"
            >
              <div className="w-full flex-initial">
                <textarea
                  {...register("content")}
                  rows={4}
                  className="w-full border border-zinc-950/15 text-mobp text-zinc-900 lg:text-deskp"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey == false) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
                {errors.content ? (
                  <ErrorMessage message={errors.content.message} />
                ) : null}
              </div>
              <button
                aria-label="Send"
                type="submit"
                className="flex-initial rounded-full bg-emerald-600 p-3 text-emerald-50"
              >
                <BsFillSendFill
                  aria-hidden={true}
                  focusable="false"
                  className="inline h-6 w-6"
                />
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="max-w-sm space-y-3 rounded-md border border-zinc-950/15 bg-white px-8 py-6">
            {chatInfoQuery.data ? (
              <>
                <p className="text-zinc-950">
                  {he.decode(chatInfoQuery.data?.chatInfo?.chatDescription)}
                </p>
                <p className="text-mobsmp text-zinc-600 lg:text-desksmp">
                  Chatt ID: {chatInfoQuery.data?.chatInfo?.id}
                </p>
                <p className="text-mobsmp text-zinc-600 lg:text-desksmp">
                  Chatt Admin: {chatInfoQuery.data?.chatInfo?.adminName}
                </p>

                <div className="flex gap-4">
                  <button
                    type="button"
                    className="rounded-full bg-red-600 px-6 py-2 text-mobp font-semibold text-zinc-50 lg:text-deskp lg:font-semibold"
                    onClick={() => {
                      const confirmation = confirm(
                        "Are you sure you want to exit this chat?",
                      );
                      if (confirmation) {
                        deleteMembershipMutation.mutate({
                          chatId: chatInfoQuery.data.chatInfo.id,
                        });
                      }
                    }}
                  >
                    Exit Room
                  </button>
                  {chatInfoQuery.data.userIsAdmin ? (
                    <button
                      type="button"
                      className="block rounded-full border-2 border-red-500 px-6 py-2 text-lg font-semibold leading-none text-red-500"
                      onClick={() => {
                        const confirmation = confirm(
                          "are you sure you want to delete this chat?",
                        );
                        if (confirmation) {
                          deleteChatMutation.mutate({
                            chatId: chatInfoQuery.data.chatInfo.id,
                          });
                        }
                      }}
                    >
                      Delete Chat
                    </button>
                  ) : null}
                </div>
                {deleteMembershipMutation.isError ? (
                  <ErrorMessage message="Error in exiting chatt" />
                ) : null}
              </>
            ) : null}
            {chatInfoQuery.isLoading ? <p>Loading...</p> : null}
            {chatInfoQuery.isError ? (
              <p>Error occurred, please refrash the page</p>
            ) : null}
          </div>
          <div>
            <div className="maz-w-sm rounded-md border border-zinc-950/15 bg-white px-8 py-6">
              <p className="pb-4 font-medium">My Rooms</p>
              <div className="flex flex-col gap-2">
                {myRoomsQuery.data
                  ? myRoomsQuery.data.chats.map((chat: ChatsType) => {
                      return (
                        <Link
                          key={chat.id}
                          to="/chat/$chatId"
                          params={{ chatId: chat.id }}
                        >
                          <div
                            key={chat.id}
                            className={cn(
                              "flex items-center gap-4 rounded-md bg-zinc-100 px-4 py-2 hover:bg-white",
                              chatId === chat.id &&
                                "border-2 border-emerald-500",
                            )}
                          >
                            <p className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-base text-zinc-900">
                              {chat.chatLetters}
                            </p>
                            <div className="text-zinc-950">
                              <p className="mb-1 w-[22ch] truncate capitalize">
                                {chat.chatname}
                              </p>
                              <p className="text-deskxsp text-zinc-700">
                                {chat.numOfMembers} members
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  : null}
                {myRoomsQuery.isLoading ? <p>Loading...</p> : null}
                {myRoomsQuery.isError ? (
                  <ErrorMessage message="There was an error loading your ChattRooms" />
                ) : null}
              </div>
              {myRoomsQuery.data ? (
                <div className="pt-4">
                  <PaginateButtons
                    currentPage={myRoomsQuery.data.currentPage}
                    totalPages={myRoomsQuery.data.totalPages}
                    setDesiredPage={setPage}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
