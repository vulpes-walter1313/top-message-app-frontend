import { BsFillSendFill } from "react-icons/bs";
import he from "he";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  createChatMessage,
  getChatInfo,
  getChatMessages,
} from "../../lib/queryFunctions";
import { DateTime } from "luxon";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorMessage from "../../components/ErrorMessage";
import { cn } from "../../lib/utils";

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

function ChatPage() {
  const { chatId } = Route.useParams();
  const queryClient = useQueryClient();
  const chatInfoQuery = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await getChatInfo(chatId);
      return res;
    },
  });

  const messagesQuery = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await getChatMessages(chatId);
      return res;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: createChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
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
    console.log(data);
    sendMessageMutation.mutate({ chatId, content: data.content });
    reset();
  };
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="my-6 flex flex-col items-center gap-4 px-4 lg:flex-row lg:items-start lg:justify-center">
        <div className="max-w-xl rounded-md border border-zinc-950/15 bg-white px-8 py-6">
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
          <div className="flex h-[45vh] max-h-[514px] flex-col-reverse gap-2 overflow-scroll p-2 lg:h-[60vh]">
            {/* messages container goes here */}
            {messagesQuery.data
              ? messagesQuery.data.messages.map(
                  (message: {
                    id: string;
                    authorId: string;
                    author: string | null;
                    authorIsUser: boolean;
                    content: string | null;
                    createdAt: string | null;
                  }) => {
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
                            {DateTime.fromSQL(
                              message.createdAt!,
                            ).toLocaleString(DateTime.DATETIME_MED)}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )
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
        <div>
          <div className="max-w-sm space-y-3 rounded-md border border-zinc-950/15 bg-white px-8 py-6">
            {chatInfoQuery.data ? (
              <>
                <p className="text-zinc-950">
                  {chatInfoQuery.data?.chatInfo?.chatDescription}
                </p>
                <p className="text-mobsmp text-zinc-600 lg:text-desksmp">
                  Chatt ID: {chatInfoQuery.data?.chatInfo?.id}
                </p>
                <button
                  type="button"
                  className="rounded-full bg-red-600 px-6 py-2 text-mobp font-semibold text-zinc-50 lg:text-deskp lg:font-semibold"
                >
                  Exit Room
                </button>
              </>
            ) : null}
            {chatInfoQuery.isLoading ? <p>Loading...</p> : null}
            {chatInfoQuery.isError ? (
              <p>Error occurred, please refrash the page</p>
            ) : null}
          </div>
          <div></div>
        </div>
      </div>
    </main>
  );
}
