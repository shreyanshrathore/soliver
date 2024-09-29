"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const ConnectStripe = () => {
  const router = useRouter();

  const createStripe = useAction(api.users.createStripe);

  return (
    <div>
      <Button
        onClick={async () => {
          const url = await createStripe();
          if (url === null) return;
          router.push(url);
        }}
        variant={"secondary"}
      >
        Connect stripe
      </Button>
    </div>
  );
};
export default ConnectStripe;
