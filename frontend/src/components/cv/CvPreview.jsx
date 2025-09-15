const CVPreview = ({ resume }) => {
  if (!resume) return <div>CV non disponible ou privé</div>;

  const profile = resume.profileInfo || {};
  const contact = resume.contactInfo || {};
  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const interests = resume.interests || [];
  const workExperience = resume.workExperience || [];
  const education = resume.education || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow max-h-screen overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Colonne gauche */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          {/* Profil */}
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h1 className="text-3xl font-extrabold text-gray-800">{profile.fullName || "Nom"}</h1>
            <h2 className="text-xl text-gray-600">{profile.designation || "Poste"}</h2>
            <p className="mt-2 text-gray-700">{profile.summary || "Résumé non disponible"}</p>
          </div>

          {/* Contact */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">Contact</h3>
            <p>Email: <span className="text-blue-500">{contact.email || "Non renseigné"}</span></p>
            <p>Téléphone: <span className="text-blue-500">{contact.phone || "Non renseigné"}</span></p>
          </div>

          {/* Compétences */}
          {skills.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-700 mb-2">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill.name} ({skill.progress || 0}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-700 mb-2">Langues</h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, i) => (
                  <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {lang.name} ({lang.progress || 0}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Centres d’intérêt */}
          {interests.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-700 mb-2">Centres d’intérêt</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
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
          {workExperience.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-700 mb-2">Expériences</h3>
              {workExperience.map((exp, i) => (
                <div key={i} className="mb-3 border-l-4 border-blue-400 pl-3">
                  <p className="font-semibold">{exp.role || "Rôle"} @ {exp.company || "Entreprise"}</p>
                  <p className="text-gray-500 text-sm">{exp.startDate || "Début"} - {exp.endDate || "Fin"}</p>
                  <p className="text-gray-700">{exp.description || ""}</p>
                </div>
              ))}
            </div>
          )}

          {/* Éducation */}
          {education.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-700 mb-2">Éducation</h3>
              {education.map((edu, i) => (
                <div key={i} className="mb-3 border-l-4 border-green-400 pl-3">
                  <p className="font-semibold">{edu.degree || "Diplôme"} @ {edu.institution || "Établissement"}</p>
                  <p className="text-gray-500 text-sm">{edu.startDate || "Début"} - {edu.endDate || "Fin"}</p>
                </div>
              ))}
            </div>
          )}

          {/* Projets */}
          {projects.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-700 mb-2">Projets</h3>
              {projects.map((project, i) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold">{project.title || "Titre"}</p>
                  <p className="text-gray-700">{project.description || ""}</p>
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
          {certifications.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-700 mb-2">Certifications</h3>
              <ul className="list-disc list-inside text-gray-700">
                {certifications.map((cert, i) => (
                  <li key={i}>{cert.title || "Titre"} – {cert.issuer || "Émetteur"} ({cert.year || "Année"})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CVPreview;