import React from "react";

const CVPreview = ({ resume }) => (
  <div className="bg-gray-50 p-6 rounded-xl shadow max-h-screen overflow-y-auto">
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Colonne gauche */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        {/* Profil */}
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">{resume.profileInfo.fullName || "Nom"}</h1>
          <h2 className="text-xl text-gray-600">{resume.profileInfo.designation}</h2>
          <p className="mt-2 text-gray-700">{resume.profileInfo.summary}</p>
        </div>

        {/* Contact */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-gray-700 mb-2">Contact</h3>
          <p>Email: <span className="text-blue-500">{resume.contactInfo.email}</span></p>
          <p>Téléphone: <span className="text-blue-500">{resume.contactInfo.phone}</span></p>
        </div>

        {/* Compétences */}
        {resume.skills.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {skill.name} ({skill.progress}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Langues */}
        {resume.languages.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">Langues</h3>
            <div className="flex flex-wrap gap-2">
              {resume.languages.map((lang, i) => (
                <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {lang.name} ({lang.progress}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Centres d’intérêt */}
        {resume.interests.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">Centres d’intérêt</h3>
            <div className="flex flex-wrap gap-2">
              {resume.interests.map((interest, i) => (
                <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Colonne droite */}
      <div className="lg:w-2/3 flex flex-col gap-6">
        {/* Expériences */}
        {resume.workExperience.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">Expériences</h3>
            {resume.workExperience.map((exp, i) => (
              <div key={i} className="mb-3 border-l-4 border-blue-400 pl-3">
                <p className="font-semibold">{exp.role} @ {exp.company}</p>
                <p className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Éducation */}
        {resume.education.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">Éducation</h3>
            {resume.education.map((edu, i) => (
              <div key={i} className="mb-3 border-l-4 border-green-400 pl-3">
                <p className="font-semibold">{edu.degree} @ {edu.institution}</p>
                <p className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projets */}
        {resume.projects.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">Projets</h3>
            {resume.projects.map((project, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold">{project.title}</p>
                <p className="text-gray-700">{project.description}</p>
                <div className="flex gap-2 mt-1">
                  {project.github && (
                    <a href={project.github} className="text-blue-500 underline text-sm" target="_blank" rel="noreferrer">GitHub</a>
                  )}
                  {project.liveDemo && (
                    <a href={project.liveDemo} className="text-green-500 underline text-sm" target="_blank" rel="noreferrer">Démo</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">Certifications</h3>
            <ul className="list-disc list-inside text-gray-700">
              {resume.certifications.map((cert, i) => (
                <li key={i}>{cert.title} – {cert.issuer} ({cert.year})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default CVPreview;
