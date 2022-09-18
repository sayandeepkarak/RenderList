import React, { useEffect } from "react";
import { Card } from "../../Components/Card";
import { CardArea } from "../../Components/Div";
import { useSelector } from "react-redux";
import { useCrudContext } from "../../Context/CrudContext";

const Home = () => {
  const { GetAllPlaylist, miniUpdate, load, searchValue } = useCrudContext();
  const allPlaylists = useSelector((state) => state.allPlayListReducers.value);

  useEffect(() => {
    GetAllPlaylist();
    console.log(allPlaylists);
  }, []);

  const countView = (userid, id, value) => {
    miniUpdate(userid, id, {
      Views: value,
    });
  };

  return (
    <>
      <CardArea>
        {allPlaylists
          .filter((item) => {
            return item["Title"].toLowerCase().includes(searchValue);
          })
          .map((data) => {
            return !data.Hide & (data.Items.length > 0) ? (
              <Card
                key={data.Id}
                data={data}
                viewCount={true}
                viewCounter={countView}
                loading={load}
                videoPlayer={true}
              />
            ) : null;
          })}
      </CardArea>
    </>
  );
};

export default Home;
