import Image from "next/image";
import ThermalField from "@/components/thermal-field";
import styles from "./launch.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <ThermalField />
      <header className={styles.header}>
        <Image
          src="/meso-logo.png"
          alt="Meso Manufacturing"
          width={2686}
          height={1000}
          sizes="(max-width: 600px) 156px, 184px"
          loading="eager"
          className={styles.logo}
        />
      </header>
      <section className={styles.message} aria-labelledby="launch-heading">
        <p className={styles.kicker}>Something is taking shape.</p>
        <h1 id="launch-heading">
          Launching soon<span>.</span>
        </h1>
      </section>
      <footer className={styles.footer}>
        <a className={styles.contact} href="mailto:contact@mesomanufacturing.com">
          <span>Get in touch</span>
          <span>contact@mesomanufacturing.com</span>
        </a>
        <span>© {new Date().getFullYear()} Meso Manufacturing</span>
      </footer>
    </main>
  );
}
