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

export async function getChatInfo(chatId: string) {
  const rawRes = await fetch(`http://localhost:3000/chats/${chatId}`, {
    method: "GET",
    credentials: "include",
  });
  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error(`Error fetching chatinfo for chat: ${chatId}`);
  }
}

export async function getJoinedChatsInfo() {
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
}

export async function getChatMessages(chatId: string) {
  const rawRes = await fetch(
    `http://localhost:3000/chats/${chatId}/messages?limit=50&page=1`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error("Error in loading messages");
  }
}

type CreateChatMessateProps = {
  chatId: string;
  content: string;
};
export async function createChatMessage({
  chatId,
  content,
}: CreateChatMessateProps) {
  const data = { content };
  const rawRes = await fetch(`http://localhost:3000/chats/${chatId}/messages`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error("Error is sending message to chat.");
  }
}
