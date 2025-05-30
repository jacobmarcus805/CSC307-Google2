import React from "react";
import PropTypes from "prop-types";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.memberData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.name}</td>
        <td>
          <button onClick={() => props.removeMember(index)}>Remove</button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function MembersTable(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        memberData={props.memberData}
        removeMember={props.removeMember}
      />
    </table>
  );
}

MembersTable.propTypes = {
  memberData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  removeMember: PropTypes.func.isRequired,
};

TableBody.propTypes = {
  memberData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  removeMember: PropTypes.func.isRequired,
};

export default MembersTable;
