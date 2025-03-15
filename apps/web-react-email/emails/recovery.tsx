import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { tailwindReactEmailConfig } from "./lib/tailwind-config";

interface DroidSentryInviteUserEmailProps {
  username: string;
  projectName: string;
  token: string;
  ip_address: string;
  createdAt: string;
  location: string;
}

export const DroidSentryInviteUserEmail = ({
  username,
  projectName,
  token,
  ip_address,
  createdAt,
  location,
}: DroidSentryInviteUserEmailProps) => {
  const previewText = `${projectName}に登録されている${username}さんのパスワードリセットが申請されました。これは、パスワードリセットをお知らせする自動通知です。 `;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={tailwindReactEmailConfig}>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-gray-200 rounded-xl my-10 mx-auto p-5 max-w-[500px] bg-white shadow-md">
            <Section className="mt-4 mb-8">
              <Img
                src={`https://droidsentry.net/images/logo.png`}
                width="90"
                height="90"
                alt="logo"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-2xl font-bold text-center text-gray-900 mb-6">
              パスワードリセットのお知らせ
            </Heading>
            <Text className="text-gray-700 text-lg font-medium mb-2">
              {username} 様
            </Text>
            <Text className="text-gray-700 text-base mb-4">
              下記コードを専用のフォームに入力して、
              パスワードリセットを完了してください。
            </Text>
            <Text className="text-gray-600 text-center leading-relaxed py-5">
              <strong className="text-gray-800 text-4xl">{token}</strong>
            </Text>
            <Text className="text-gray-600 text-base leading-relaxed mb-6">
              このコードは、共有しないでください。
            </Text>
            <Hr className="border border-solid border-gray-200 my-8 w-full" />
            <Text className="text-zinc-500 text-sm leading-relaxed">
              <strong>このメールに心当たりは、ありませんか？</strong>
              <br />
              <span className="text-gray-700 font-bold">
                このメールは {username} 様に向けて{createdAt}に、 {ip_address}、
                {location}
                からリクエストされました。
              </span>
              <br />
              このメールに心当たりがない場合は、このメールを無視してください。
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

DroidSentryInviteUserEmail.PreviewProps = {
  username: "{{ .Data.username }}",
  projectName: "DroidSentry",
  token: "{{ .Token }}",
  ip_address: "{{ .Data.ip_address }}",
  createdAt: "{{ .Data.created_at }}",
  location: "{{ .Data.location }}",
} as DroidSentryInviteUserEmailProps;

export default DroidSentryInviteUserEmail;
