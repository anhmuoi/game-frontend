import React, { useEffect, useState } from 'react';
import cardImage from 'images/people/attack.png'; // replace with your card image path
import skillImage from 'images/people/attack.png'; // replace with your skill image path
import './styles.css';
import { card52, power } from '../../images/people/index.js';

const CardAnimation = ({ x, y, data, runCountTimePlayer }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation whenever targetPosition changes
    setAnimate(false); // Reset animation state
    const timer = setTimeout(() => {
      setAnimate(true), runCountTimePlayer();
    }, 3000); // Short delay to ensure state reset

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [x, y]);

  //   useEffect(() => {
  //     if (animate) {
  //       const runTimer = setTimeout(() => {
  //         runCountTimePlayer();
  //       }, 0); // Duration of the animation should match the CSS transition duration

  //       return () => clearTimeout(runTimer); // Cleanup timer on component unmount
  //     }
  //   }, [animate, runCountTimePlayer]);

  console.log(x, y);

  let cardImage = null;
  let cardImage1 = null;
  let cardImage2 = null;
  let skillImage = null;
  console.log(data);
  if (data && data.gamePlay) {
    if (data.gamePlay.cardId) {
      if (data.gamePlay.cardId.length == 0) {
        power.map((i) => {
          if (i.id === data.gamePlay.itemNFTId) {
            skillImage = i.image;
          }
        });
      }
      if (data.gamePlay.cardId.length == 1) {
        card52.map((i) => {
          if (i.id === data.gamePlay.cardId[0]) {
            cardImage = i.image;
          }
        });

        power.map((i) => {
          if (i.id === data.gamePlay.itemNFTId) {
            skillImage = i.image;
          }
        });
      }
      if (data.gamePlay.cardId.length == 2) {
        card52.map((i) => {
          if (i.id === data.gamePlay.cardId[0]) {
            cardImage1 = i.image;
          }
          if (i.id === data.gamePlay.cardId[1]) {
            cardImage2 = i.image;
          }
        });
        power.map((i) => {
          if (i.id === data.gamePlay.itemNFTId) {
            skillImage = i.image;
          }
        });
      }
    }
  }
  return (
    <div className="animation-container">
      {cardImage === null &&
      cardImage1 === null &&
      cardImage2 === null ? null : (
        <div
          className={`circle ${animate ? 'animate' : ''}`}
          style={
            animate
              ? {
                  transform: `translate(${x}px, ${y}px) scale(0)`,
                }
              : {}
          }
        >
          <div className="circle-content">
            {cardImage2 !== null ? (
              <React.Fragment>
                <img src={cardImage1} alt="Card" className="card-image-1" />
                <img src={cardImage2} alt="Card" className="card-image-2" />
                {skillImage !== null ? (
                  <img src={skillImage} alt="Skill" className="skill-image-1" />
                ) : null}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <img
                  src={cardImage}
                  alt="Card"
                  className={`card-image ${
                    skillImage === null ? 'card-image-center' : ''
                  }`}
                />
                {skillImage !== null ? (
                  <img src={skillImage} alt="Skill" className="skill-image-1" />
                ) : null}{' '}
              </React.Fragment>
            )}
          </div>
          <div className="border-light"></div>
        </div>
      )}
    </div>
  );
};

export default CardAnimation;
