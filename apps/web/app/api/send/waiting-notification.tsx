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

interface DroidSentryWaitingNotificationEmailProps {
  username: string;
  projectName: string;
  queuePosition: string;
  estimatedTime: string;
  ip_address: string;
  createdAt: string;
  location: string;
}

export const DroidSentryWaitingNotificationEmail = ({
  username,
  projectName,
  queuePosition,
  estimatedTime,
  ip_address,
  createdAt,
  location,
}: DroidSentryWaitingNotificationEmailProps) => {
  const previewText = `${projectName}に登録されている${username}さんのウェイティングリスト登録が完了しました。これは、ウェイティングリスト登録をお知らせする自動通知です。`;
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
              順番待ちリストへの登録完了
            </Heading>
            <Text className="text-gray-700 text-lg font-medium mb-2">
              {username} 様
            </Text>
            <Text className="text-gray-700 text-base mb-4">
              {projectName}の順番待ちリストへの登録が完了しました。
            </Text>

            <Text className="text-gray-600 text-base leading-relaxed mb-6">
              順番が来ましたら、改めてご連絡いたします。
              しばらくお待ちいただきますようお願い申し上げます。
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

DroidSentryWaitingNotificationEmail.PreviewProps = {
  username: "TEST",
  projectName: "DroidSentry",
  queuePosition: "1",
  estimatedTime: "10分",
  ip_address: "192.168.1.1",
  createdAt: "2021-01-01 12:00:00",
  location: "Tokyo, Japan",
} as DroidSentryWaitingNotificationEmailProps;

export default DroidSentryWaitingNotificationEmail;
