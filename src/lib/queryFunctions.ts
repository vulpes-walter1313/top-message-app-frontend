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

export async function joinChat({ chatId }: { chatId: string }) {
  const rawRes = await fetch(
    `http://localhost:3000/chats/${chatId}/membership`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error("Error in joining chatt");
  }
}

export async function deleteMessage({
  chatId,
  messageId,
}: {
  chatId: string;
  messageId: string;
}) {
  const rawRes = await fetch(
    `http://localhost:3000/chats/${chatId}/messages/${messageId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error("Error is deleting message");
  }
}

export async function deleteChatMembership({ chatId }: { chatId: string }) {
  const rawRes = await fetch(
    `http://localhost:3000/chats/${chatId}/membership`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  const res = await rawRes.json();

  if (res.success) {
    return res;
  } else {
    throw new Error("Error is deleting membership to chatt");
  }
}

export async function deleteChat({ chatId }: { chatId: string }) {
  const rawRes = await fetch(`http://localhost:3000/chats/${chatId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error("Error in deleting chat");
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

export async function getJoinedChatsInfo(page: number) {
  const rawRes = await fetch(
    `http://localhost:3000/chats?type=joined&limit=10&page=${page}`,
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

export async function getExploreChatsInfo(page: number) {
  const rawRes = await fetch(
    `http://localhost:3000/chats?type=explore&limit=10&page=${page}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error("Error is fetching explore chats info");
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

// Get User query

export async function getUserStatus() {
  const rawRes = await fetch("http://localhost:3000/user", {
    method: "GET",
    credentials: "include",
  });
  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error("Couldn't fetch user status");
  }
}

export async function logoutUser() {
  const rawRes = await fetch("http://localhost:3000/signout", {
    method: "DELETE",
    credentials: "include",
  });
  const res = await rawRes.json();
  if (res.success) {
    return res;
  } else {
    throw new Error("Error in signing out");
  }
}
