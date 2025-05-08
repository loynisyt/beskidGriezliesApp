import React, { useState, useEffect } from 'react';

const AttendanceModal = ({ onClose }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [season, setSeason] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendanceData = async (selectedSeason) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const url = selectedSeason ? `http://localhost:5000/api/participant/attendance?season=${selectedSeason}` : 'http://localhost:5000/api/participant/attendance';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      const data = await response.json();
      setAttendanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(season);
  }, [season]);

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="box">
          <h1 className="title">Attendance Percentage</h1>
          <div className="field">
            <label className="label">Season:</label>
            <div className="control">
              <div className="select">
                <select value={season} onChange={(e) => setSeason(e.target.value)}>
                  <option value="1">Season 1</option>
                  <option value="2">Season 2</option>
                  <option value="3">Season 3</option>
                  <option value="4">Season 4</option>
                </select>
              </div>
            </div>
          </div>
          {loading && <p>Loading...</p>}
          {error && <p className="has-text-danger">{error}</p>}
          {!loading && !error && (
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Full Name</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.username}</td>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.attendance_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="buttons">
            <button className="button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default AttendanceModal;
