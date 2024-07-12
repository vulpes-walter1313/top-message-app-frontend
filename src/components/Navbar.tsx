import { Link, useNavigate } from "@tanstack/react-router";
import Button from "./Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserStatus, logoutUser } from "../lib/queryFunctions";
import { HiOutlineMenu } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import { cn } from "../lib/utils";

function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
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
      <div className="lg:hidden">
        {mobileMenuVisible ? (
          <IoIosClose
            className="h-8 w-8"
            onClick={() => setMobileMenuVisible(false)}
          />
        ) : (
          <HiOutlineMenu
            className="h-8 w-8"
            onClick={() => setMobileMenuVisible(true)}
          />
        )}
      </div>
      <ul
        className={cn(
          "absolute left-0 top-[64px] flex h-[calc(100vh-64px)] w-screen -translate-x-full flex-col items-center justify-center gap-8 bg-zinc-50 transition-transform duration-300 ease-out lg:static lg:h-auto lg:w-auto lg:translate-x-0 lg:flex-row lg:bg-transparent",
          mobileMenuVisible && "translate-x-0",
        )}
      >
        {userQuery.data && userQuery.isSuccess ? (
          <>
            <li>
              <Link
                to="/dashboard"
                className="text-medium text-deskp text-zinc-900 hover:text-zinc-600"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/rooms"
                className="text-medium text-deskp text-zinc-900 hover:text-zinc-600"
              >
                Explore
              </Link>
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
