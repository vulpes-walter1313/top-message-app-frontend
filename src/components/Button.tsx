import React from "react";
import { cn } from "../lib/utils";
import { Link } from "@tanstack/react-router";

type ButtonProps =
  | {
      as: "link";
      children: React.ReactNode | string;
      href: string;
      variant: "solid" | "outline";
    }
  | {
      as: "submit";
      children: string;
      variant: "solid" | "outline";
    }
  | {
      as: "toggle";
      onClick: React.Dispatch<React.SetStateAction<boolean>>;
      variant: "solid" | "outline";
      children: string;
    }
  | {
      as: "button";
      onClick: React.MouseEventHandler<HTMLButtonElement>;
      variant: "solid" | "outline";
      children: string;
    };
export default function Button(props: ButtonProps) {
  let styles = "py-2 px-6 block leading-none";

  switch (props.variant) {
    case "solid":
      styles = cn(
        styles,
        "text-zinc-50 bg-emerald-500 font-semibold rounded-full text-lg flex justify-center items-center",
      );
      break;
    case "outline":
      styles = cn(
        styles,
        "text-emerald-500 border-2 border-emerald-500 font-semibold rounded-full text-lg",
      );
      break;
    default:
      break;
  }
  if (props.as === "link") {
    return (
      <Link to={props.href} className={styles}>
        {props.children}
      </Link>
    );
  }
  if (props.as === "toggle") {
    return (
      <button
        className={styles}
        type="submit"
        onClick={() => props.onClick((bool) => !bool)}
      >
        {props.children}
      </button>
    );
  }
  if (props.as === "submit") {
    return (
      <button className={styles} type="submit">
        {props.children}
      </button>
    );
  }
  if (props.as === "button") {
    return (
      <button className={styles} type="button" onClick={props.onClick}>
        {props.children}
      </button>
    );
  }
}
