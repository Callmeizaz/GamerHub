import React, { useEffect, useRef } from "react";
//ANIMATION AND STYLED
import styled from "styled-components";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { Button } from "../Styles/SharedStyles";
//REDUX and ROUTER
import {
  AllPopularGame,
  NextPage,
  PrevPage,
} from "../Actions/popularGameActions";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
//COMPONENTS
import Game from "./games";
import GameDetail from "./gameDetail";

const PopularGames = ({ match }) => {
  //GETTNG PATH
  const Location = useLocation();
  const History = useHistory();
  const pathId = Location.pathname.split("/")[4];
  const Ref = useRef(true);

  //Redux store
  const { allPopularGame, gameCount, currentPage, gameLoading } = useSelector(
    (state) => state.popular
  );
  //No of pages
  const totalPage = Math.ceil(gameCount / 36);

  //SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  //Handlers
  const PrevHandler = () => {
    if (currentPage <= 1) {
      return;
    } else {
      dispatch(PrevPage());
      History.push(`/popular/games?page=${currentPage - 1}`);
    }
  };

  const NextHandler = () => {
    if (currentPage >= totalPage) {
      console.log("Hello");
      return;
    } else {
      dispatch(NextPage());
      History.push(`/popular/games?page=${currentPage + 1}`);
    }
  };
  //Fetch all popular games
  const dispatch = useDispatch();

  useEffect(() => {
    if (Ref.current) {
      Ref.current = false;
    } else {
      async function fetchGames(page) {
        const games = dispatch(AllPopularGame(page));
        return games;
      }

      fetchGames(currentPage);
    }
  }, [dispatch, currentPage]);

  // {`${currentPage} /popular/games/${popularGames.id}`}
  return (
    <Popular>
      <h2>Popular Games </h2>
      <p>Total results: {gameCount}</p>
      <AnimateSharedLayout type="crossfade">
        <AnimatePresence>
          {pathId && <GameDetail pathId={pathId} curPage={currentPage} />}
        </AnimatePresence>
        {gameLoading ? (
          <h2>Loading</h2>
        ) : (
          <Games>
            {allPopularGame.map((popularGames) => (
              <Link
                to={`/popular/games/${currentPage}/${popularGames.id}`}
                key={popularGames.id}
              >
                <Game
                  name={popularGames.name}
                  img={popularGames.background_image}
                  rating={popularGames.rating}
                  id={popularGames.id}
                  key={popularGames.id}
                  released={popularGames.released}
                />
              </Link>
            ))}
          </Games>
        )}
      </AnimateSharedLayout>
      <Page>
        <Button onClick={PrevHandler}>
          <span>Prev</span>
        </Button>
        <p>{currentPage}</p>
        <Button onClick={NextHandler}>
          <span>Next</span>
        </Button>
      </Page>
    </Popular>
  );
};

//Styled
const Popular = styled(motion.div)`
  margin-bottom: 2rem;
  padding: 1rem 5rem;
  h2 {
    padding: 6rem 0rem 1rem 0rem;
  }
  p {
    padding-bottom: 1rem;
  }
`;

const Games = styled(motion.div)`
  min-height: 80vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  grid-column-gap: 2rem;
  grid-row-gap: 5rem;
`;
//STYLED
const Page = styled(motion.div)`
  padding: 10rem 6rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  p {
    font-weight: bold;
  }
`;

export default PopularGames;
