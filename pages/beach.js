import { useEffect, useState } from "react";
import Modal from "../components/modal";
import { AnimatePresence } from "framer-motion";
import Loading from "../components/Loading";
import { useSession } from "next-auth/react";
import useTimer from "../hooks/useTimer";
import myContext from "../store/myContext";
import { useContext } from "react";
import { useRouter } from "next/router";
import styles from "../styles/MainQuiz.module.css";

export default function PhaserGame() {
  const [prompt, setPrompt] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const [endTime, setEndTime] = useState();
  const router = useRouter();

  const { hours, minutes, seconds } = useTimer("2022-10-15T18:45:33.927Z");

  const myCtx = useContext(myContext);
  const TEAM_ID = myCtx.teamId;

  useEffect(() => {
    setIsLoading(true);
    async function initPhaser() {
      const Phaser = await import("phaser");
      const { default: GridEngine } = await import("grid-engine");
      const { default: TestScene } = await import("../scenes/beach/beachGame");

      const phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        title: "round-one-beach",
        parent: "game-content",
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
        pixelArt: true,
        scale: {
          zoom: 2,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [TestScene],
        physics: {
          default: "arcade",
          arcade: {
            debug: true,
          },
        },
        plugins: {
          scene: [
            {
              key: "gridEngine",
              plugin: GridEngine,
              mapping: "gridEngine",
            },
          ],
        },
        backgroundColor: "#f8d193",
      });

      setIsLoading(false);
    }
    initPhaser();
  }, []);

  useEffect(() => {
    const dialogBoxEventListener = ({ detail }) => {
      setPrompt(detail.areaName);
    };
    window.addEventListener("prompt", dialogBoxEventListener);
  }, []);

  const closePrompt = (reply) => {
    console.log(reply)
    if (reply) {
      console.log(reply.slice(-1));
      if (session) {
        fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/team/roundtwo/${TEAM_ID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessTokenBackend}`,
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              boxChoice: 1,
            }),
          }
        )
          .then(async (response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            // after submitting box no.
            window.location = "/instructions";
          });
      }
    }
    setPrompt(false);

    // const customEvent = new CustomEvent('promptClosed', {
    // });
    // window.dispatchEvent(customEvent);
  };

  return (
    <>
      {" "}
      {/* <Game/> */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {" "}
          {endTime && (
            <div className={styles.starting}>
              <div className={styles.btn}>
                <a href="#" className={`${styles.button_2} ${styles.w_button}`}>
                  {" "}
                  {hours}: {minutes}: {seconds}{" "}
                </a>{" "}
              </div>{" "}
            </div>
          )}{" "}
          <div id="game-content" key="game-content">
            {" "}
          </div>{" "}
          <AnimatePresence
            initial={false}
            exitBeforeEnter={true}
            onExitComplete={() => null}
          >
            {prompt && (
              <Modal
                modalOpen={prompt}
                handleClose={() => {
                  closePrompt(false);
                }}
                text={`Do you want to place your resort in ${prompt}?`}
                text1={"This action can't be reversed!!"}
                text2={"Yes I'm sure"}
                text2func={() => {
                  closePrompt(prompt);
                }}
              />
            )}{" "}
          </AnimatePresence>{" "}
        </>
      )}
    </>
  );
}
