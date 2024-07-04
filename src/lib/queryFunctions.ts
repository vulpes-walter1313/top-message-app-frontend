type CreateChattRoomProps = {
  chatname: string;
  chatTwoLetters: string;
  chatDescription: string;
};
export async function createChattRoom({
  chatname,
  chatTwoLetters,
  chatDescription,
}: CreateChattRoomProps) {
  const jsonBody = JSON.stringify({
    chatname,
    chatTwoLetters,
    chatDescription,
  });
  const rawRes = await fetch("http://localhost:3000/chats", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonBody,
  });
  const res = await rawRes.json();
  console.log(res);
  if (res.success) {
    return res;
  } else {
    throw new Error("Some error occured when posting a new chatt");
  }
}
