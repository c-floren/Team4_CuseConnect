import { useState } from "react";
import "./ClubDetailsPage.css";

const clubs = [
  {
    name: "SU Robotics Club",
    img: "https://picsum.photos/seed/robotics/200",
    meets: "Thursdays, 6 PM · Link Hall",
    desc: "Students design, build, and compete with robots. No experience needed — just curiosity and a willingness to get hands-on."
  },
  {
    name: "Orange Filmworks",
    img: "https://picsum.photos/seed/film/200",
    meets: "Tuesdays, 7 PM · Newhouse 3",
    desc: "A student-run production team that writes, shoots, and edits short films together each semester."
  },
  {
    name: "Cuse Hacks",
    img: "https://picsum.photos/seed/hacks/200",
    meets: "Mondays, 8 PM · CST Building",
    desc: "Syracuse's student hackathon community. Build projects, learn new tools, and meet other builders on campus."
  }
];

function ClubDetailsPage() {
  const [selectedClub, setSelectedClub] = useState(null);

  return (
    <div>
      <header>
        <h1>Explore Clubs</h1>
        <p>Find a club or organization to get involved with at SU.</p>
      </header>

      <div className="club-grid">
        {clubs.map((club) => (
          <button
            key={club.name}
            className="club-card"
            onClick={() => setSelectedClub(club)}
          >
            <img 
              src={club.img} 
              alt={`${club.name} logo`} 
            />

            <span className="club-name">
              {club.name}
            </span>
          </button>
        ))}
      </div>


      {selectedClub && (
        <div className="overlay open">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="club-title"
          >

            <button
              className="close-btn"
              onClick={() => setSelectedClub(null)}
              aria-label="Close club details"
            >
              ✕
            </button>


            <img
              src={selectedClub.img}
              alt={`${selectedClub.name} logo`}
            />


            <h2 id="club-title">
              {selectedClub.name}
            </h2>


            <div className="meta">
              {selectedClub.meets}
            </div>


            <p className="desc">
              {selectedClub.desc}
            </p>


            <button className="join-btn">
              Join club
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default ClubDetailsPage;