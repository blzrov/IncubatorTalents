import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";

import { sessionOptions } from "/lib/session";
import { withIronSessionSsr } from "iron-session/next";

import axios from "/utils/rest";
import Container from "react-bootstrap/Container";
import { SimpleGrid, Text, Space, Image, Card, Group, Button, useMantineTheme, Loader, Progress } from "@mantine/core";

export default function Home({ courses }) {
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <Head>
        <title>Инкубатор талантов</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Space h="xl" />
        <div style={{ color: "#036459", fontSize: "24px", fontWeight: "600" }}>Мои курсы</div>
        <Space h="lg" />
        <SimpleGrid cols={3}>
          {courses.map(({ course, tasks, tasks_ready }) => {
            return (
              <Link key={course.id} passHref href={`/courses/${course.id}`}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ paddingBottom: "6px", cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center p-2">
                    <Image radius={100} src={"/" + course.image} height={130} width={130} alt="Инкубатор талантов" />
                    <div style={{ paddingLeft: "20px" }}>
                      <div style={{ fontSize: "14px", color: "#036459" }}>{course.name}</div>
                      <div style={{ fontSize: "14px", color: "#036459", paddingLeft: "10px" }}>
                        <span style={{ color: "#1FBEAC" }}>{tasks_ready}</span> выполнено
                      </div>
                      <div style={{ fontSize: "14px", color: "#036459", paddingLeft: "10px" }}>
                        <span style={{ color: "#1FBEAC" }}>{tasks - tasks_ready}</span> осталось
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "end", fontSize: "16px", color: "#1FBEAC" }}>
                    {Math.round((tasks_ready / tasks) * 100)}%
                  </div>
                  <Progress
                    style={{ marginTop: "auto" }}
                    color="#1FBEAC"
                    size="sm"
                    value={(tasks_ready / tasks) * 100}
                  />
                  {/* <Card.Section style={{ position: "relative" }}>
                    <Image src={"/" + course.image} height={125} alt="Инкубатор талантов" />
                  </Card.Section>
                  <Group position="apart">
                    <Text weight={500}>{course.name}</Text>
                  </Group>
                  <div style={{ textAlign: "end", fontSize: "16px", color: "#1FBEAC" }}>
                    {Math.round((tasks_ready / tasks) * 100)}%
                  </div>
                  <Progress
                    style={{ marginTop: "auto" }}
                    color="#1FBEAC"
                    size="sm"
                    value={(tasks_ready / tasks) * 100}
                  /> */}
                </Card>
              </Link>
            );
          })}
        </SimpleGrid>
      </Container>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps({ req }) {
  if (!req.cookies["user-cookies"]) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  const response = await axios.get(`/public/courses`, {
    headers: {
      Cookie: `user-cookies=${req.cookies["user-cookies"]};`,
    },
  });
  let courses = [];
  if (response.status === 200) {
    courses = response.data;
  }
  return {
    props: {
      courses: courses,
      user: req.session.user,
    },
  };
}, sessionOptions);
