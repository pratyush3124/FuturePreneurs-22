import Head from "next/head";
import {useSession} from "next-auth/react";
import { NextResponse } from "next/server.js";
import LoginTempComponent from "../components/LoginTempComponent.jsx";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router.js";
import SearchTeams from "../components/SearchTeams.jsx";
import PendingRequests from "../components/PendingRequests.jsx"
import NavigationBar from "../components/NavigationBar.jsx";

export default function Home() {
  const {data:session, status} = useSession();
  const router = useRouter();
  
  // redirects to home if user not logged in 
  useEffect(()=>{
    if (router.isReady){
      if (status === "unauthenticated" && status!=="loading"){
          router.push("/")
      }
    }
  }, [status, router])

  return (
    <div className={styles.container}>
      <NavigationBar/>
      <br/>
      <PendingRequests/>
    </div>
  );
}