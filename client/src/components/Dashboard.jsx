import React from 'react'

function Dashboard(props) {
    const username = props.location?.state?.username;// Optional chaining to avoid error

  return (
    <div>
   <h1>{username ? `Bienvenue ${username} !` : 'Bienvenue !'}</h1>

      <p>Ceci est le tableau de bord.</p>
    </div>
  )
}

export default Dashboard
