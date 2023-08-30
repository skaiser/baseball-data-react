import * as React from "react";

import { Header, PitchView } from "../components";
import css from '../styles/Home.module.css';

export const Home = () => {
  const title = "Astros";
  const logoUrl =
      "https://cdn.glitch.com/b4e96ff5-0789-4fd2-b6cd-b057aaad1090%2F117.svg?v=1629180035695";
  
  return (
    <>
      <Header name={title} logo={logoUrl} />
      <div className={css.content}>
        <p className={css.intro}>
          Select a pitcher from the options below to view pitch stats.
        </p>
        <PitchView></PitchView>
      </div>
    </>
  );
}
