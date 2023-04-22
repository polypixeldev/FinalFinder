import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { trpc } from "@/utils/trpc";
import Button from "@/components/Button";
import StudySession from "@/components/Session";

export default function Exam() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });
  const router = useRouter();
  const examSlug = router.query["exam"];

  const exam = trpc.getExam.useQuery({
    slug: Array.isArray(examSlug) ? "" : examSlug ?? "",
  });
  return (
    <div className="flex flex-col items-center justify-start">
      <h1 className="text-center text-2xl font-bold">{exam.data?.name}</h1>
      <p className="my-2 text-lg">
        {exam.data?.dates
          .find(
            (d) =>
              d.users.findIndex((u) => u.userId === session?.user.id) !== -1
          )
          ?.date.toLocaleDateString()}
      </p>

      <div className="my-2 w-5/6">
        <Button
          onClick={() => {
            // TODO: direct to slack channel
          }}
        >
          <p className="text-center text-lg">Slack Channel</p>
        </Button>
      </div>

      <div className="my-2 w-5/6 rounded-md bg-gray-2 p-2">
        <h2 className="text-center text-xl">People</h2>
        <div className="flex flex-row flex-wrap items-center justify-start">
          {exam.data?.users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center justify-start"
            >
              <Image
                src={
                  user.image ??
                  "https://github.com/hackclub/dinosaurs/blob/main/confused_dinosaur.png?raw=true"
                }
                alt="User avatar"
                width={50}
                height={50}
              />
              <p>{user.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-2 w-5/6 rounded-md bg-gray-2 p-2">
        <h2 className="text-center text-xl">Study Sessions</h2>
        <div className="my-2 w-full">
          {exam.data?.sessions.map((session) => {
            return (
              <StudySession
                key={session.id}
                name={session.examName}
                time={session.time}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}