import React from "react";

const OutdatedWorkouts = ({ trainings }) => {
  if (!trainings || trainings.length === 0) {
    return <p className="has-text-centered">No outdated workouts.</p>;
  }

  return (
    <div className="outdated-workouts-container">
      {trainings.map((training) => (
        <div key={training.id} className="box mb-4">
          <h4 className="title is-5 has-text-weight-bold">{training.title}</h4>
          <p className="label">
            {new Date(training.date).toLocaleDateString("en-GB")}
          </p>
          <p
            className="label"
            dangerouslySetInnerHTML={{ __html: training.description_html }}
          />
        </div>
      ))}
    </div>
  );
};

export default OutdatedWorkouts;
