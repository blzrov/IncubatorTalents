import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.scss";

import Logo from "/public/logo.png";
import { CalendarEvent, Bell, ListDetails, UserCircle, CameraSelfie, Checks } from "tabler-icons-react";
import { Button, Grid } from "@mantine/core";
import Container from "react-bootstrap/Container";

export const Header = ({ user }) => {
  return (
    <Container>
      <Grid className={styles.header}>
        <Grid.Col span={3}>
          <Link href="/" passHref>
            <Image src={Logo} alt="Инкубатор талантов" width={200} height={77} />
          </Link>
        </Grid.Col>
        <Grid.Col span={9} className={styles.menu} align="right">
          {user?.status === "admin" && (
            <>
              <Link href="/">
                <div style={{ textAlign: "center" }}>
                  <Checks size={24} />
                  <div>Главная</div>
                </div>
              </Link>
            </>
          )}
          <Link href={user?.status === "admin" ? "/account" : "/"}>
            <div style={{ textAlign: "center" }}>
              <ListDetails size={24} />
              <div>Курсы</div>
            </div>
          </Link>
          {user?.status === "admin" && (
            <>
              <Link href="/check">
                <div style={{ textAlign: "center" }}>
                  <Checks size={24} />
                  <div>Проверка</div>
                </div>
              </Link>
              <Link href="/users">
                <div style={{ textAlign: "center" }}>
                  <UserCircle size={24} />
                  <div>Управление</div>
                </div>
              </Link>
            </>
          )}

          <Link href="/profile">
            <div style={{ textAlign: "center" }}>
              <CameraSelfie size={24} />
              <div>Профиль</div>
            </div>
          </Link>
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
