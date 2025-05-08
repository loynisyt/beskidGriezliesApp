import React from "react";

const Files = () => {
  // List of files to display (these should match the files in your public-files directory)
  const files = [
    { name: "Formularz Zgloszeniowy", path: "my-app/frontend/public/files/formularz-zgloszeniowy-zlk4.docx" },
    { name: "Zgoda rodzica opiekuna", path: "my-app/frontend/public/files/oswiadczenie-opiekuna.pdf" },
    { name: "Zlk Regulamin", path: "my-app/frontend/public/files/oswiadczenie-opiekuna.pdf" },

  ];

  return (
    <div className="container mt-6">
      <h1 className="title has-text-centered">Pliki do Pobrania</h1>
      <div className="box">
        <ul>
          {files.map((file, index) => (
            <li key={index} className="mb-3">
              <a
                href={file.path}
                download
                className="button is-link is-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Files;