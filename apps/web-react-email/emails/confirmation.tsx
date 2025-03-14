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
  invitedByEmail: string;
  inviteLink: string;
  ip_address: string;
  createdAt: string;
  location: string;
}

export const DroidSentryInviteUserEmail = ({
  username,
  projectName,
  invitedByEmail,
  inviteLink,
  ip_address,
  createdAt,
  location,
}: DroidSentryInviteUserEmailProps) => {
  const previewText = `${projectName}に${username}さんのメールアドレスが登録されました。これは、メールアドレスが登録されたことをお知らせする自動通知です。 `;

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
              メールアドレス認証のお知らせ
            </Heading>
            <Text className="text-gray-700 text-lg font-medium mb-2">
              {username} 様
            </Text>
            <Text className="text-gray-700 text-lg mb-4">
              DroidSentryをご利用いただきありがとうございます。
            </Text>
            <Text className="text-gray-600 text-base leading-relaxed mb-6">
              <strong className="text-gray-800">{username}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              )
              のメールアドレスを認証するため、以下のボタンをクリックしてください。
            </Text>
            <Section className="text-center my-8">
              <Button
                className="bg-gray-800 rounded-xl text-white text-base font-medium no-underline text-center px-8 py-4"
                href={inviteLink}
              >
                メールアドレスを認証する
              </Button>
            </Section>
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
  invitedByEmail: "{{ .Data.email }}",
  inviteLink:
    "{{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}",
  ip_address: "{{ .Data.ip_address }}",
  createdAt: "{{ .Data.created_at }}",
  location: "{{ .Data.location }}",
} as DroidSentryInviteUserEmailProps;

export default DroidSentryInviteUserEmail;
