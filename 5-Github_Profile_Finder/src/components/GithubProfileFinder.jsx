import React, { useEffect, useState } from 'react';
import './styles.css'

function GithubProfileFinder() {
  const [username, setUsername] = useState('muhammadfahad'); // Default to a valid GitHub username format
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchGithubUserData() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (username.trim() !== '') {
      fetchGithubUserData();
    }
  }

  // Fetch default profile on initial mount
  useEffect(() => {
    fetchGithubUserData();
  }, []);

  return (
    <>
      <div className='main-container'>
        <div className='input-wrapper'>
          <input
            name='search-by-username'
            type="text"
            placeholder='Search Github Username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button onClick={handleSubmit}>Search</button>
        </div>

        {/* Loading State */}
        {loading && <h1 className="loading">Loading data... Please wait.</h1>}

        {/* Error State */}
        {error && <h1 className="error-message">{error}</h1>}

        {/* UI Profile Card Display */}
        {userData !== null && !loading && !error && (
          <div className="profile-card">
            <img 
              src={userData.avatar_url} 
              className="avatar" 
              alt="User Avatar" 
              style={{ width: '150px', borderRadius: '50%' }}
            />
            <div className="profile-info">
              <a href={userData.html_url} target="_blank" rel="noreferrer">
                {userData.name || userData.login}
              </a>
              <p>Joined on {new Date(userData.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}</p>
              <p>Public Repos: {userData.public_repos}</p>
              <p>Followers: {userData.followers}</p>
              <p>Following: {userData.following}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GithubProfileFinder;
