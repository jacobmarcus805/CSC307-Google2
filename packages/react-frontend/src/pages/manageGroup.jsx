import React, { useState, useEffect } from "react";
import MembersTable from "../components/membersTable";
import { useParams } from "react-router-dom";

function ManageGroup() {
  const { userId, groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function fetchGroup() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}`,
        );
        if (!response.ok)
          throw new Error(`Failed to fetch group: ${response.status}`);
        const data = await response.json();
        setGroup(data);
        const memberFetches = data.members.map((id) =>
          fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),
        );
        const fullMembers = await Promise.all(memberFetches);
        setMembers(fullMembers);
      } catch (err) {
        setError(err.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [groupId]);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!group.admins.some((admin) => admin.toString() === userId)) {
    return (
      <p>
        You do not have permission to view this page because you are not an
        admin.
      </p>
    );
  }
  console.log(group);
  console.log(members);

  function removeOneMember(index) {
    const updatedMembers = members.filter((_, i) => i !== index);
    const url = `${import.meta.env.VITE_API_BASE_URL}/groups/` + groupId;
    const updatedGroup = { ...group, members: updatedMembers };
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedGroup),
    })
      .then((res) => {
        if (res.status === 200) {
          setMembers([...updatedMembers]);
        } else {
          console.error(
            "Request status not OK, instead server gave ",
            res.status,
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="container">
      <MembersTable memberData={members} removeMember={removeOneMember} />
    </div>
  );
}

export default ManageGroup;
