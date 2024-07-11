import { Link, useNavigate } from "@tanstack/react-router";
import Button from "./Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserStatus, logoutUser } from "../lib/queryFunctions";

function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: getUserStatus,
    retry: false,
  });
  const logOutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate({
        to: "/",
      });
    },
  });
  return (
    <nav className="flex items-center justify-between px-5 py-4 lg:px-16">
      <p>ChattApp</p>
      <ul className="flex items-center gap-8">
        {userQuery.data && userQuery.isSuccess ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/rooms">Explore</Link>
            </li>
            <li>
              <Button
                as="button"
                variant="outline"
                onClick={() => {
                  logOutMutation.mutate();
                }}
              >
                Sign Out
              </Button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Button as="link" href="/signin" variant="solid">
                Sign In
              </Button>
            </li>
            <li>
              <Button as="link" href="/register" variant="outline">
                Join
              </Button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
