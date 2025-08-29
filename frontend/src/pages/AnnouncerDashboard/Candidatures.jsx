import React, { useEffect, useState } from "react";
import axios from "axios";
import CVPreview from "../../components/cv/CvPreview";

const ApplicantsCV = ({ jobId }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get(`/api/applications/job/${jobId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
    .then(res => setApplications(res.data))
    .catch(err => console.error(err));
  }, [jobId]);

  if (!applications.length) return <p>Aucune candidature pour cette annonce.</p>;

  return (
    <div>
      {applications.map(app => (
        <div key={app._id} className="mb-8 border p-4 rounded shadow">
          <h2 className="font-bold">{app.applicant.name}</h2>
          <p>Email: {app.applicant.email}</p>
          <CVPreview resume={app.resume} />
        </div>
      ))}
    </div>
  );
};

export default ApplicantsCV;
