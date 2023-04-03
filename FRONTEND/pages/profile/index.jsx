import Head from "next/head";
import styles from "../account/account.module.scss";

import useUser from "/lib/useUser.js";
import { MyAccount } from "/components/MyAccount";
import Container from "react-bootstrap/Container";

const Account = () => {
  const { user } = useUser({
    redirectTo: "/auth",
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Личный кабинет - Инкубатор талантов</title>
        <meta name="description" content="Инкубатор талантов" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="md" px="md" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
        <MyAccount user={user} />
      </Container>
    </div>
  );
};

export default Account;
