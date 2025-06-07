import React from "react";

const Files = () => {
  // Place your files in: my-app/frontend/public/files/
  const files = [
    { name: "Formularz Zgloszeniowy", path: "/files/formularz-zgloszeniowy-zlk4.docx" },
    { name: "Zgoda rodzica opiekuna", path: "/files/oswiadczenie-opiekuna.pdf" },
    { name: "Zlk Regulamin", path: "/files/ZLK-Regulamin4.pdf" },
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