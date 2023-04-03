import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.scss";

import Logo from "/public/logo.png";

import { Button, Grid } from "@mantine/core";
import Container from "react-bootstrap/Container";

export const Header = ({ user }) => {
  return (
    <Container>
      <Grid className={styles.header}>
        <Grid.Col span={8} className={styles.menu} justify="center">
          <Link href="/" passHref>
            <Image src={Logo} alt="Инкубатор талантов" width={150} height={45} />
          </Link>
          {user?.status === "admin" && (
            <>
              <Link href="/">Главная</Link>
            </>
          )}
          <Link href={user?.status === "admin" ? "/account" : "/"}>Курсы</Link>
          {user?.status === "admin" && (
            <>
              <Link href="/check">Проверка</Link>
              <Link href="/users">Управление</Link>
            </>
          )}

          <Link href="/profile">Профиль</Link>
          {user && user?.email ? null : (
            <Link href="/auth" passHref>
              <Button variant="light">Войти</Button>
            </Link>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};
