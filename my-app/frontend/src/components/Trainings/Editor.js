import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles for the editor

const EditorComponent = ({ value, onChange, title, setTitle }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.getEditor().setContents(value);
    }
  }, [value]);

  const handleChange = (content) => {
    onChange(content);
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    const quill = quillRef.current.getEditor();
    quill.format('color', color);
  };

  return (
    <div className="editor-container" style={{ marginTop: '10px' }}>
      <div className="toolbar" style={{ marginBottom: '10px' }}>
        <input type="color" onChange={handleColorChange} style={{ marginRight: '10px' }} />
      </div>
    
      <div className="editor-area" style={{ border: '2px solid #00d1b2', padding: '10px' }}>
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={handleChange}
          theme="snow"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['clean'] // remove formatting button
            ],
          }}
        />
      </div>
    </div>
  );
};

export default EditorComponent;
