import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              <div>
                <img src="https://img.freepik.com/free-vector/people-ask-frequently-asked-questions_102902-2339.jpg?w=996&t=st=1714423242~exp=1714423842~hmac=f33bac136cbc12792e2addb1b4209a8a8a1c59a6f371bf98b73999ec49813fa0" loading="lazy" alt="Photo by Martin Sanchez" className="h-full w-full object-cover object-center" />
              </div>
            </div>

            <div className="md:pt-8">
              <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6 md:text-left">Bienvenue sur Quoiz ! </h1>

              <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">
                Bienvenue sur Quoiz, l'application ultime pour tester vos connaissances dans une variété de sujets passionnants ! Que vous soyez un amateur de sport, un cinéphile ou un passionné d'histoire, Quoiz a quelque chose pour vous ! Le but ? Être le meilleur et faire le meilleur score dans tous les domaines. Vous pouvez même ajouter des questions plus pointues pour garder votre avance et maintenir votre statut de champion !
              </p>

              <h2 className="mb-2 text-center text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4 md:text-left">À propos de nous</h2>

              <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">
                Chez Quoiz, notre mission est de rendre l'apprentissage amusant et stimulant. Nous croyons que chaque question posée est une opportunité d'apprentissage et de découverte. Notre équipe travaille sans relâche pour créer des quiz divertissants et éducatifs qui vous permettront de tester vos connaissances et d'en apprendre davantage sur le monde qui vous entoure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
