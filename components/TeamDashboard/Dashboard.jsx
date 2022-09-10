import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import CreateTeam from "./CreateTeam";
import Counter from "./Counter";
import LeaderDashboard from "./LeaderDashboard";
import TeamMembers from "./TeamMembers";
function Dashboard() {
  const [hasTeam, setHasTeam] = useState(true);
  const [isLeader, setIsLeader] = useState(false);
  const [teamData, setTeamData] = useState({
    _id: "6315b253eb1b17c9319cf39b",
    email: "devakreddy2004@gmail.com",
    name: "Devak Reddy",
    mobileNumber: "6304942898",
    teamId: {
      _id: "6315b261eb1b17c9319cf3a4",
      teamName: "MI",
      members: [
        {
          email: "devakreddy2004@gmail.com",
          name: "Devak Reddy",
          mobileNumber: "6304942898",
          id: "1",
        },
        {
          email: "devakreddy2004@gmail.com",
          name: "Devak Reddy",
          mobileNumber: "6304942898",
          id: "2",
        },
        {
          email: "devakreddy2004@gmail.com",
          name: "Devak Reddy",
          mobileNumber: "6304942898",
          id: "3",
        },
        {
          email: "devakreddy2004@gmail.com",
          name: "Devak Reddy",
          mobileNumber: "6304942898",
          id: "4",
        },

      ],
    },
  });

  // const teamNameRef = useRef(null);
  const { data: session } = useSession();
 
  console.log(session, "in dashboard");

  // for getting user details
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzE1YjI1M2ViMWIxN2M5MzE5Y2YzOWIiLCJpYXQiOjE2NjI1NTc4MzcsImV4cCI6MTY2MjY0NDIzN30.hrXeK3X7ZK17tQ3M7UWcchybMBTGfUyhTspu7xBOcqU`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((data) => data.json())

      .then((data) => {
        if (data.user.teamId === null) {
          setHasTeam((prev) => !prev);
        }
        if (data.user) {
          setTeamData(data.user);
        }
        console.log(teamData.teamId.members.length);
        console.log(teamData.teamId.teamName);
        console.log(data);
      })

      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
    console.log(hasTeam);
  }, []);

  return (
    <div>
      <Counter></Counter>
      {hasTeam ? (

        <>
          {
            isLeader ? (
              <LeaderDashboard teamData={teamData} />
            )
              :
              (
                <TeamMembers teamData={teamData} />
              )
          }
        </>
      )
        : (
          // If team is not there
          <CreateTeam />
        )
      }
    </div >
  );
}

export default Dashboard;