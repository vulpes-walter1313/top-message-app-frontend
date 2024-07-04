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
  const queryClient = useQueryClient()

  const creatChattMutation = useMutation({
    mutationFn: createChattRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["chats", "joined"]})
      toggleVisible(false);
    }
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(createChattFormSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    creatChattMutation.mutate(data);
  };

  if (isVisible) {
    return (
      <div
        className="bg-zinc-950/70 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"
        onClick={() => {
          toggleVisible((bool) => !bool);
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-50 p-6 border border-zinc-950/15 rounded-md space-y-4 w-11/12 max-w-sm"
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
              className="text-zinc-950 border border-zinc-300 text-mobsmp lg:text-desksmp px-3 py-2 rounded-md"
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
              className="text-zinc-950 border border-zinc-300 text-mobsmp lg:text-desksmp px-3 py-2 rounded-md"
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
              className="text-zinc-950 border border-zinc-300 text-mobsmp lg:text-desksmp px-3 py-2 rounded-md"
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
