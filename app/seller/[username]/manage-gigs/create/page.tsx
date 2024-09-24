"use client";

// import { useEffect } from "react";
// import { useMutation } from "convex/react";
import { CreateForm } from "./_components/create-form";

interface CreateGigProps {
  params: {
    username: string;
  };
}

const CreateGig = ({ params }: CreateGigProps) => {
  return (
    <div className="flex justify-center">
      <CreateForm username={params.username} />
    </div>
  );
};

export default CreateGig;
