"use client";

import type { Spot, Person, Volunteer } from "../lib/types";

import { FC, Fragment, useState } from "react";
import { pluralize, toTitleCase } from "../lib/helpers";
import Modal from "../lib/Modal";
import { colors } from "../lib/colors";

const spotStyles = {
  margin: "0 auto",
  minWidth: "80%",
  width: "100%",

  border: `2px solid ${colors.cardHeader}`,
  borderRadius: "8px",

  background: colors.cardHeader,
  color: "white",
} as const;

const headerStyles = {
  padding: "4px",
} as const;

const mainStyles = {
  padding: "4px",
  background: colors.bg,
  color: "gray",
  textAlign: "left",
  display: "grid",
} as const;

const rangeStyles = {
  display: "flex",
  alignItems: "center",
  padding: "4px",
  borderBottom: "1px solid lightgray",
  color: "darkslategray",
} as const;

const hourCellStyles = {
  display: "flex",
  alignItems: "center",
  height: "100%",
  minWidth: "48px",
  padding: "4px",
  borderRight: "1px solid lightgray",
  paddingRight: "8px",
};

const rowStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
} as const;

const SpotCalendar: FC<
  Spot & {
    showHalfHour?: boolean;
    index: number;
    data: ReadonlyArray<ReadonlyArray<string>>;
  }
> = ({
  isSpot,
  name,
  minPersons,
  owner,
  hash,
  hours,
  showHalfHour = true,
  index,
  data,
}) => {
  if (!isSpot) return;

  const volunteers = data
    .map(([, email, name, phone, ...hours]) => ({ email, name, phone, hours }))
    .filter(({ hours }) => !!hours[index])
    .map((person) => ({ ...person, hours: person.hours[index].split(", ") }));

  return (
    <div style={spotStyles}>
      <header style={headerStyles}>
        <h2 id={hash}>{name}</h2>
      </header>

      <main style={mainStyles}>
        {hours.map((h) => (
          <Fragment key={`${name}-{h}`}>
            <HourRow
              h={h}
              volunteers={volunteers}
              spotName={name}
              minPersons={minPersons}
            />
            {showHalfHour && (
              <HourRow
                h={h}
                volunteers={volunteers}
                spotName={name}
                minPersons={minPersons}
                isHalf
              />
            )}
          </Fragment>
        ))}
      </main>

      <footer>
        min {minPersons} {pluralize("personne", minPersons)}
        {!!owner && ` | Référent: ${owner}`}
      </footer>
    </div>
  );
};

const HourRow: FC<{
  spotName: string;
  h: number;
  volunteers: ReadonlyArray<Volunteer>;
  minPersons?: number;
  isHalf?: boolean;
}> = ({ spotName, h, volunteers, minPersons, isHalf = false }) => {
  const hour = `${h}:${isHalf ? "30" : "00"}`;
  const personsOnHour = volunteers.filter(({ hours }) => hours.includes(hour));

  const isUnderCapacity = !!minPersons && personsOnHour.length < minPersons;

  const capacityStyles =
    personsOnHour.length === 0
      ? {
          color: "white",
          background: "tomato",
          fontWeight: "bold",
        }
      : isUnderCapacity
        ? {
            color: "white",
            background: "orange",
            fontWeight: "bold",
          }
        : null;

  return (
    <>
      <div style={rangeStyles}>
        <span style={{ ...hourCellStyles, ...capacityStyles }}>{hour}</span>
        <ul style={rowStyles}>
          {personsOnHour.map((person) => (
            <PersonCard key={`${spotName}-${person.name}`} {...person} />
          ))}
        </ul>
      </div>
    </>
  );
};

const personCardStyles = {
  listStyleType: "none",
  borderRadius: "25px",
  padding: "4px 8px",
  background: colors.title,
  color: "white",
  cursor: "pointer",
} as const;

const PersonCard: FC<Person> = ({ name, phone }) => {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const fullName = toTitleCase(name);

  return (
    <>
      <li style={personCardStyles} onClick={() => setIsDialogOpened(true)}>
        {toTitleCase(fullName)}
      </li>
      {isDialogOpened && (
        <Modal isOpened closeModal={() => setIsDialogOpened(false)}>
          <div>{fullName}</div>
          {!!phone && <a href={`tel:${phone}`}>Appeler</a>}
        </Modal>
      )}
    </>
  );
};

export default SpotCalendar;
