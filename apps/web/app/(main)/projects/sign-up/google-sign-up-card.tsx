"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSignUpUrl } from "@/lib/actions/emm/enterprise";
import { cn } from "@/lib/utils";
import { ExternalLink, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function GoogleSignUpCard({
  className,
}: {
  className?: string;
}) {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name");
  const projectId = searchParams.get("Id");

  const handleGoogleSignUp = async () => {
    if (!projectId || !projectName) {
      return;
    }
    startTransition(async () => {
      await getSignUpUrl({ projectId, currentUrl, projectName })
        .then((url) => {
          window.open(url, "_blank");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    });
  };
  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  return (
    <Card className={cn("max-w-md flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-center mb-8">
          Googleにサインアップする
        </CardTitle>
        <CardDescription className="space-y-4">
          <p>プロジェクト名: {projectName}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Androidを管理するために、Googleのサインアップページが必要となります。
        </p>
        <p>Googleアカウントをご用意していただいた上で、</p>
        <p>以下のボタンをクリックしてください。</p>
      </CardContent>

      <CardFooter className="mt-4">
        <Button
          className="w-full pl-11"
          onClick={handleGoogleSignUp}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <span className="font-bold">サインアップページへ</span>
              <ExternalLink className="size-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
