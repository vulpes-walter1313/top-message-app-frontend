// import { useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import Button from "./Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChattRoom } from "../lib/queryFunctions";

const createChattFormSchema = z.object({
  chatname: z.string().min(3).max(32),
  chatTwoLetters: z.string().length(2).toUpperCase(),
  chatDescription: z.string().min(1).max(256),
});

type Inputs = {
  chatname: string;
  chatTwoLetters: string;
  chatDescription: string;
};

type CreateChattModalProps = {
  isVisible: boolean;
  toggleVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateChattModal({ isVisible, toggleVisible }: CreateChattModalProps) {
  // once /chat/:chatId is implemented use code below to navigate to it.
  // const navigate = useNavigate()
  const queryClient = useQueryClient();

  const createChattMutation = useMutation({
    mutationFn: createChattRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toggleVisible(false);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(createChattFormSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    createChattMutation.mutate(data);
  };

  if (isVisible) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-zinc-950/70"
        onClick={() => {
          toggleVisible((bool) => !bool);
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-11/12 max-w-sm space-y-4 rounded-md border border-zinc-950/15 bg-zinc-50 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="chatname" className="text-sm font-medium">
              Chatt Name
            </label>
            <input
              type="text"
              {...register("chatname")}
              placeholder="Team Rockett"
              className="rounded-md border border-zinc-300 px-3 py-2 text-mobsmp text-zinc-950 lg:text-desksmp"
            />
            {errors.chatname ? (
              <ErrorMessage message={errors.chatname.message} />
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="chatTwoLetters" className="text-sm font-medium">
              Chatt Letters
            </label>
            <input
              type="text"
              {...register("chatTwoLetters")}
              placeholder="TR"
              className="rounded-md border border-zinc-300 px-3 py-2 text-mobsmp text-zinc-950 lg:text-desksmp"
            />
            {errors.chatTwoLetters ? (
              <ErrorMessage message={errors.chatTwoLetters.message} />
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="chatDescription" className="text-sm font-medium">
              Chatt Description
            </label>
            <input
              type="text"
              {...register("chatDescription")}
              placeholder="What is this Chattroom about?"
              className="rounded-md border border-zinc-300 px-3 py-2 text-mobsmp text-zinc-950 lg:text-desksmp"
            />
            {errors.chatDescription ? (
              <ErrorMessage message={errors.chatDescription.message} />
            ) : null}
          </div>
          <Button as="submit" variant="solid">
            Create Chatt
          </Button>
        </form>
      </div>
    );
  } else {
    return null;
  }
}

export default CreateChattModal;
