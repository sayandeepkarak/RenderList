import React, { useEffect, useState } from "react";
import {
  PlayerWrapper,
  PlayListTitle,
  PlayListTitleArea,
  PlaylistViewBlock,
  TitleBottomtexts,
  VideoList,
  VideoPlayer,
  VideoPlayerArea,
  VideoPlayerBlock,
} from "../../Components/Video";
import rateicon from "../../Assets/Images/rate.png";
import PlaylistItem from "../../Components/PlaylistItem";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ActiveVideo } from "../../Components/Button";
import { fetchActivePlaylist } from "../../App/activePlaylistSlice";

const Watch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeplaylist = useSelector(
    (state) => state.activePlayListReducers.value
  );
  const allPlaylist = useSelector((state) => state.allPlayListReducers.value);
  const { playlist } = useParams();

  allPlaylist.map((e) => e.Id === playlist && dispatch(fetchActivePlaylist(e)));

  const [activeVideo, setactiveVideo] = useState("");
  useEffect(() => {
    activeplaylist === undefined
      ? navigate("/")
      : activeVideo === "" && setactiveVideo(activeplaylist.Items[0].url);
  }, [activeVideo, activeplaylist, navigate]);

  const convertview = (views) => {
    let view;
    if ((views > 999) & (views <= 999999)) {
      view = (views / 1000).toFixed(0).toString() + "k";
    } else if ((views > 999999) & (views < 999999999)) {
      view = (views / 1000000).toFixed(0).toString() + "M";
    } else if ((views > 999999999) & (views < 999999999999)) {
      view = (views / 1000000000).toFixed(0).toString() + "B";
    } else {
      return views;
    }
    return view;
  };

  const handleChangeActiveVideo = (url) => {
    setactiveVideo(url);
  };
  return (
    <>
      <VideoPlayerArea>
        <VideoPlayerBlock>
          <PlayerWrapper>
            <VideoPlayer
              width="100%"
              height="100%"
              url={activeVideo}
              controls
            />
          </PlayerWrapper>
        </VideoPlayerBlock>

        <PlaylistViewBlock>
          <PlayListTitleArea>
            <PlayListTitle>{activeplaylist.Title}</PlayListTitle>
            <TitleBottomtexts>
              <p>5.1</p>
              <img src={rateicon} alt="x" />
              <li>
                <span>{convertview(activeplaylist.Views)} Views</span>
              </li>
              <li>
                <span>{activeplaylist.UserName}</span>
              </li>
            </TitleBottomtexts>
          </PlayListTitleArea>
          <VideoList>
            {activeplaylist.Items?.map((data, i) => (
              <ActiveVideo
                key={i}
                to={`/watch/${activeplaylist.Id}/${data.id}`}
              >
                <PlaylistItem
                  data={data}
                  viewconvert={convertview}
                  activevideo={handleChangeActiveVideo}
                />
              </ActiveVideo>
            ))}
          </VideoList>
        </PlaylistViewBlock>
      </VideoPlayerArea>
    </>
  );
};

export default Watch;
