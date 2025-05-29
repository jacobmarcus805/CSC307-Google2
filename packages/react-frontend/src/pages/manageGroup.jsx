import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

function ManageGroup() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [users, setUsers] = useState(null);
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
        //setUsers(data["members"]);
      } catch (err) {
        setError(err.message);
        console.log(error);
      } finally {
        console.log(loading);
        setLoading(false);
      }
    }
    fetchGroup();
  }, [groupId]);
  console.log(group);
}

export default ManageGroup;
